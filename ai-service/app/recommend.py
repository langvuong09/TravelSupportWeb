from __future__ import annotations

import os

# Limit OpenBLAS threadpool to avoid severe performance issues with implicit ALS
os.environ.setdefault("OPENBLAS_NUM_THREADS", "1")
try:
    from threadpoolctl import threadpool_limits
    threadpool_limits(1, "blas")
except ImportError:
    pass

import numpy as np
import scipy.sparse as sp
from dataclasses import dataclass
from typing import Dict, List, Optional, Tuple

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
    user_map: Dict[int, int]
    item_map: Dict[str, int]


cf_model: Optional[CFModel] = None


# ======================
# UTILS
# ======================
def _event_weight(event: InteractionEvent) -> float:
    return {
        "view": 0.3,
        "click": 0.6,
        "booking": 1.0,
    }.get(event.event_type, 0.2)


def _safe_set_overlap(a: List[int], b: List[int]) -> float:
    if not a:
        return 0.0
    return len(set(a) & set(b)) / len(a)


# ======================
# FEATURE NORMALIZATION
# ======================
def _normalize_candidates(candidates: List[CandidateTour]) -> np.ndarray:
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
# NLP PARSE
# ======================
def _parse_query(query: str) -> dict:
    if not query:
        return {}

    q = query.lower()

    style_key = next(
        (s["key"] for s in STYLES if any(a in q for a in s["aliases"])),
        None
    )

    target_key = next(
        (s["key"] for s in STYLES if s["key"] in ("family", "couple", "group", "solo")
         and any(a in q for a in s["aliases"])),
        None
    )

    return {"style": style_key, "target": target_key}


# ======================
# TRAIN CF
# ======================
def train_cf(events: List[InteractionEvent]) -> None:
    global cf_model

    if not events:
        return

    users = list({e.user_id for e in events})
    items = list({e.tour_id for e in events})

    user_map = {u: i for i, u in enumerate(users)}
    item_map = {t: i for i, t in enumerate(items)}

    rows, cols, data = [], [], []

    for e in events:
        rows.append(user_map[e.user_id])
        cols.append(item_map[e.tour_id])
        data.append(_event_weight(e))

    mat = sp.coo_matrix(
        (data, (rows, cols)),
        shape=(len(users), len(items))
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
def _cf_score(user_id: int, tour_id: str) -> Optional[float]:
    if cf_model is None:
        return None

    u = cf_model.user_map.get(user_id)
    i = cf_model.item_map.get(tour_id)

    if u is None or i is None:
        return None

    if u >= cf_model.model.user_factors.shape[0] or i >= cf_model.model.item_factors.shape[0]:
        return None

    score = np.dot(
        cf_model.model.user_factors[u],
        cf_model.model.item_factors[i]
    )

    return float(1 / (1 + np.exp(-score)))  # sigmoid


# ======================
# CBF SCORE
# ======================
def _cbf_score(
    c: CandidateTour,
    norm: np.ndarray,
    req: PredictRequest,
    parsed: dict
) -> float:

    price_n, dur_n, pop_n = norm

    score = 0.0

    # province match
    if req.province_ids:
        score += 0.6 * _safe_set_overlap(req.province_ids, c.province_ids)

    # duration
    if req.days:
        score += max(0, 0.25 - abs(c.duration_days - req.days) * 0.06)

    # budget
    if req.budget:
        if (
            (req.budget == "low" and c.estimated_price < 2_000_000) or
            (req.budget == "mid" and 2_000_000 <= c.estimated_price <= 5_000_000) or
            (req.budget == "high" and c.estimated_price > 5_000_000)
        ):
            score += 0.3

    # explicit style
    if req.style and req.style != "any" and req.style in c.styles:
        score += 0.3

    # NLP signals
    if parsed.get("style") and parsed["style"] in c.styles:
        score += 0.25

    if parsed.get("target") and parsed["target"] in getattr(c, "targets", []):
        score += 0.2

    # popularity + price preference
    score += 0.15 * pop_n
    score += 0.05 * (1 - price_n)

    return min(score, 1.0)


# ======================
# HYBRID SCORE
# ======================
def _hybrid_score(cbf: float, cf: Optional[float]) -> Tuple[float, str, float]:
    if cf is None:
        return cbf, "cbf", 0.0

    final = 0.3 * cbf + 0.7 * cf
    return final, "hybrid", cf


# ======================
# MAIN RECOMMEND
# ======================
def recommend(req: PredictRequest) -> PredictResponse:

    candidates = req.candidates

    # train CF from incoming interaction history
    if req.interactions:
        train_cf(req.interactions)

    # filter by province
    if req.province_ids:
        candidates = [
            c for c in candidates
            if set(req.province_ids) & set(c.province_ids)
        ]

    if not candidates:
        return PredictResponse(recommendations=[])

    parsed = _parse_query(req.query)
    norm = _normalize_candidates(candidates)

    results: List[PredictionItem] = []

    for i, c in enumerate(candidates):
        cbf = _cbf_score(c, norm[i], req, parsed)
        cf = _cf_score(req.user_id, c.tour_id)

        final, reason, cf_val = _hybrid_score(cbf, cf)

        results.append(
            PredictionItem(
                user_id=req.user_id,
                tour_id=c.tour_id,
                tour_name=c.tour_name,
                location_id=getattr(c, "location_id", None),
                location_name=c.location_name,
                province=getattr(c, "province", c.province_name),
                image=getattr(c, "image", None),
                price=getattr(c, "price", c.estimated_price),
                start_date=getattr(c, "start_date", None),
                end_date=getattr(c, "end_date", None),
                score=round(final, 4),
                cf_score=round(cf_val, 4),
                cbf_score=round(cbf, 4),
                reason=reason,
            )
        )

    results.sort(key=lambda x: x.score, reverse=True)

    return PredictResponse(
        recommendations=results[:req.top_k]
    )