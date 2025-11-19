"""
Queue Manager for Matching Service

Manages the matching queue using Redis sorted sets
"""

import json
import time
from typing import Optional, List, Dict
from redis import Redis
from app.core.config import settings


class QueueManager:
    """Manages matching queue with Redis"""

    def __init__(self, redis_client: Redis):
        self.redis = redis_client
        self.queue_key_prefix = "matching:queue"
        self.user_data_prefix = "matching:user"

    def _get_queue_key(self, gender: str, region: Optional[str] = None) -> str:
        """Get Redis key for queue based on gender and region"""
        if region:
            return f"{self.queue_key_prefix}:{gender}:{region}"
        return f"{self.queue_key_prefix}:{gender}:global"

    def _get_user_data_key(self, user_id: str) -> str:
        """Get Redis key for user data"""
        return f"{self.user_data_prefix}:{user_id}"

    def add_to_queue(
        self, user_id: str, user_data: Dict, priority: Optional[float] = None
    ) -> bool:
        """
        Add user to matching queue

        Args:
            user_id: User ID
            user_data: User profile data
            priority: Optional priority score (default: timestamp)

        Returns:
            True if successfully added
        """
        try:
            # Store user data
            user_key = self._get_user_data_key(user_id)
            self.redis.setex(
                user_key, 3600, json.dumps(user_data)  # 1 hour expiration
            )

            # Add to queue (sorted set with timestamp as score)
            score = priority if priority is not None else time.time()

            gender = user_data.get("gender", "OTHER")
            region = user_data.get("region")

            queue_key = self._get_queue_key(gender, region)
            self.redis.zadd(queue_key, {user_id: score})

            # Also add to global queue for that gender
            global_queue_key = self._get_queue_key(gender)
            self.redis.zadd(global_queue_key, {user_id: score})

            return True

        except Exception as e:
            print(f"Error adding user to queue: {e}")
            return False

    def remove_from_queue(self, user_id: str, user_data: Optional[Dict] = None) -> bool:
        """
        Remove user from matching queue

        Args:
            user_id: User ID
            user_data: Optional user data (if not provided, will fetch from Redis)

        Returns:
            True if successfully removed
        """
        try:
            # Get user data if not provided
            if not user_data:
                user_key = self._get_user_data_key(user_id)
                data = self.redis.get(user_key)
                if data:
                    user_data = json.loads(data)

            if user_data:
                gender = user_data.get("gender", "OTHER")
                region = user_data.get("region")

                # Remove from region queue
                queue_key = self._get_queue_key(gender, region)
                self.redis.zrem(queue_key, user_id)

                # Remove from global queue
                global_queue_key = self._get_queue_key(gender)
                self.redis.zrem(global_queue_key, user_id)

            # Delete user data
            user_key = self._get_user_data_key(user_id)
            self.redis.delete(user_key)

            return True

        except Exception as e:
            print(f"Error removing user from queue: {e}")
            return False

    def get_user_data(self, user_id: str) -> Optional[Dict]:
        """Get user data from Redis"""
        try:
            user_key = self._get_user_data_key(user_id)
            data = self.redis.get(user_key)

            if data:
                return json.loads(data)

            return None

        except Exception as e:
            print(f"Error getting user data: {e}")
            return None

    def get_queue_position(self, user_id: str, gender: str) -> Optional[int]:
        """Get user's position in queue (0-indexed)"""
        try:
            queue_key = self._get_queue_key(gender)
            rank = self.redis.zrank(queue_key, user_id)

            return rank if rank is not None else None

        except Exception as e:
            print(f"Error getting queue position: {e}")
            return None

    def get_queue_size(self, gender: str, region: Optional[str] = None) -> int:
        """Get size of queue"""
        try:
            queue_key = self._get_queue_key(gender, region)
            return self.redis.zcard(queue_key)

        except Exception as e:
            print(f"Error getting queue size: {e}")
            return 0

    def get_candidates(
        self, user_id: str, gender_filter: List[str], limit: int = 50
    ) -> List[Dict]:
        """
        Get potential match candidates from queue

        Args:
            user_id: Current user ID
            gender_filter: List of genders to filter by
            limit: Max number of candidates to return

        Returns:
            List of candidate user data
        """
        candidates = []

        try:
            for gender in gender_filter:
                queue_key = self._get_queue_key(gender)

                # Get all users in queue (sorted by timestamp)
                user_ids = self.redis.zrange(queue_key, 0, -1)

                for uid in user_ids:
                    uid_str = uid.decode("utf-8") if isinstance(uid, bytes) else uid

                    # Skip self
                    if uid_str == user_id:
                        continue

                    # Get user data
                    user_data = self.get_user_data(uid_str)

                    if user_data:
                        candidates.append(user_data)

                    # Stop if we have enough candidates
                    if len(candidates) >= limit:
                        break

                if len(candidates) >= limit:
                    break

            return candidates

        except Exception as e:
            print(f"Error getting candidates: {e}")
            return []

    def cleanup_expired(self) -> int:
        """
        Clean up expired users from all queues

        Returns:
            Number of users cleaned up
        """
        cleaned = 0

        try:
            # Get all queue keys
            queue_keys = self.redis.keys(f"{self.queue_key_prefix}:*")

            for queue_key in queue_keys:
                # Get all users in queue
                user_ids = self.redis.zrange(queue_key, 0, -1)

                for uid in user_ids:
                    uid_str = uid.decode("utf-8") if isinstance(uid, bytes) else uid
                    user_key = self._get_user_data_key(uid_str)

                    # Check if user data exists
                    if not self.redis.exists(user_key):
                        # Remove from queue
                        self.redis.zrem(queue_key, uid_str)
                        cleaned += 1

            return cleaned

        except Exception as e:
            print(f"Error cleaning up expired users: {e}")
            return 0

    def get_estimated_wait_time(self, user_id: str, gender: str) -> int:
        """
        Estimate wait time in seconds based on queue position

        Args:
            user_id: User ID
            gender: User's gender

        Returns:
            Estimated wait time in seconds
        """
        try:
            position = self.get_queue_position(user_id, gender)

            if position is None:
                return 0

            # Estimate: 30 seconds per person ahead in queue
            # This is a rough estimate, can be refined based on actual data
            return max(0, position * 30)

        except Exception as e:
            print(f"Error estimating wait time: {e}")
            return 0
