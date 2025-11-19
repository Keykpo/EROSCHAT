"""
Matching Algorithm for Ero Chat

This algorithm matches users based on:
1. Geographic proximity (city/region)
2. Age preferences (mutual)
3. Gender preferences (mutual)
4. Availability (online in queue)
5. Not previously chatted
"""

import math
from typing import List, Dict, Optional, Tuple
from datetime import datetime


class UserProfile:
    """User profile for matching"""

    def __init__(
        self,
        user_id: str,
        gender: str,
        interested_in: List[str],
        age: int,
        city: Optional[str],
        region: Optional[str],
        latitude: Optional[float],
        longitude: Optional[float],
        min_age: int,
        max_age: int,
        max_distance: int,
        interests: List[str],
        past_chat_partners: List[str],
    ):
        self.user_id = user_id
        self.gender = gender
        self.interested_in = interested_in
        self.age = age
        self.city = city
        self.region = region
        self.latitude = latitude
        self.longitude = longitude
        self.min_age = min_age
        self.max_age = max_age
        self.max_distance = max_distance
        self.interests = interests
        self.past_chat_partners = past_chat_partners


class MatchingAlgorithm:
    """Matching algorithm implementation"""

    @staticmethod
    def calculate_distance(
        lat1: Optional[float],
        lon1: Optional[float],
        lat2: Optional[float],
        lon2: Optional[float],
    ) -> float:
        """
        Calculate distance between two coordinates using Haversine formula
        Returns distance in kilometers
        """
        if not all([lat1, lon1, lat2, lon2]):
            return 0.0  # If coordinates missing, assume same location

        # Radius of Earth in km
        R = 6371.0

        # Convert to radians
        lat1_rad = math.radians(lat1)
        lon1_rad = math.radians(lon1)
        lat2_rad = math.radians(lat2)
        lon2_rad = math.radians(lon2)

        # Haversine formula
        dlat = lat2_rad - lat1_rad
        dlon = lon2_rad - lon1_rad

        a = (
            math.sin(dlat / 2) ** 2
            + math.cos(lat1_rad) * math.cos(lat2_rad) * math.sin(dlon / 2) ** 2
        )
        c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))

        distance = R * c
        return distance

    @staticmethod
    def check_gender_compatibility(user_a: UserProfile, user_b: UserProfile) -> bool:
        """Check if users are interested in each other's gender"""
        # User A must be interested in User B's gender
        a_interested = user_b.gender in user_a.interested_in

        # User B must be interested in User A's gender
        b_interested = user_a.gender in user_b.interested_in

        return a_interested and b_interested

    @staticmethod
    def check_age_compatibility(user_a: UserProfile, user_b: UserProfile) -> bool:
        """Check if users meet each other's age preferences"""
        # User A's age must be in User B's range
        a_in_range = user_b.min_age <= user_a.age <= user_b.max_age

        # User B's age must be in User A's range
        b_in_range = user_a.min_age <= user_b.age <= user_a.max_age

        return a_in_range and b_in_range

    @staticmethod
    def check_location_compatibility(
        user_a: UserProfile, user_b: UserProfile
    ) -> bool:
        """Check if users are within each other's distance preferences"""
        distance = MatchingAlgorithm.calculate_distance(
            user_a.latitude, user_a.longitude, user_b.latitude, user_b.longitude
        )

        # Check if distance is within both users' max distance
        within_a_distance = distance <= user_a.max_distance
        within_b_distance = distance <= user_b.max_distance

        return within_a_distance and within_b_distance

    @staticmethod
    def calculate_interest_similarity(
        user_a: UserProfile, user_b: UserProfile
    ) -> float:
        """
        Calculate similarity score based on common interests
        Returns a score between 0 and 1
        """
        if not user_a.interests or not user_b.interests:
            return 0.0

        interests_a = set(user_a.interests)
        interests_b = set(user_b.interests)

        # Calculate Jaccard similarity
        intersection = len(interests_a.intersection(interests_b))
        union = len(interests_a.union(interests_b))

        if union == 0:
            return 0.0

        return intersection / union

    @staticmethod
    def calculate_compatibility_score(
        user_a: UserProfile, user_b: UserProfile
    ) -> float:
        """
        Calculate overall compatibility score between two users
        Returns a score between 0 and 100
        """
        score = 0.0

        # 1. Interest similarity (40% weight)
        interest_score = (
            MatchingAlgorithm.calculate_interest_similarity(user_a, user_b) * 40
        )
        score += interest_score

        # 2. Age compatibility (30% weight)
        if MatchingAlgorithm.check_age_compatibility(user_a, user_b):
            # Calculate how close they are to each other's preferred age
            age_diff_a = abs(user_a.age - (user_b.min_age + user_b.max_age) / 2)
            age_diff_b = abs(user_b.age - (user_a.min_age + user_a.max_age) / 2)
            avg_age_diff = (age_diff_a + age_diff_b) / 2

            # Normalize (smaller diff = higher score)
            age_score = max(0, 30 - (avg_age_diff / 2))
            score += age_score

        # 3. Location proximity (30% weight)
        if user_a.latitude and user_a.longitude and user_b.latitude and user_b.longitude:
            distance = MatchingAlgorithm.calculate_distance(
                user_a.latitude, user_a.longitude, user_b.latitude, user_b.longitude
            )

            # Normalize (closer = higher score)
            max_distance = max(user_a.max_distance, user_b.max_distance)
            if distance <= max_distance:
                location_score = 30 * (1 - (distance / max_distance))
                score += location_score

        return min(100, score)

    @staticmethod
    def is_compatible(user_a: UserProfile, user_b: UserProfile) -> bool:
        """
        Check if two users are compatible for matching
        This is the main filter before calculating scores
        """
        # 1. Check if already chatted
        if user_b.user_id in user_a.past_chat_partners:
            return False

        if user_a.user_id in user_b.past_chat_partners:
            return False

        # 2. Check gender compatibility
        if not MatchingAlgorithm.check_gender_compatibility(user_a, user_b):
            return False

        # 3. Check age compatibility
        if not MatchingAlgorithm.check_age_compatibility(user_a, user_b):
            return False

        # 4. Check location compatibility (if coordinates available)
        if user_a.latitude and user_a.longitude and user_b.latitude and user_b.longitude:
            if not MatchingAlgorithm.check_location_compatibility(user_a, user_b):
                return False

        return True

    @staticmethod
    def find_best_match(
        user: UserProfile, candidates: List[UserProfile]
    ) -> Optional[Tuple[UserProfile, float]]:
        """
        Find the best match from a list of candidates
        Returns (best_match, score) or None if no compatible match found
        """
        compatible_candidates = []

        # Filter compatible candidates
        for candidate in candidates:
            if candidate.user_id == user.user_id:
                continue

            if MatchingAlgorithm.is_compatible(user, candidate):
                score = MatchingAlgorithm.calculate_compatibility_score(user, candidate)
                compatible_candidates.append((candidate, score))

        if not compatible_candidates:
            return None

        # Sort by score (highest first)
        compatible_candidates.sort(key=lambda x: x[1], reverse=True)

        # Return best match (or random from top 3 for variety)
        import random

        top_matches = compatible_candidates[:3]
        return random.choice(top_matches) if top_matches else None
