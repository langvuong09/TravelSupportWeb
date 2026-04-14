from __future__ import annotations

import numpy as np
import scipy.sparse as sp
from dataclasses import dataclass
from typing import Dict, List, Optional
from sklearn.preprocessing import MinMaxScaler
import implicit


from .schemas import (
    CandidateTour,
    InteractionEvent,
    PredictRequest,
    PredictionItem,
    PredictResponse,
)
from .style_config import STYLES

# ======================
# CONFIG
# ======================
ALS_FACTORS = 32
ALS_ITERATIONS = 40
ALS_REG = 0.08


# ======================
# MODEL HOLDER
# ======================
@dataclass
class CFModel:
    model: object
    user_map: Dict[str, int]
    item_map: Dict[str, int]


cf_model: Optional[CFModel] = None


# ======================
# EVENT WEIGHT
# ======================
def _event_weight(event: InteractionEvent) -> float:
    return {
        "view": 0.3,
        "click": 0.6,
        "booking": 1.0,
    }.get(event.event_type, 0.2)


# ======================
# NORMALIZE FEATURES
# ======================
def _normalize(candidates: List[CandidateTour]):
    X = np.array([
        [
            c.estimated_price or 0,
            c.duration_days or 1,
            c.popularity or 0.45
        ]
        for c in candidates
    ])
    return MinMaxScaler().fit_transform(X)


# ======================
# TRAIN CF (CALL ONCE)
# ======================
def train_cf(events: List[InteractionEvent]):
    global cf_model

    if not events:
        return

    users = list({e.user_id for e in events})
    items = list({e.tour_id for e in events})

    user_map = {u: i for i, u in enumerate(users)}
    item_map = {i: j for j, i in enumerate(items)}

    rows, cols, data = [], [], []

    for e in events:
        rows.append(item_map[e.tour_id])
        cols.append(user_map[e.user_id])
        data.append(_event_weight(e))

    mat = sp.coo_matrix(
        (data, (rows, cols)),
        shape=(len(items), len(users))
    ).tocsr()

    model = implicit.als.AlternatingLeastSquares(
        factors=ALS_FACTORS,
        iterations=ALS_ITERATIONS,
        regularization=ALS_REG,
        random_state=42
    )

    model.fit(mat)

    cf_model = CFModel(model, user_map, item_map)


# ======================
# CF SCORE
# ======================
def _cf_score(user_id: int, item_id: str) -> Optional[float]:
    if not cf_model or not user_id:
        return None

    if user_id not in cf_model.user_map:
        return None

    if item_id not in cf_model.item_map:
        return None

    try:
        u = cf_model.user_map[user_id]
        i = cf_model.item_map[item_id]

        score = np.dot(
            cf_model.model.user_factors[u],
            cf_model.model.item_factors[i]
        )

        return float(1 / (1 + np.exp(-score)))
    except Exception:
        return None


# ======================
# SIMPLE NLP PARSE
# ======================

def _parse_query(query: str):
    if not query:
        return {}

    q = query.lower()
    style_key = None
    target_key = None

    for style in STYLES:
        if any(alias in q for alias in style["aliases"]):
            style_key = style["key"]
            break

    for style in STYLES:
        if style["key"] in ("family", "couple", "group", "solo"):
            if any(alias in q for alias in style["aliases"]):
                target_key = style["key"]
                break

    return {
        "style": style_key,
        "target": target_key
    }


# ======================
# CBF SCORE
# ======================
def _cbf_score(
    c: CandidateTour,
    norm,
    req: PredictRequest,
    parsed: dict
) -> float:

    price_n, dur_n, pop_n = norm

    score = 0.0

    # province match
    if req.province_ids:
        match = len(set(req.province_ids) & set(c.province_ids))
        score += 0.6 * (match / len(req.province_ids))

    # duration
    if req.days:
        score += max(0, 0.25 - abs(c.duration_days - req.days) * 0.06)

    # budget
    if req.budget:
        if req.budget == "low" and c.estimated_price < 2_000_000:
            score += 0.3
        elif req.budget == "mid" and 2_000_000 <= c.estimated_price <= 5_000_000:
            score += 0.3
        elif req.budget == "high" and c.estimated_price > 5_000_000:
            score += 0.3

    # explicit style
    if req.style and req.style != "any":
        if req.style in c.styles:
            score += 0.3

    # NLP style
    if parsed.get("style") and parsed["style"] in c.styles:
        score += 0.25
    if parsed.get("target") and parsed["target"] in getattr(c, "targets", []):
        score += 0.2 

    # popularity boost
    score += 0.15 * pop_n

    # cheaper better
    score += 0.05 * (1 - price_n)

    return min(score, 1.0)


# ======================
# MAIN RECOMMEND
# ======================
def recommend(req: PredictRequest) -> PredictResponse:

    candidates = req.candidates

    # Lọc theo tỉnh nếu có yêu cầu
    if req.province_ids:
        candidates = [
            c for c in candidates
            if set(req.province_ids) & set(c.province_ids)
        ]

    if not candidates:
        return PredictResponse(recommendations=[])

    parsed = _parse_query(req.query)
    norm = _normalize(candidates)

    results: List[PredictionItem] = []

    for i, c in enumerate(candidates):
        cbf = _cbf_score(c, norm[i], req, parsed)
        cf = _cf_score(req.user_id, c.tour_id)

        if cf is None:
            final = cbf
            reason = "cbf"
            cf_val = 0.0
        else:
            final = 0.3 * cbf + 0.7 * cf
            reason = "hybrid"
            cf_val = cf

        results.append(
            PredictionItem(
                tour_id=c.tour_id,
                tour_name=c.tour_name,
                score=round(final, 4),
                cf_score=round(cf_val, 4),
                cbf_score=round(cbf, 4),
                reason=reason,
            )
        )

    # sort đúng kiểu object
    results.sort(key=lambda x: x.score, reverse=True)

    return PredictResponse(
        recommendations=results[:req.top_k],
        data_overview={
            "num_candidates": len(candidates),
            "user_id": req.user_id or "anonymous"
        },
        cleaning_report={},
        normalization_report={},
        visualizations={}
    )