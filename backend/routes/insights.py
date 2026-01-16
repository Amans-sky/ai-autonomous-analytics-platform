from fastapi import APIRouter
from backend.storage.database import get_connection

router = APIRouter(prefix="/insights", tags=["Insights"])


@router.post("/save")
def save_insight(payload: dict):
    conn = get_connection()
    cur = conn.cursor()

    cur.execute(
        """
        INSERT INTO saved_insights (query, view, insight, confidence)
        VALUES (?, ?, ?, ?)
        """,
        (
            payload["query"],
            payload["view"],
            payload["insight"],
            payload["confidence"],
        )
    )

    conn.commit()
    conn.close()
    return {"status": "saved"}


@router.get("/list")
def list_insights():
    conn = get_connection()
    cur = conn.cursor()

    cur.execute("SELECT * FROM saved_insights ORDER BY created_at DESC")
    rows = [dict(r) for r in cur.fetchall()]

    conn.close()
    return rows
