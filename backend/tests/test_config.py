from app.core.config import Settings


def test_cors_origins_accepts_comma_separated_list():
    settings = Settings(
        _env_file=None,
        cors_origins="https://app.example.com,http://localhost:8081",
    )
    assert settings.cors_origins == [
        "https://app.example.com",
        "http://localhost:8081",
    ]


def test_cors_origins_accepts_json_list():
    settings = Settings(
        _env_file=None,
        cors_origins='["https://app.example.com"]',
    )
    assert settings.cors_origins == ["https://app.example.com"]
