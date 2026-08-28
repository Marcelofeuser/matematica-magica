from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes.challenges import router as challenges_router
from app.core.config import settings

app = FastAPI(title="Matemática Mágica API", version="1.0.0")
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=False,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["Content-Type"],
)
app.include_router(challenges_router)


@app.get("/health")
def health_check():
    return {"status": "ok", "service": "matematica-magica"}
