"""
data_analyst_agent.py

Responsible for:
- Schema discovery
- SQL generation
- Analytical execution via MCP
"""

from typing import Dict, Any
from mcp.bigquery_mcp import BigQueryMCP
from mcp.looker_mcp import LookerMCP
from mcp.catalog_mcp import CatalogMCP


class DataAnalystAgent:
    def __init__(self):
        self.catalog = CatalogMCP()
        self.looker = LookerMCP()
        self.bigquery = BigQueryMCP()

    @staticmethod
    def _sanitize(data):
        """
        Replace NaN with None (JSON-safe)
        """
        for row in data:
            for k, v in row.items():
                if v != v:  # NaN check
                    row[k] = None
        return data

    def run_analysis(self, plan: Dict[str, Any]) -> Dict[str, Any]:
        metric = plan["metric"]
        dimensions = plan.get("dimensions", [])
        filters = plan.get("filters", {})
        time_range = plan.get("time_range")

        # Step 1: Validate metric
        self.looker.validate({
            "metric": metric,
            "dimensions": dimensions
        })

        metric_def = self.looker.execute({
            "metric": metric,
            "dimensions": dimensions
        })["definition"]

        # Step 2: Validate dataset
        self.catalog.validate({
            "action": "schema",
            "resource": "sales_orders"
        })

        # Step 3: Build SQL
        select_clause = f"{metric_def} AS {metric}"
        group_clause = ""

        if dimensions:
            select_clause = ", ".join(dimensions) + f", {select_clause}"
            group_clause = f"GROUP BY {', '.join(dimensions)}"

        where_conditions = []

        for k, v in filters.items():
            where_conditions.append(f"{k} = '{v}'")

        if time_range:
            where_conditions.append(
                f"EXTRACT(month FROM order_date) = EXTRACT(month FROM DATE '{time_range}-01')"
            )

        where_clause = (
            f"WHERE {' AND '.join(where_conditions)}"
            if where_conditions else ""
        )

        sql = f"""
        SELECT {select_clause}
        FROM sales_orders
        {where_clause}
        {group_clause}
        """

        # Step 4: Execute
        result = self.bigquery.safe_execute({"sql": sql})

        # Normalize result
        data = result.get("data", [])
        data = self._sanitize(data)

        return {
            "status": "success",
            "metadata": result.get("metadata", {}),
            "data": data
        }
