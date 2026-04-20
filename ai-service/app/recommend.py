from __future__ import annotations
import os
os.environ["OPENBLAS_NUM_THREADS"] = "1"
os.environ["MKL_NUM_THREADS"] = "1"

import numpy as np
import scipy.sparse as sp
from dataclasses import dataclass
from typing import Dict, List, Optional, Tuple
from sklearn.preprocessing import MinMaxScaler
import implicit

from .schemas import (
    CandidateLocation,
    InteractionEvent,
    RecommendationRequest,
    RecommendationItem,
    RecommendationResponse,
)

# ======================
# CONFIG
# ======================
ALS_FACTORS = 32
ALS_ITERATIONS = 40
ALS_REG = 0.08

@dataclass
class CFModel:
    model: object
    user_map: Dict[int, int]
    item_map: Dict[str, int]

cf_model: Optional[CFModel] = None

def _event_weight(event: InteractionEvent) -> float:
    return {"view": 0.3, "click": 0.6, "booking": 1.0}.get(event.event_type, 0.2)

def _normalize_candidates(candidates: List[CandidateLocation]) -> np.ndarray:
    if not candidates: return np.array([])
    X = np.array([[c.estimated_price or 0, c.popularity or 0.45] for c in candidates])
    return MinMaxScaler().fit_transform(X)

def train_cf(events: List[InteractionEvent]) -> None:
    global cf_model
    if not events: return
    users = list({e.user_id for e in events})
    items = list({str(e.location_id) for e in events if e.location_id})
    user_map = {u: i for i, u in enumerate(users)}
    item_map = {i: idx for idx, i in enumerate(items)}
    interaction_dict = {}
    for e in events:
        if e.location_id is None: continue
        key = (user_map[e.user_id], item_map[str(e.location_id)])
        interaction_dict[key] = interaction_dict.get(key, 0) + _event_weight(e)
    rows, cols, data = zip(*[(u, i, w) for (u, i), w in interaction_dict.items()])
    mat = sp.coo_matrix((data, (rows, cols)), shape=(len(users), len(items))).tocsr()
    model = implicit.als.AlternatingLeastSquares(factors=ALS_FACTORS, iterations=ALS_ITERATIONS, regularization=ALS_REG, random_state=42)
    model.fit(mat)
    cf_model = CFModel(model, user_map, item_map)

def _cf_score(user_id: int, item_id: str) -> Optional[float]:
    if cf_model is None: return None
    u, i = cf_model.user_map.get(user_id), cf_model.item_map.get(item_id)
    if u is None or i is None: return None
    score = np.dot(cf_model.model.user_factors[u], cf_model.model.item_factors[i])
    return float(1 / (1 + np.exp(-score)))

def _query_score(c: CandidateLocation, query: str) -> float:
    if not query: return 0.0
    text = f"{c.location_name} {c.province_name} {' '.join(c.styles)}".lower()
    terms = [t.strip() for t in query.lower().split() if t.strip()]
    hits = sum(1 for term in terms if term in text)
    return (hits / len(terms)) * 0.8 if terms else 0.0

def _cbf_score(c: CandidateLocation, norm: np.ndarray, query: str) -> float:
    price_n, pop_n = norm
    base_score = 0.5 * pop_n + 0.3 * (1 - price_n)
    q_score = _query_score(c, query)
    return min(base_score + q_score, 1.0)

def recommend(req: RecommendationRequest) -> RecommendationResponse:
    candidates = req.candidates
    
    # FLOW: Nếu không có tìm kiếm (query), hãy lọc bỏ lịch sử để ưu tiên khám phá nơi mới
    if not req.query and req.history_location_ids:
        history_set = set(str(hid) for hid in req.history_location_ids)
        candidates = [c for c in candidates if str(c.location_id) not in history_set]

    if not candidates: return RecommendationResponse(recommendations=[])

    norm = _normalize_candidates(candidates)
    results = []
    for i, c in enumerate(candidates):
        cbf = _cbf_score(c, norm[i], req.query)
        cf = _cf_score(req.user_id, str(c.location_id))
        
        # Nếu có CF (người dùng cũ), giảm nhẹ trọng số CBF để ưu tiên hành vi thực tế
        final = 0.4 * cbf + 0.6 * cf if cf is not None else cbf
        
        results.append(RecommendationItem(
            location_id=c.location_id,
            location_name=c.location_name,
            province_name=c.province_name,
            image=c.image,
            estimated_price=c.estimated_price or 0,
            score=round(float(final), 4),
            cf_score=round(float(cf or 0.0), 4),
            cbf_score=round(float(cbf), 4)
        ))

    results.sort(key=lambda x: x.score, reverse=True)
    return RecommendationResponse(recommendations=results[:req.top_k])