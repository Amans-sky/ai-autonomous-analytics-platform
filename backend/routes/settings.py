from fastapi import APIRouter
from backend.storage.database import get_connection

router = APIRouter(prefix="/settings", tags=["Settings"])


@router.get("/get")
def get_settings():
    conn = get_connection()
    cur = conn.cursor()

    cur.execute("SELECT key, value FROM settings")
    rows = {row["key"]: row["value"] for row in cur.fetchall()}

    conn.close()
    return rows


@router.post("/set")
def set_settings(payload: dict):
    conn = get_connection()
    cur = conn.cursor()

    for key, value in payload.items():
        cur.execute(
            "REPLACE INTO settings (key, value) VALUES (?, ?)",
            (key, value)
        )

    conn.commit()
    conn.close()
    return {"status": "updated"}
