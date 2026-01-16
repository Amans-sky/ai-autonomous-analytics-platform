"""
narrator_agent.py

Converts numerical output into business insights.
"""

class NarratorAgent:
    def narrate(self, result: dict) -> dict:
        if not result or "data" not in result:
            return {
                "summary": "No data available",
                "rows": 0,
                "data": []
            }

        data = result["data"]

        return {
            "summary": "Analysis completed successfully",
            "rows": len(data),
            "data": data[:5]  # preview
        }
