from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def test_lists_content_without_revealing_answer():
    response = client.get("/challenges")
    assert response.status_code == 200
    challenges = response.json()
    assert len(challenges) == 20
    assert all("correct_answer" not in challenge for challenge in challenges)


def test_filters_by_age_and_theme():
    response = client.get("/challenges", params={"age_group": "age_4_6", "theme": "biblical"})
    assert response.status_code == 200
    assert [challenge["id"] for challenge in response.json()] == ["arca-pares-1", "davi-pedras-1"]


def test_answers_challenge():
    correct = client.post("/challenges/soma-macas-1/answer", json={"answer": "5"})
    incorrect = client.post("/challenges/soma-macas-1/answer", json={"answer": "4"})
    assert correct.status_code == 200 and correct.json()["is_correct"] is True
    assert incorrect.status_code == 200 and incorrect.json()["is_correct"] is False


def test_unknown_challenge_returns_404():
    assert client.get("/challenges/inexistente").status_code == 404


def test_content_has_unique_ids_valid_answers_and_all_combinations():
    from app.api.routes.challenges import load_challenges

    challenges = load_challenges()
    ids = [challenge.id for challenge in challenges]
    assert len(ids) == len(set(ids))
    assert all(challenge.correct_answer in challenge.options for challenge in challenges)
    assert all(len(challenge.options) == len(set(challenge.options)) for challenge in challenges)

    age_groups = {"age_1_3", "age_4_6", "age_7_9", "age_10_12", "age_13_15"}
    themes = {"general", "biblical"}
    combinations = {(challenge.age_group, challenge.theme) for challenge in challenges}
    assert combinations == {(age, theme) for age in age_groups for theme in themes}


def test_every_adventure_has_at_least_two_challenges():
    for age_group in ("age_1_3", "age_4_6", "age_7_9", "age_10_12", "age_13_15"):
        for theme in ("general", "biblical"):
            response = client.get("/challenges", params={"age_group": age_group, "theme": theme})
            assert response.status_code == 200
            assert len(response.json()) >= 2
