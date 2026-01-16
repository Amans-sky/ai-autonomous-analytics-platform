"""
agent_router.py

Orchestrates agent execution.
Phase 3: Adds persistence of successful insights.
"""

from agents.planner_agent import PlannerAgent
from agents.data_analyst_agent import DataAnalystAgent
from agents.database_agent import DatabaseAgent
from agents.narrator_agent import NarratorAgent
from backend.guardrails import enforce
from backend.storage.database import get_connection


class AgentRouter:
    def __init__(self):
        self.planner = PlannerAgent()
        self.analyst = DataAnalystAgent()
        self.db_agent = DatabaseAgent()
        self.narrator = NarratorAgent()

    def handle(self, user_query: str, view: str = "natural"):
        plan = self.planner.create_plan(user_query)
        plan["view"] = view  # Phase 3: persist sidebar context

        try:
            enforce(plan)
        except ValueError as e:
            return {
                "status": "rejected",
                "reason": str(e),
                "confidence": plan.get("confidence"),
                "suggestion": (
                    "Please ask a more specific business question "
                    "(metric, time range, dimension)."
                ),
            }

        # Run analytics
        result = self.analyst.run_analysis(plan)
        approved = self.db_agent.approve(result)

        # Narrate insight
        insight = self.narrator.narrate(approved)

        # Phase 3: Persist successful insight
        conn = get_connection()
        cur = conn.cursor()

        cur.execute(
            """
            INSERT INTO saved_insights (query, view, insight, confidence)
            VALUES (?, ?, ?, ?)
            """,
            (
                user_query,
                view,
                insight.get("summary"),
                plan.get("confidence", 0.0),
            ),
        )

        conn.commit()
        conn.close()

        return {
            "status": "success",
            "insight": insight,
            "confidence": plan.get("confidence"),
        }
