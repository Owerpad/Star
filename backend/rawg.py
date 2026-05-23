import os
import json
import httpx
from fastapi import HTTPException

RAWG_KEY = os.getenv("RAWG_API_KEY", "")


def search_rawg(query: str):
    if not RAWG_KEY:
        raise HTTPException(status_code=400, detail="RAWG API key not configured")

    url = "https://api.rawg.io/api/games"
    params = {"key": RAWG_KEY, "search": query, "page_size": 1}

    with httpx.Client() as client:
        resp = client.get(url, params=params)
        if resp.status_code != 200:
            raise HTTPException(status_code=502, detail="RAWG API error")

        data = resp.json()
        results = data.get("results", [])
        if not results:
            raise HTTPException(status_code=404, detail="Game not found on RAWG")

        game = results[0]
        game_id = game["id"]

        detail_resp = client.get(f"{url}/{game_id}", params={"key": RAWG_KEY})
        description = ""
        if detail_resp.status_code == 200:
            description = detail_resp.json().get("description_raw", "")

        screenshots = []
        screenshots_resp = client.get(f"{url}/{game_id}/screenshots", params={"key": RAWG_KEY})
        if screenshots_resp.status_code == 200:
            screenshots = [s["image"] for s in screenshots_resp.json().get("results", [])]

        return {
            "title": game.get("name", ""),
            "description": description,
            "genre": ", ".join(g["name"] for g in game.get("genres", [])),
            "cover_url": game.get("background_image", ""),
            "screenshots": json.dumps(screenshots[:5]),
        }
