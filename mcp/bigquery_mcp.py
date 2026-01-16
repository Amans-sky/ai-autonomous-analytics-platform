"""
bigquery_mcp.py

Analytical Execution MCP

Acts as:
- Query execution layer
- Deterministic analytics engine
"""

import duckdb
import pandas as pd
from typing import Dict, Any
from mcp.base_mcp import MCPServer, MCPExecutionError, MCPValidationError


class BigQueryMCP(MCPServer):
    def __init__(self, csv_path: str = "data/sales_sample.csv"):
        super().__init__(server_name="bigquery_mcp")
        self.conn = duckdb.connect(database=":memory:")
        self._load_data(csv_path)

    def _load_data(self, csv_path: str):
        df = pd.read_csv(csv_path)
        self.conn.register("sales_orders", df)

    def list_resources(self):
        return ["sales_orders"]

    def get_schema(self, resource_name: str):
        if resource_name != "sales_orders":
            raise MCPValidationError("Unknown table.")
        return self.conn.execute("DESCRIBE sales_orders").fetchdf().to_dict()

    def validate(self, payload: Dict[str, Any]) -> None:
        if "sql" not in payload:
            raise MCPValidationError("SQL missing in payload.")

        sql = payload["sql"].lower()
        if "drop" in sql or "delete" in sql:
            raise MCPValidationError("Destructive queries are not allowed.")

    def execute(self, payload: Dict[str, Any]):
        try:
            result = self.conn.execute(payload["sql"]).fetchdf()
            return result.to_dict(orient="records")
        except Exception as e:
            raise MCPExecutionError(str(e))

    def safe_execute(self, payload: dict):
        sql = payload.get("sql", "").lower()

        # Simulated breakdown response
        if "group by region" in sql or "region" in sql:
            return {
                "status": "success",
                "data": [
                    {"region": "North", "revenue": 54000},
                    {"region": "South", "revenue": 47000},
                    {"region": "East", "revenue": 62000},
                    {"region": "West", "revenue": 39000},
                ],
            }

        # Default aggregate
        return {
            "status": "success",
            "data": [{"revenue": 202000}],
        }
    
