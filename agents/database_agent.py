"""
database_agent.py

Governance & approval layer.
"""

class DatabaseAgent:
    def approve(self, execution_result: dict) -> dict:
        # Trust upstream agents; just enforce structure
        if "data" not in execution_result:
            raise ValueError("Invalid execution result")

        return execution_result
