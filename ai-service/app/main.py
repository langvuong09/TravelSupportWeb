import os

from dotenv import load_dotenv
from fastapi import FastAPI, Request

from .recommend import recommend
from .schemas import RecommendationRequest, RecommendationResponse

load_dotenv()

app = FastAPI(title="Travel AI Service", version="1.0.0")


@app.get("/health")
def health() -> dict:
    return {"status": "ok", "service": "ai-service"}


@app.post("/predict", response_model=RecommendationResponse)
async def predict(request: Request) -> RecommendationResponse:
    raw = await request.body()
    if not raw:
        payload = RecommendationRequest()
    else:
        payload = RecommendationRequest.model_validate_json(raw)
    return recommend(payload)


@app.post("/train")
async def train(request: Request):
    import json
    from .recommend import train_cf
    from .schemas import InteractionEvent
    
    raw = await request.body()
    data = json.loads(raw)
    # Nếu data là một danh sách các dict, nạp chúng thành InteractionEvent
    events = [InteractionEvent(**e) for e in data]
    train_cf(events)
    return {"status": "success", "message": f"Mô hình đã được luyện với {len(events)} tương tác."}


@app.post("/train-nlp")
async def train_nlp():
    from .nlp_trainer import train as train_nlp_model
    try:
        train_nlp_model()
        return {"status": "success", "message": "Mô hình NLP Intent đã được huấn luyện lại thành công."}
    except Exception as e:
        return {"status": "error", "message": str(e)}


if __name__ == "__main__":
    import uvicorn

    host = os.getenv("AI_SERVICE_HOST", "0.0.0.0")
    port = int(os.getenv("AI_SERVICE_PORT", "8001"))
    uvicorn.run("app.main:app", host=host, port=port, reload=True)
