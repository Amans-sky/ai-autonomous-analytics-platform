# backend/api.py

from fastapi import FastAPI, Query, Body
from backend.agent_router import AgentRouter

# 🔹 Phase 3: Persistence
from backend.storage.database import init_db
from backend.routes.insights import router as insights_router
from backend.routes.settings import router as settings_router

# -------------------------------------------------
# Initialize database (runs once at startup)
# -------------------------------------------------
init_db()

# -------------------------------------------------
# FastAPI App
# -------------------------------------------------
app = FastAPI(
    title="AI Analytics Dashboard API",
    version="1.0.0",
)

# -------------------------------------------------
# Core Agent Router
# -------------------------------------------------
router = AgentRouter()

# -------------------------------------------------
# Health Check
# -------------------------------------------------
@app.get("/")
def health():
    return {"status": "ok"}

# -------------------------------------------------
# Phase 1: Natural Language Analytics
# -------------------------------------------------
@app.get("/analyze")
def analyze(query: str = Query(..., min_length=3)):
    """
    Phase 1:
    - Free-form natural language analytics
    - Guardrails handled inside AgentRouter
    """
    return router.handle(query)

# -------------------------------------------------
# Phase 2: Sidebar-driven Analytics
# -------------------------------------------------
@app.post("/analyze-view")
def analyze_view(payload: dict = Body(...)):
    """
    Phase 2:
    Sidebar-controlled analytics intent
    """
    view = payload.get("view")
    base_query = payload.get("query", "revenue")

    view_to_prompt = {
        "kpi-overview": f"total {base_query} last month",
        "trend-analysis": f"trend of {base_query} over last 6 months",
        "breakdown": f"breakdown of {base_query} by region",
        "saved-insights": "show saved insights",
    }

    final_query = view_to_prompt.get(view, base_query)
    return router.handle(final_query)

# -------------------------------------------------
# Phase 3: Saved Insights & Settings APIs
# -------------------------------------------------
app.include_router(insights_router)
app.include_router(settings_router)

# -------------------------------------------------
# Global Safety Net (Never crash API)
# -------------------------------------------------
@app.exception_handler(Exception)
async def safe_exception_handler(request, exc):
    return {
        "status": "error",
        "message": str(exc),
    }
