# AI Service for TravelSupportWeb

This service provides AI-based recommendation logic for the TravelSupportWeb project, built with Python FastAPI.

---

## 1. Setup

```powershell
cd ai-service
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

---

## 2. Run the Service

```powershell
cd ai-service
.\.venv\Scripts\Activate.ps1
python -m app.main
```

- The service runs by default at: http://localhost:8001

---

## 3. Import Database Data

Ensure your database is running and accessible. Then run:

```powershell
python ../Database/insert_data.py
```

---

## 4. API Endpoints

### Health Check

- `GET /health`

### Recommendation

- `POST /predict`
- **Request Body Example:**

```json
{
  "query": "goi y tour bien 3 ngay",
  "budget": "mid",
  "days": 3,
  "style": "beach",
  "participants": 2,
  "province_ids": [1, 2],
  "top_k": 3,
  "candidates": [
    {
      "tour_id": "T001",
      "tour_name": "Tour Bien 3N2D",
      "province_ids": [1, 2],
      "location_name": "Bai bien A",
      "province_name": "Tinh A",
      "estimated_price": 1800000,
      "duration_days": 3,
      "style_tokens": ["beach", "family"],
      "popularity": 0.72
    }
  ]
}
```

- **Response:**
  - List of recommended tours with scores and reasons.

---

## 5. Integration with Java Backend

- Java backend can call: `POST http://localhost:8001/predict`
- Receives a ranked list of recommendations.

---

## 6. Quick Test with curl

```powershell
curl -X POST http://localhost:8001/predict `
  -H "Content-Type: application/json" `
  -d '{
    "query":"tour bien",
    "participants":2,
    "top_k":2,
    "candidates":[{"tour_id":"T001","tour_name":"A","province_ids":[1],"estimated_price":1500000,"duration_days":3,"style_tokens":["beach"],"popularity":0.7}]
  }'
```

---

## 7. Notes

- Ensure all required Python packages are installed (see requirements.txt).
- The service does not manage the database schema; ensure your schema matches the expected data fields.
- For development, use a virtual environment to avoid dependency conflicts.
