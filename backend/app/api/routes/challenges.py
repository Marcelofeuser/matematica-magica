import json
from functools import lru_cache
from pathlib import Path
from typing import Literal

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field

router = APIRouter(prefix="/challenges", tags=["Challenges"])
AgeGroup = Literal["age_1_3", "age_4_6", "age_7_9", "age_10_12", "age_13_15"]
Theme = Literal["general", "biblical"]
CONTENT_DIR = Path(__file__).resolve().parents[4] / "content" / "challenges"


class Challenge(BaseModel):
    id: str
    age_group: AgeGroup
    theme: Theme = "general"
    title: str
    question: str
    options: list[str] = Field(min_length=2)
    explanation: str


class StoredChallenge(Challenge):
    correct_answer: str


class AnswerRequest(BaseModel):
    answer: str = Field(min_length=1, max_length=100)


class AnswerResponse(BaseModel):
    challenge_id: str
    is_correct: bool
    explanation: str


@lru_cache
def load_challenges() -> tuple[StoredChallenge, ...]:
    challenges: list[StoredChallenge] = []
    for path in sorted(CONTENT_DIR.glob("*/challenges.json")):
        with path.open(encoding="utf-8") as file:
            challenges.extend(StoredChallenge.model_validate(item) for item in json.load(file))
    return tuple(challenges)


@router.get("", response_model=list[Challenge])
def list_challenges(age_group: AgeGroup | None = None, theme: Theme | None = None) -> list[StoredChallenge]:
    return [
        challenge for challenge in load_challenges()
        if (age_group is None or challenge.age_group == age_group)
        and (theme is None or challenge.theme == theme)
    ]


def find_challenge(challenge_id: str) -> StoredChallenge:
    challenge = next((item for item in load_challenges() if item.id == challenge_id), None)
    if challenge is None:
        raise HTTPException(status_code=404, detail="Desafio não encontrado.")
    return challenge


@router.get("/{challenge_id}", response_model=Challenge)
def get_challenge(challenge_id: str) -> StoredChallenge:
    return find_challenge(challenge_id)


@router.post("/{challenge_id}/answer", response_model=AnswerResponse)
def answer_challenge(challenge_id: str, payload: AnswerRequest) -> AnswerResponse:
    challenge = find_challenge(challenge_id)
    is_correct = payload.answer.strip().casefold() == challenge.correct_answer.casefold()
    return AnswerResponse(
        challenge_id=challenge.id,
        is_correct=is_correct,
        explanation=challenge.explanation,
    )
