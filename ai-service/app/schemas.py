from typing import List, Optional

from pydantic import BaseModel, Field


class CandidateLocation(BaseModel):
    province_ids: List[int] = Field(default_factory=list)
    location_id: Optional[int] = None
    location_name: str = ""
    province_name: str = ""
    province: str = ""
    image: Optional[str] = None
    estimated_price: int = 0
    styles: List[str] = Field(default_factory=list)
    popularity: float = 0.45


class InteractionEvent(BaseModel):
    user_id: int
    location_id: Optional[int] = None
    event_type: str = "view"
    value: float = 1.0


class RecommendationRequest(BaseModel):
    user_id: int
    query: str = ""
    location_id: Optional[int] = None
    province_ids: List[int] = Field(default_factory=list)
    history_location_ids: List[str] = Field(default_factory=list)
    interactions: List[InteractionEvent] = Field(default_factory=list)
    top_k: int = 3
    candidates: List[CandidateLocation] = Field(default_factory=list)


class RecommendationItem(BaseModel):
    user_id: Optional[int] = None
    location_id: Optional[int] = None
    location_name: str = ""
    province_name: str = ""
    image: Optional[str] = None
    estimated_price: int = 0
    score: float
    cf_score: float = 0.0
    cbf_score: float = 0.0


class RecommendationResponse(BaseModel):
    recommendations: List[RecommendationItem] = Field(default_factory=list)
