"""
catalog_mcp.py

Catalog MCP Server

Responsibilities:
- Dataset discovery
- Schema exposure
- Governance and metadata enforcement
- Prevent hallucinated tables/columns
- Act as the single source of truth for available data assets

This MCP is queried BEFORE any analytical execution.
"""

from typing import Dict, List, Any
from mcp.base_mcp import MCPServer, MCPValidationError


class CatalogMCP(MCPServer):
    """
    Catalog MCP acts as a governed data catalog.

    Agents must consult this MCP to:
    - Discover datasets
    - Inspect schemas
    - Verify allowed joins and fields
    """

    def __init__(self):
        super().__init__(server_name="catalog_mcp")

        # Centralized metadata store (mocked, but enterprise-realistic)
        self._catalog = {
            "sales_orders": {
                "description": "Transactional sales order data",
                "columns": {
                    "order_id": "Unique order identifier",
                    "order_amount": "Total monetary value of the order",
                    "region": "Geographical sales region",
                    "product": "Product name",
                    "order_date": "Date of order placement"
                },
                "primary_key": "order_id",
                "allowed_joins": []
            }
        }

    # ------------------------------------------------------------------
    # MCP Interface Implementation
    # ------------------------------------------------------------------

    def list_resources(self) -> List[str]:
        """
        List all registered datasets.
        """
        return list(self._catalog.keys())

    def get_schema(self, resource_name: str) -> Dict[str, Any]:
        """
        Return schema and metadata for a dataset.
        """
        if resource_name not in self._catalog:
            raise MCPValidationError(
                f"Dataset '{resource_name}' not found in catalog."
            )

        dataset = self._catalog[resource_name]

        return {
            "dataset": resource_name,
            "description": dataset["description"],
            "columns": dataset["columns"],
            "primary_key": dataset["primary_key"],
            "allowed_joins": dataset["allowed_joins"]
        }

    def validate(self, payload: Dict[str, Any]) -> None:
        """
        Validate catalog access requests.

        Expected payload:
        {
            "action": "list" | "schema",
            "resource": "<dataset_name>" (required for schema)
        }
        """
        action = payload.get("action")

        if action not in {"list", "schema"}:
            raise MCPValidationError(
                "Invalid catalog action. Must be 'list' or 'schema'."
            )

        if action == "schema":
            resource = payload.get("resource")
            if not resource:
                raise MCPValidationError(
                    "Missing 'resource' for schema lookup."
                )

            if resource not in self._catalog:
                raise MCPValidationError(
                    f"Dataset '{resource}' is not registered in catalog."
                )

    def execute(self, payload: Dict[str, Any]) -> Dict[str, Any]:
        """
        Execute catalog operations after validation.
        """
        action = payload["action"]

        if action == "list":
            return {
                "datasets": self.list_resources()
            }

        if action == "schema":
            resource = payload["resource"]
            return self.get_schema(resource)

        # Should never reach here due to validation
        raise MCPValidationError("Unsupported catalog operation.")
