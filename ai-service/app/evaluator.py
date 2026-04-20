import os
os.environ["OPENBLAS_NUM_THREADS"] = "1"
os.environ["MKL_NUM_THREADS"] = "1"

import random
import mysql.connector
from typing import List, Dict, Tuple
from dotenv import load_dotenv

from .schemas import InteractionEvent, RecommendationRequest, CandidateLocation
from .recommend import recommend, train_cf

load_dotenv()

class DatabaseLoader:
    """Tải dữ liệu thực tế từ MySQL."""
    @staticmethod
    def get_connection():
        return mysql.connector.connect(
            host=os.getenv("DB_HOST", "localhost"),
            user=os.getenv("DB_USER", "root"),
            password=os.getenv("DB_PASSWORD", "123456"),
            database=os.getenv("DB_NAME", "travelsupport")
        )

    @classmethod
    def load_data(cls) -> Tuple[List[CandidateLocation], List[InteractionEvent]]:
        conn = cls.get_connection()
        cursor = conn.cursor(dictionary=True)
        cursor.execute("""
            SELECT l.location_id, l.name, l.type, l.estimated_cost, l.province_id, l.image, p.name as province_name 
            FROM locations l
            LEFT JOIN provinces p ON l.province_id = p.province_id
        """)
        locations = [CandidateLocation(
            location_id=row['location_id'],
            location_name=row['name'],
            styles=[row['type']] if row['type'] else [],
            estimated_price=row['estimated_cost'],
            province_ids=[row['province_id']],
            province_name=row['province_name'],
            image=row['image']
        ) for row in cursor.fetchall()]
        cursor.execute("SELECT user_id, location_id, event_type, value FROM user_interactions")
        interactions = [InteractionEvent(
            user_id=row['user_id'],
            location_id=row['location_id'],
            event_type=row['event_type'],
            value=float(row['value'])
        ) for row in cursor.fetchall()]
        cursor.close()
        conn.close()
        return locations, interactions

class RecommendationEvaluator:
    def __init__(self, top_k: int = 5):
        self.top_k = top_k

    def leave_one_out_split(self, events: List[InteractionEvent]):
        user_map = {}
        for e in events:
            user_map.setdefault(e.user_id, []).append(e)
        train, test = [], {}
        for user, evs in user_map.items():
            if len(evs) < 2:
                train.extend(evs)
                continue
            evs.sort(key=lambda x: x.value) 
            target = evs[-1]
            if target.location_id:
                test[user] = target.location_id
                train.extend(evs[:-1])
            else:
                train.extend(evs)
        return train, test

    def evaluate(self, train_events, test_cases, candidates):
        print("--- 2. Building CF model from train data ---")
        train_cf(train_events)

        hits = 0
        mrr = 0
        total_eval_users = len(test_cases)

        print(f"--- 3. Evaluating {total_eval_users} users (Production Full Ranking) ---")
        for user, target in test_cases.items():
            
            # Lấy lịch sử THỰC TẾ nhưng loại bỏ target để test khả năng đoán của AI
            history_ids = [e.location_id for e in train_events if e.user_id == user and e.location_id != target]

            # Gửi TOÀN BỘ ứng viên vào như môi trường Production thật
            req = RecommendationRequest(
                user_id=user,
                top_k=self.top_k,
                candidates=candidates,
                history_location_ids=[str(hid) for hid in history_ids]
            )

            res = recommend(req)
            rec_ids = [r.location_id for r in res.recommendations]

            if target in rec_ids:
                hits += 1
                rank = rec_ids.index(target) + 1
                mrr += 1.0 / rank

        total = total_eval_users if total_eval_users > 0 else 1
        return {
            "hit_rate": hits / total,
            "mrr": mrr / total,
            "total_users": total_eval_users
        }

def run():
    print("--- 1. Loading data from Database ---")
    candidates, events = DatabaseLoader.load_data()
    evaluator = RecommendationEvaluator(top_k=5)
    train, test = evaluator.leave_one_out_split(events)
    results = evaluator.evaluate(train, test, candidates)

    print("\n=== FINAL PRODUCTION EVALUATION RESULT ===")
    print(f"Top-K: {evaluator.top_k}")
    print(f"Hit Rate @ {evaluator.top_k}: {results['hit_rate']*100:.2f}%")
    print(f"MRR: {results['mrr']:.4f}")
    print(f"Total Users Tested: {results['total_users']}")

if __name__ == "__main__":
    run()