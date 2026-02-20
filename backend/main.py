from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
import os

from db.database import init_db
from routers import receipts, items, categories, trends

app = FastAPI(
    title="Pantry — Grocery Bill Analyzer",
    description="Personal grocery receipt tracking with AI categorization",
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(receipts.router, prefix="/api/receipts", tags=["receipts"])
app.include_router(items.router,    prefix="/api/items",    tags=["items"])
app.include_router(categories.router, prefix="/api/categories", tags=["categories"])
app.include_router(trends.router,   prefix="/api/trends",   tags=["trends"])

# Serve frontend static files
FRONTEND_DIR = "/app/frontend"
if os.path.exists(FRONTEND_DIR):
    app.mount("/assets", StaticFiles(directory=f"{FRONTEND_DIR}/assets"), name="assets")

    @app.get("/", include_in_schema=False)
    async def serve_frontend():
        return FileResponse(f"{FRONTEND_DIR}/index.html")

@app.on_event("startup")
async def on_startup():
    await init_db()

@app.get("/api/health")
async def health():
    return {"status": "ok", "version": "0.1.0"}


@app.get("/api/diagnose")
async def diagnose():
    """Check that all dependencies are working inside the container."""
    import subprocess, os as _os
    results = {}

    # Tesseract binary
    try:
        r = subprocess.run(["tesseract", "--version"], capture_output=True, text=True, timeout=5)
        results["tesseract"] = {"ok": r.returncode == 0, "version": r.stdout.split("\n")[0].strip()}
    except FileNotFoundError:
        results["tesseract"] = {"ok": False, "error": "tesseract binary not found in PATH"}
    except Exception as e:
        results["tesseract"] = {"ok": False, "error": str(e)}

    # pytesseract
    try:
        import pytesseract
        results["pytesseract"] = {"ok": True}
    except ImportError as e:
        results["pytesseract"] = {"ok": False, "error": str(e)}

    # Pillow
    try:
        from PIL import Image
        results["pillow"] = {"ok": True}
    except ImportError as e:
        results["pillow"] = {"ok": False, "error": str(e)}

    # HEIC/HEIF support
    try:
        from pillow_heif import register_heif_opener
        results["heic_support"] = {"ok": True}
    except ImportError:
        results["heic_support"] = {"ok": False, "error": "pillow-heif not installed — HEIC files unsupported"}

    # Data dir
    results["data_dir"] = {
        "ok": _os.path.isdir("/data"),
        "writable": _os.access("/data", _os.W_OK),
        "images_dir": _os.environ.get("IMAGE_DIR", "/data/images"),
    }

    # Anthropic key
    key = _os.environ.get("ANTHROPIC_API_KEY", "")
    results["anthropic_key"] = {
        "ok": bool(key and key.startswith("sk-")),
        "set": bool(key),
        "hint": (key[:14] + "…") if key else "(not set)",
    }

    return {"all_ok": all(v.get("ok") for v in results.values()), "checks": results}
