from fastapi import FastAPI, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import redis
from app.core.config import settings
from app.services.matching_algorithm import MatchingAlgorithm, UserProfile
from app.services.queue_manager import QueueManager

# Initialize FastAPI app
app = FastAPI(title=settings.APP_NAME, debug=settings.DEBUG)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify allowed origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize Redis
redis_client = redis.from_url(settings.REDIS_URL, decode_responses=False)
queue_manager = QueueManager(redis_client)


# ============================================
# MODELS
# ============================================


class UserProfileRequest(BaseModel):
    user_id: str
    gender: str
    interested_in: List[str]
    age: int
    city: Optional[str] = None
    region: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    min_age: int = 18
    max_age: int = 99
    max_distance: int = 50
    interests: List[str] = []
    past_chat_partners: List[str] = []


class MatchRequest(BaseModel):
    user: UserProfileRequest


class MatchResponse(BaseModel):
    success: bool
    match: Optional[dict] = None
    message: Optional[str] = None
    estimated_wait_time: Optional[int] = None


# ============================================
# ENDPOINTS
# ============================================


@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "ok",
        "service": "matching-service",
        "redis": "connected" if redis_client.ping() else "disconnected",
    }


@app.post("/match/find", response_model=MatchResponse)
async def find_match(request: MatchRequest, background_tasks: BackgroundTasks):
    """
    Find a match for the user

    This endpoint:
    1. Adds user to queue
    2. Searches for compatible candidates
    3. Returns best match or queues user for later
    """
    user_data = request.user.model_dump()
    user_id = user_data["user_id"]

    try:
        # Create user profile object
        user_profile = UserProfile(
            user_id=user_data["user_id"],
            gender=user_data["gender"],
            interested_in=user_data["interested_in"],
            age=user_data["age"],
            city=user_data.get("city"),
            region=user_data.get("region"),
            latitude=user_data.get("latitude"),
            longitude=user_data.get("longitude"),
            min_age=user_data.get("min_age", 18),
            max_age=user_data.get("max_age", 99),
            max_distance=user_data.get("max_distance", 50),
            interests=user_data.get("interests", []),
            past_chat_partners=user_data.get("past_chat_partners", []),
        )

        # Get candidates from queue based on user's interested_in
        candidates_data = queue_manager.get_candidates(
            user_id, user_data["interested_in"], limit=100
        )

        if not candidates_data:
            # No candidates available, add user to queue
            queue_manager.add_to_queue(user_id, user_data)

            estimated_wait = queue_manager.get_estimated_wait_time(
                user_id, user_data["gender"]
            )

            return MatchResponse(
                success=False,
                message="No matches available. You have been added to the queue.",
                estimated_wait_time=estimated_wait,
            )

        # Convert candidates to UserProfile objects
        candidate_profiles = []
        for cand_data in candidates_data:
            candidate_profile = UserProfile(
                user_id=cand_data["user_id"],
                gender=cand_data["gender"],
                interested_in=cand_data["interested_in"],
                age=cand_data["age"],
                city=cand_data.get("city"),
                region=cand_data.get("region"),
                latitude=cand_data.get("latitude"),
                longitude=cand_data.get("longitude"),
                min_age=cand_data.get("min_age", 18),
                max_age=cand_data.get("max_age", 99),
                max_distance=cand_data.get("max_distance", 50),
                interests=cand_data.get("interests", []),
                past_chat_partners=cand_data.get("past_chat_partners", []),
            )
            candidate_profiles.append(candidate_profile)

        # Find best match using algorithm
        best_match = MatchingAlgorithm.find_best_match(user_profile, candidate_profiles)

        if best_match:
            matched_user, score = best_match

            # Remove matched user from queue
            queue_manager.remove_from_queue(matched_user.user_id)

            return MatchResponse(
                success=True,
                match={
                    "user_id": matched_user.user_id,
                    "compatibility_score": round(score, 2),
                },
                message="Match found!",
            )
        else:
            # No compatible matches, add to queue
            queue_manager.add_to_queue(user_id, user_data)

            estimated_wait = queue_manager.get_estimated_wait_time(
                user_id, user_data["gender"]
            )

            return MatchResponse(
                success=False,
                message="No compatible matches found. You have been added to the queue.",
                estimated_wait_time=estimated_wait,
            )

    except Exception as e:
        print(f"Error finding match: {e}")
        raise HTTPException(status_code=500, detail=f"Error finding match: {str(e)}")


@app.post("/queue/join")
async def join_queue(request: MatchRequest):
    """Add user to matching queue"""
    user_data = request.user.model_dump()
    user_id = user_data["user_id"]

    try:
        success = queue_manager.add_to_queue(user_id, user_data)

        if success:
            estimated_wait = queue_manager.get_estimated_wait_time(
                user_id, user_data["gender"]
            )

            return {
                "success": True,
                "message": "Added to queue",
                "estimated_wait_time": estimated_wait,
                "queue_position": queue_manager.get_queue_position(
                    user_id, user_data["gender"]
                ),
            }
        else:
            raise HTTPException(status_code=500, detail="Failed to join queue")

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/queue/leave")
async def leave_queue(user_id: str, gender: str):
    """Remove user from matching queue"""
    try:
        success = queue_manager.remove_from_queue(user_id)

        if success:
            return {"success": True, "message": "Removed from queue"}
        else:
            raise HTTPException(status_code=404, detail="User not found in queue")

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/queue/status/{user_id}")
async def queue_status(user_id: str):
    """Get user's queue status"""
    try:
        user_data = queue_manager.get_user_data(user_id)

        if not user_data:
            raise HTTPException(status_code=404, detail="User not found in queue")

        position = queue_manager.get_queue_position(user_id, user_data["gender"])
        estimated_wait = queue_manager.get_estimated_wait_time(
            user_id, user_data["gender"]
        )

        return {
            "in_queue": True,
            "position": position,
            "estimated_wait_time": estimated_wait,
        }

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/queue/stats")
async def queue_stats():
    """Get queue statistics"""
    try:
        stats = {
            "queues": {},
            "total_users": 0,
        }

        genders = ["MALE", "FEMALE", "NON_BINARY", "OTHER"]

        for gender in genders:
            size = queue_manager.get_queue_size(gender)
            stats["queues"][gender] = size
            stats["total_users"] += size

        return stats

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/queue/cleanup")
async def cleanup_queue():
    """Clean up expired users from queue (admin endpoint)"""
    try:
        cleaned = queue_manager.cleanup_expired()

        return {"success": True, "cleaned": cleaned, "message": f"Cleaned {cleaned} expired users"}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ============================================
# STARTUP / SHUTDOWN
# ============================================


@app.on_event("startup")
async def startup_event():
    """Run on startup"""
    print(f"🚀 {settings.APP_NAME} started")
    print(f"📊 Redis: {settings.REDIS_URL}")

    # Test Redis connection
    try:
        redis_client.ping()
        print("✅ Redis connected")
    except Exception as e:
        print(f"❌ Redis connection failed: {e}")


@app.on_event("shutdown")
async def shutdown_event():
    """Run on shutdown"""
    print(f"👋 {settings.APP_NAME} shutting down")
    redis_client.close()
