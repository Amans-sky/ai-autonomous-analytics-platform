"""
agent_router.py

Orchestrates agent execution.
"""

from agents.planner_agent import PlannerAgent
from agents.data_analyst_agent import DataAnalystAgent
from agents.database_agent import DatabaseAgent
from agents.narrator_agent import NarratorAgent
from backend.guardrails import enforce


class AgentRouter:
    def __init__(self):
        self.planner = PlannerAgent()
        self.analyst = DataAnalystAgent()
        self.db_agent = DatabaseAgent()
        self.narrator = NarratorAgent()

    def handle(self, user_query: str):
        plan = self.planner.create_plan(user_query)

        try:
            enforce(plan)
        except ValueError as e:
            # Graceful guardrail response (NO 500 error)
            return {
                "status": "rejected",
                "reason": str(e),
                "confidence": plan.get("confidence"),
                "suggestion": "Please ask a more specific business question (metric, time range, dimension)."
            }

        result = self.analyst.run_analysis(plan)
        approved = self.db_agent.approve(result)

        return {
            "status": "success",
            "insight": self.narrator.narrate(approved),
            "confidence": plan.get("confidence")
        }
        print(type(approved))
        print(type(self.narrator.narrate(approved)))

