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
    CandidateLocation,
    InteractionEvent,
    RecommendationRequest,
    RecommendationItem,
    RecommendationResponse,
)
from .nlp_utils import extract_intents, match_style_weight


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
def _normalize_candidates(candidates: List[CandidateLocation]) -> np.ndarray:
    X = np.array([
        [
            c.estimated_price or 0,
            c.popularity or 0.45
        ]
        for c in candidates
    ])

    return MinMaxScaler().fit_transform(X)


# ======================
# TRAIN CF
# ======================
def train_cf(events: List[InteractionEvent]) -> None:
    global cf_model

    if not events:
        return

    users = list({e.user_id for e in events})
    items = list({str(e.location_id) for e in events if e.location_id is not None})

    user_map = {u: i for i, u in enumerate(users)}
    item_map = {t: i for i, t in enumerate(items)}

    rows, cols, data = [], [], []

    for e in events:
        if e.location_id is None:
            continue
        item_id = str(e.location_id)
        rows.append(user_map[e.user_id])
        cols.append(item_map[item_id])
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
def _cf_score(user_id: int, item_id: Optional[str]) -> Optional[float]:
    if cf_model is None or item_id is None:
        return None

    u = cf_model.user_map.get(user_id)
    i = cf_model.item_map.get(item_id)

    if u is None or i is None:
        return None

    if u >= cf_model.model.user_factors.shape[0] or i >= cf_model.model.item_factors.shape[0]:
        return None

    score = np.dot(
        cf_model.model.user_factors[u],
        cf_model.model.item_factors[i]
    )

    return float(1 / (1 + np.exp(-score)))  # sigmoid


def _query_score(c: CandidateLocation, query: str) -> float:
    if not query:
        return 0.0

    text = " ".join(
        filter(None, [c.location_name, c.province_name, " ".join(c.styles)])
    ).lower()
    terms = [t.strip() for t in query.lower().split() if t.strip()]
    if not terms:
        return 0.0

    hits = sum(1 for term in terms if term in text)
    return min(0.4, (hits / len(terms)) * 0.4)


# ======================
# CBF SCORE
# ======================
def _cbf_score(
    c: CandidateLocation,
    norm: np.ndarray,
    req: RecommendationRequest,
) -> float:

    price_n, pop_n = norm

    score = 0.0
    query_intents = extract_intents(req.query)

    if req.province_ids:
        score += 0.6 * _safe_set_overlap(req.province_ids, c.province_ids)

    score += _query_score(c, req.query)
    score += match_style_weight(c.styles, query_intents)

    score += 0.2 * pop_n
    score += 0.1 * (1 - price_n)

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
def recommend(req: RecommendationRequest) -> RecommendationResponse:

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

    # drop the current location from recommendation results
    if req.location_id is not None:
        candidates = [
            c for c in candidates
            if c.location_id != req.location_id
        ]

    if not candidates:
        return RecommendationResponse(recommendations=[])

    norm = _normalize_candidates(candidates)

    results: List[RecommendationItem] = []

    for i, c in enumerate(candidates):
        cbf = _cbf_score(c, norm[i], req)
        item_id = str(c.location_id) if c.location_id is not None else None
        cf = _cf_score(req.user_id, item_id)

        final, _, cf_val = _hybrid_score(cbf, cf)

        results.append(
            RecommendationItem(
                user_id=req.user_id,
                location_id=getattr(c, "location_id", None),
                location_name=c.location_name,
                province=getattr(c, "province", c.province_name),
                image=getattr(c, "image", None),
                price=getattr(c, "price", c.estimated_price),
                score=round(final, 4),
                cf_score=round(cf_val, 4),
                cbf_score=round(cbf, 4),
            )
        )

    results.sort(key=lambda x: x.score, reverse=True)

    return RecommendationResponse(
        recommendations=results[:req.top_k]
    )