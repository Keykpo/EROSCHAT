# Matching Service - Ero Chat

Python/FastAPI service for intelligent user matching based on preferences and compatibility.

## Features

- ✅ Intelligent matching algorithm
- ✅ Redis-based queue management
- ✅ Geographic proximity matching (Haversine distance)
- ✅ Age and gender compatibility
- ✅ Interest-based scoring
- ✅ Real-time queue statistics

## Setup

### 1. Install Dependencies

```bash
pip install -r requirements.txt
```

Or with virtual environment:

```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

### 2. Configure Environment

Make sure Redis is running (via Docker Compose in root):

```bash
# From root directory
docker-compose up -d redis
```

### 3. Run Service

```bash
uvicorn app.main:app --reload --port 8000
```

Service will start on `http://localhost:8000`

## API Endpoints

### Health Check
```
GET /health
```

### Find Match
```
POST /match/find
Body: {
  "user": {
    "user_id": "uuid",
    "gender": "MALE",
    "interested_in": ["FEMALE"],
    "age": 28,
    "city": "Barcelona",
    "latitude": 41.3851,
    "longitude": 2.1734,
    "min_age": 25,
    "max_age": 35,
    "max_distance": 50,
    "interests": ["Travel", "Music"],
    "past_chat_partners": []
  }
}
```

### Join Queue
```
POST /queue/join
Body: { "user": { ... } }
```

### Leave Queue
```
POST /queue/leave?user_id=uuid&gender=MALE
```

### Queue Status
```
GET /queue/status/{user_id}
```

### Queue Stats
```
GET /queue/stats
```

## Matching Algorithm

The algorithm calculates compatibility based on:

1. **Interest Similarity (40%)**: Jaccard similarity of interests
2. **Age Compatibility (30%)**: How well ages match preferences
3. **Location Proximity (30%)**: Distance between users

### Compatibility Filters

Before scoring, users must meet:
- ✅ Gender preferences (mutual)
- ✅ Age range preferences (mutual)
- ✅ Distance preferences
- ✅ Not previously chatted

### Distance Calculation

Uses Haversine formula for accurate distance calculation between coordinates.

## Testing

```bash
pytest
```

## Example Usage

### Python
```python
import httpx

async with httpx.AsyncClient() as client:
    response = await client.post(
        "http://localhost:8000/match/find",
        json={
            "user": {
                "user_id": "123",
                "gender": "MALE",
                "interested_in": ["FEMALE"],
                "age": 28,
                # ... other fields
            }
        }
    )
    print(response.json())
```

### cURL
```bash
curl -X POST http://localhost:8000/match/find \
  -H "Content-Type: application/json" \
  -d '{
    "user": {
      "user_id": "123",
      "gender": "MALE",
      "interested_in": ["FEMALE"],
      "age": 28,
      "min_age": 25,
      "max_age": 35,
      "interests": ["Travel"]
    }
  }'
```

## Tech Stack

- **Framework**: FastAPI
- **Queue**: Redis (sorted sets)
- **Algorithm**: Custom compatibility scoring
- **Testing**: pytest

## Project Structure

```
app/
├── main.py                        # FastAPI app & endpoints
├── core/
│   └── config.py                  # Configuration
├── services/
│   ├── matching_algorithm.py     # Matching logic
│   └── queue_manager.py          # Redis queue management
├── models/                        # Pydantic models
└── api/                          # API routes
```
