"""
guardrails.py

Centralized safety checks.
"""

def enforce(plan: dict):
    if plan["confidence"] < 0.3:
        raise ValueError("Low confidence query. Please clarify intent.")
