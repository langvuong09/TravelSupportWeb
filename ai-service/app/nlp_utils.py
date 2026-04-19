import json
import pickle
import re
import unicodedata
from pathlib import Path
from typing import Dict, List, Optional

from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.pipeline import Pipeline

BUNDLE_DIR = Path(__file__).resolve().parent.parent
INTENT_MODEL_PATH = BUNDLE_DIR / "data" / "intent_pipeline.pkl"
INTENT_DATA_PATH = BUNDLE_DIR / "data" / "intent_data.json"

INTENT_KEYWORDS: Dict[str, List[str]] = {
    "romantic": [
        "cặp đôi", "cap doi", "hẹn hò", "hen ho", "lãng mạn", "lang man",
        "tình yêu", "tinh yeu", "romantic", "couple", "date"
    ],
    "shopping": [
        "chợ", "shopping", "mua sắm", "mua sam", "mall", "trung tâm thương mại"
    ],
    "beach": [
        "biển", "bien", "resort", "nghỉ mát", "nghi mat", "sea", "coast"
    ],
    "culture": [
        "di tích", "di tich", "chùa", "museum", "bảo tàng", "bao tang",
        "lịch sử", "lich su", "heritage"
    ],
    "nature": [
        "khu sinh thái", "khu sinh thai", "công viên", "cong vien", "hồ", "ho",
        "thác", "thac", "núi", "nui", "rừng", "rung"
    ],
    "family": [
        "gia đình", "gia dinh", "bọn trẻ", "team", "nhóm bạn", "nhom ban"
    ],
    "adventure": [
        "phượt", "phuot", "mạo hiểm", "mao hiem", "trải nghiệm", "trai nghiem"
    ]
}

STYLE_KEYWORDS: Dict[str, List[str]] = {
    "romantic": ["khu du lịch", "khu du lich", "hồ", "ho", "khu sinh thái", "khu sinh thai", "di tích", "di tich", "chùa", "chua"],
    "shopping": ["chợ", "cho", "mall", "trung tâm", "trung tam", "shopping"],
    "beach": ["biển", "bien", "resort", "bãi", "bai", "hé", "he"],
    "culture": ["di tích", "di tich", "chùa", "chua", "bảo tàng", "bao tang", "lịch sử", "lich su", "museum"],
    "nature": ["khu sinh thái", "khu sinh thai", "công viên", "cong vien", "hồ", "ho", "thác", "thac", "núi", "nui", "rừng", "rung"],
    "family": ["family", "gia đình", "gia dinh", "team", "nhóm bạn", "nhom ban"],
    "adventure": ["phượt", "phuot", "mạo hiểm", "mao hiem", "trải nghiệm", "trai nghiem"]
}

NORMALIZATION_RE = re.compile(r"[^a-z0-9\s]+", re.IGNORECASE)
_intent_pipeline: Optional[Pipeline] = None


def normalize_text(text: str) -> str:
    if not text:
        return ""
    normalized = unicodedata.normalize("NFD", text)
    normalized = re.sub(r"[\u0300-\u036f]", "", normalized)
    normalized = NORMALIZATION_RE.sub(" ", normalized).lower()
    return re.sub(r"\s+", " ", normalized).strip()


def _load_intent_pipeline() -> Optional[Pipeline]:
    global _intent_pipeline
    if _intent_pipeline is not None:
        return _intent_pipeline
    if not INTENT_MODEL_PATH.exists():
        return None
    try:
        with open(INTENT_MODEL_PATH, "rb") as handle:
            _intent_pipeline = pickle.load(handle)
            return _intent_pipeline
    except Exception:
        return None


def extract_intents(text: str) -> List[str]:
    normalized = normalize_text(text)
    if not normalized:
        return []
    pipeline = _load_intent_pipeline()
    if pipeline is not None:
        try:
            prediction = pipeline.predict([normalized])
            return [prediction[0]] if prediction else []
        except Exception:
            pass

    intents: List[str] = []
    for intent, patterns in INTENT_KEYWORDS.items():
        if any(pattern in normalized for pattern in patterns):
            intents.append(intent)
    return intents


def extract_preferred_styles(text: str) -> List[str]:
    normalized = normalize_text(text)
    styles: List[str] = []
    for intent, patterns in STYLE_KEYWORDS.items():
        if any(pattern in normalized for pattern in patterns):
            styles.append(intent)
    return styles


def match_style_weight(styles: List[str], query_intents: List[str]) -> float:
    if not query_intents:
        return 0.0
    normalized_styles = [normalize_text(style) for style in styles if style]
    score = 0.0
    for intent in query_intents:
        patterns = STYLE_KEYWORDS.get(intent, [])
        for style in normalized_styles:
            if any(pattern in style for pattern in patterns):
                score += 0.25
                break
    return min(score, 0.5)
