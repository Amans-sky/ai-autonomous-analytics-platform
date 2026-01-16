"""
base_mcp.py

Defines the base contract for all Model Context Protocol (MCP) servers.

This module enforces:
- Strict tool-based data access (no free-form execution)
- Schema awareness
- Observability and logging
- Enterprise-grade guardrails

All MCP implementations (BigQuery, Looker, Catalog, etc.)
MUST inherit from this base class.
"""

from abc import ABC, abstractmethod
from typing import Any, Dict, List
from datetime import datetime
import uuid


class MCPExecutionError(Exception):
    """Raised when an MCP execution fails in a controlled manner."""
    pass


class MCPValidationError(Exception):
    """Raised when validation or contract checks fail."""
    pass


class MCPServer(ABC):
    """
    Abstract base class for all MCP servers.

    MCP servers act as the ONLY allowed interface between AI agents
    and enterprise data systems.

    Direct database access by agents is strictly forbidden.
    """

    def __init__(self, server_name: str):
        self.server_name = server_name
        self.server_id = str(uuid.uuid4())

    # ------------------------------------------------------------------
    # Required MCP Capabilities
    # ------------------------------------------------------------------

    @abstractmethod
    def list_resources(self) -> List[str]:
        """
        List datasets / models / resources exposed by this MCP server.

        Example:
        - BigQuery: datasets or tables
        - Looker: explores or views
        - Catalog: registered datasets
        """
        raise NotImplementedError

    @abstractmethod
    def get_schema(self, resource_name: str) -> Dict[str, Any]:
        """
        Return the schema for a given resource.

        Must include:
        - Column names
        - Data types
        - Optional descriptions

        Agents use this to prevent hallucinations.
        """
        raise NotImplementedError

    @abstractmethod
    def validate(self, payload: Dict[str, Any]) -> None:
        """
        Validate incoming execution payloads.

        This is where:
        - Metric correctness
        - Allowed operations
        - Security checks
        are enforced.

        Raises MCPValidationError on failure.
        """
        raise NotImplementedError

    @abstractmethod
    def execute(self, payload: Dict[str, Any]) -> Dict[str, Any]:
        """
        Execute a validated request.

        Execution MUST:
        - Be deterministic
        - Be logged
        - Return structured output (never raw text)

        Raises MCPExecutionError on failure.
        """
        raise NotImplementedError

    # ------------------------------------------------------------------
    # Shared Utility Methods
    # ------------------------------------------------------------------

    def _execution_metadata(self) -> Dict[str, Any]:
        """
        Generate standard execution metadata for observability.
        """
        return {
            "mcp_server": self.server_name,
            "server_id": self.server_id,
            "timestamp": datetime.utcnow().isoformat()
        }

    def _success_response(self, data: Any) -> Dict[str, Any]:
        """
        Standard success response format.
        """
        return {
            "status": "success",
            "metadata": self._execution_metadata(),
            "data": data
        }

    def _error_response(self, error: Exception) -> Dict[str, Any]:
        """
        Standard error response format.
        """
        return {
            "status": "error",
            "metadata": self._execution_metadata(),
            "error_type": type(error).__name__,
            "message": str(error)
        }

    # ------------------------------------------------------------------
    # Safe Public Execution Wrapper
    # ------------------------------------------------------------------

    def safe_execute(self, payload: Dict[str, Any]) -> Dict[str, Any]:
        """
        Safe execution wrapper used by agents.

        Enforces:
        1. Validation
        2. Controlled execution
        3. Structured responses
        4. No unhandled exceptions
        """
        try:
            self.validate(payload)
            result = self.execute(payload)
            return self._success_response(result)

        except (MCPValidationError, MCPExecutionError) as known_error:
            return self._error_response(known_error)

        except Exception as unknown_error:
            # Fail closed — never leak stack traces to agents
            wrapped_error = MCPExecutionError(
                "Unexpected MCP failure. Execution aborted safely."
            )
            return self._error_response(wrapped_error)
