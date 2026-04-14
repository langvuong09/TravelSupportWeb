import os

from dotenv import load_dotenv
from fastapi import FastAPI, Request

from .recommend import recommend
from .schemas import PredictRequest, PredictResponse

load_dotenv()

app = FastAPI(title="Travel AI Service", version="1.0.0")


@app.get("/health")
def health() -> dict:
    return {"status": "ok", "service": "ai-service"}


@app.post("/predict", response_model=PredictResponse)
async def predict(request: Request) -> PredictResponse:
    raw = await request.body()
    if not raw:
        payload = PredictRequest()
    else:
        payload = PredictRequest.model_validate_json(raw)
    return recommend(payload)


if __name__ == "__main__":
    import uvicorn

    host = os.getenv("AI_SERVICE_HOST", "0.0.0.0")
    port = int(os.getenv("AI_SERVICE_PORT", "8001"))
    uvicorn.run("app.main:app", host=host, port=port, reload=True)
