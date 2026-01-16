"""
looker_mcp.py

Semantic Layer MCP

Purpose:
- Enforce metric correctness
- Prevent inconsistent business logic
- Act as a semantic contract for analytics
"""

from typing import Dict, Any
from mcp.base_mcp import MCPServer, MCPValidationError


class LookerMCP(MCPServer):
    def __init__(self):
        super().__init__(server_name="looker_mcp")

        # Mock semantic model (enterprise-realistic)
        self._metrics = {
            "revenue": {
                "definition": "SUM(order_amount)",
                "description": "Total revenue from all orders",
                "allowed_dimensions": ["region", "product", "order_date"]
            },
            "orders": {
                "definition": "COUNT(order_id)",
                "description": "Total number of orders",
                "allowed_dimensions": ["region", "product", "order_date"]
            }
        }

    def list_resources(self):
        return list(self._metrics.keys())

    def get_schema(self, resource_name: str):
        if resource_name not in self._metrics:
            raise MCPValidationError(f"Metric '{resource_name}' not defined.")
        return self._metrics[resource_name]

    def validate(self, payload: Dict[str, Any]) -> None:
        metric = payload.get("metric")
        dimensions = payload.get("dimensions", [])

        if metric not in self._metrics:
            raise MCPValidationError(f"Metric '{metric}' is not approved.")

        allowed_dims = self._metrics[metric]["allowed_dimensions"]
        for dim in dimensions:
            if dim not in allowed_dims:
                raise MCPValidationError(
                    f"Dimension '{dim}' not allowed for metric '{metric}'."
                )

    def execute(self, payload: Dict[str, Any]):
        metric = payload["metric"]
        return self._metrics[metric]
