"""
planner_agent.py

Responsible for converting a natural language analytics question
into a structured, deterministic execution plan.

Key design principles:
- NO data access
- NO SQL generation
- NO assumptions about schemas
- Output is fully machine-consumable by downstream agents

This mirrors how real autonomous planner agents work in production AI systems.
"""

from typing import Dict, List, Optional
from dataclasses import dataclass, asdict
import re


# ---------------------------------------------------------------------
# Data Models
# ---------------------------------------------------------------------

@dataclass
class AnalysisPlan:
    """
    Structured representation of an analytical intent.

    This plan is passed to downstream agents and MCP servers.
    """
    metric: str
    dimensions: List[str]
    filters: Dict[str, str]
    time_range: Optional[str]
    analysis_types: List[str]
    comparison: Optional[str]
    confidence: float


# ---------------------------------------------------------------------
# Planner Agent
# ---------------------------------------------------------------------

class PlannerAgent:
    """
    PlannerAgent decomposes user intent into an executable analysis plan.

    It is deliberately conservative:
    - If intent is ambiguous, confidence is lowered
    - Downstream guardrails may reject low-confidence plans
    """

    SUPPORTED_ANALYSIS_TYPES = {
        "trend",
        "contribution",
        "comparison",
        "forecast",
        "distribution"
    }

    METRIC_KEYWORDS = {
        "revenue": ["revenue", "sales", "income"],
        "orders": ["orders", "transactions"],
        "customers": ["customers", "users", "buyers"]
    }

    REGION_PATTERN = re.compile(r"\b(north|south|east|west)\b", re.IGNORECASE)
    MONTH_PATTERN = re.compile(
        r"\b(january|february|march|april|may|june|july|august|september|october|november|december)\b",
        re.IGNORECASE
    )

    def __init__(self):
        pass

    # -----------------------------------------------------------------
    # Public API
    # -----------------------------------------------------------------

    def create_plan(self, user_query: str) -> Dict:
        """
        Entry point used by the backend router.

        Returns a dictionary representation of AnalysisPlan.
        """
        plan = self._build_plan(user_query)
        return asdict(plan)

    # -----------------------------------------------------------------
    # Internal Logic
    # -----------------------------------------------------------------

    def _build_plan(self, query: str) -> AnalysisPlan:
        query_lower = query.lower()

        metric = self._extract_metric(query_lower)
        dimensions = self._extract_dimensions(query_lower)
        filters = self._extract_filters(query_lower)
        time_range = self._extract_time_range(query_lower)
        analysis_types = self._extract_analysis_types(query_lower)
        comparison = self._extract_comparison(query_lower)

        confidence = self._estimate_confidence(
            metric, analysis_types, time_range
        )

        return AnalysisPlan(
            metric=metric,
            dimensions=dimensions,
            filters=filters,
            time_range=time_range,
            analysis_types=analysis_types,
            comparison=comparison,
            confidence=confidence
        )

    # -----------------------------------------------------------------
    # Extraction Helpers
    # -----------------------------------------------------------------

    def _extract_metric(self, query: str) -> str:
        for metric, keywords in self.METRIC_KEYWORDS.items():
            if any(keyword in query for keyword in keywords):
                return metric
        return "unknown_metric"

    def _extract_dimensions(self, query: str) -> List[str]:
        dimensions = []

        if self.REGION_PATTERN.search(query):
            dimensions.append("region")

        if "product" in query:
            dimensions.append("product")

        return dimensions

    def _extract_filters(self, query: str) -> Dict[str, str]:
        filters = {}

        region_match = self.REGION_PATTERN.search(query)
        if region_match:
            filters["region"] = region_match.group(1).capitalize()

        return filters

    def _extract_time_range(self, query: str) -> Optional[str]:
        month_match = self.MONTH_PATTERN.search(query)
        if month_match:
            return month_match.group(1).capitalize()

        if "last month" in query:
            return "last_month"

        if "last year" in query:
            return "last_year"

        return None

    def _extract_analysis_types(self, query: str) -> List[str]:
        analysis_types = []

        if any(word in query for word in ["why", "reason", "cause"]):
            analysis_types.append("contribution")

        if any(word in query for word in ["trend", "over time", "change"]):
            analysis_types.append("trend")

        if any(word in query for word in ["compare", "vs", "versus"]):
            analysis_types.append("comparison")

        if any(word in query for word in ["forecast", "predict", "future"]):
            analysis_types.append("forecast")

        # Fallback
        if not analysis_types:
            analysis_types.append("trend")

        # Ensure supported types only
        return [
            at for at in analysis_types
            if at in self.SUPPORTED_ANALYSIS_TYPES
        ]

    def _extract_comparison(self, query: str) -> Optional[str]:
        if "month over month" in query or "mom" in query:
            return "month_over_month"

        if "year over year" in query or "yoy" in query:
            return "year_over_year"

        return None

    # -----------------------------------------------------------------
    # Confidence Estimation
    # -----------------------------------------------------------------

    def _estimate_confidence(
        self,
        metric: str,
        analysis_types: List[str],
        time_range: Optional[str]
    ) -> float:
        score = 1.0

        if metric == "unknown_metric":
            score -= 0.4

        if not time_range:
            score -= 0.2

        if not analysis_types:
            score -= 0.2

        return max(score, 0.0)
