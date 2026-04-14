from typing import Any, Dict, List

from pydantic import BaseModel, Field


class CandidateTour(BaseModel):
    tour_id: str
    tour_name: str
    province_ids: List[int] = Field(default_factory=list)
    location_name: str = ""
    province_name: str = ""
    estimated_price: int = 0
    duration_days: int = 1
    styles: List[str] = Field(default_factory=list)
    popularity: float = 0.45



class InteractionEvent(BaseModel):
    user_id: int 
    tour_id: str
    event_type: str = "view"
    value: float = 1.0


class PredictRequest(BaseModel):
    user_id: int 
    query: str = ""
    budget: str = "any"
    days: int = 3
    style: str = "any"
    participants: int = 1
    province_ids: List[int] = Field(default_factory=list)
    history_tour_ids: List[str] = Field(default_factory=list)
    interactions: List[InteractionEvent] = Field(default_factory=list)
    top_k: int = 3
    candidates: List[CandidateTour] = Field(default_factory=list)


class PredictionItem(BaseModel):
    tour_id: str
    tour_name: str
    score: float
    cf_score: float = 0.0
    cbf_score: float = 0.0
    reason: str


class PredictResponse(BaseModel):
    recommendations: List[PredictionItem] = Field(default_factory=list)
    data_overviexw: Dict[str, Any] = Field(default_factory=dict)
    cleaning_report: Dict[str, Any] = Field(default_factory=dict)
    normalization_report: Dict[str, Any] = Field(default_factory=dict)
    visualizations: Dict[str, Any] = Field(default_factory=dict)
