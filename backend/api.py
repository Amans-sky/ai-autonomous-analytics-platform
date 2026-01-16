# backend/api.py

from fastapi import FastAPI, Query, Body
from fastapi.middleware.cors import CORSMiddleware
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

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
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
    time_range = payload.get("timeRange", "6m")

    # Convert time range to readable format
    time_range_map = {
        "1m": "last month",
        "3m": "last 3 months",
        "6m": "last 6 months",
        "1y": "last year",
        "2y": "last 2 years",
        "all": "all time"
    }
    time_period = time_range_map.get(time_range, "last 6 months")

    view_to_prompt = {
        "kpi-overview": f"total {base_query} {time_period}",
        "trend-analysis": f"Analyze the trend of {base_query} over the {time_period}. Provide detailed insights about growth patterns, seasonal variations, significant changes, and future projections based on historical data. Include percentage changes, key drivers, and actionable recommendations.",
        "breakdown": f"Provide a detailed breakdown of {base_query} by region, category, and time period for the {time_period}. Analyze performance across different segments, identify top/bottom performers, calculate market share percentages, and explain the factors contributing to variations between segments.",
        "saved-insights": "show saved insights",
    }

    final_query = view_to_prompt.get(view, base_query)
    return router.handle(final_query)

# -------------------------------------------------
# Phase 3: Saved Insights & Settings APIs
# -------------------------------------------------
app.include_router(insights_router)
app.include_router(settings_router)

# Alias for saved-insights to match frontend expectation
@app.get("/saved-insights")
def get_saved_insights():
    from backend.routes.insights import list_insights
    data = list_insights()
    return {"status": "success", "data": data}

# -------------------------------------------------
# Global Safety Net (Never crash API)
# -------------------------------------------------
@app.exception_handler(Exception)
async def safe_exception_handler(request, exc):
    return {
        "status": "error",
        "message": str(exc),
    }
