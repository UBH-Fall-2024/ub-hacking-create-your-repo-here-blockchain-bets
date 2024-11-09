import requests
import json
import time
import os
from dotenv import load_dotenv
from datetime import datetime

# Load API key from .env file
load_dotenv()
API_KEY = os.getenv('SPORTRADAR_API_KEY')
BASE_URL = "https://api.sportradar.com/nba/trial/v8/en"
HEADERS = {"accept": "application/json"}

# Ensure the output directory exists
OUTPUT_DIR = "data_responses"
os.makedirs(OUTPUT_DIR, exist_ok=True)

# Function to fetch data from a specified endpoint


def fetch_data(endpoint, filename, retries=3):
    url = f"{BASE_URL}/{endpoint}?api_key={API_KEY}"
    for attempt in range(retries):
        response = requests.get(url, headers=HEADERS)
        if response.status_code == 200:
            with open(os.path.join(OUTPUT_DIR, filename), "w") as f:
                json.dump(response.json(), f, indent=4)
            print(f"Data saved to {filename}")
            return
        elif response.status_code == 429:
            print(
                f"Rate limit hit. Retrying after delay... (Attempt {attempt + 1}/{retries})")
            time.sleep(2 ** attempt)  # Exponential backoff
        else:
            print(
                f"Failed to fetch data from {url} - Status code: {response.status_code}")
            return
    print(
        f"Failed to fetch data from {url} after {retries} attempts due to rate limiting.")

# Function calls for each specific endpoint


def fetch_all_data():
    # Set today's date
    today = datetime.now()
    year = today.strftime("%Y")
    month = today.strftime("%m")
    day = today.strftime("%d")

    # Define endpoints and filenames
    endpoints = {
        "league_changes": ("league/2024/01/27/changes.json", "league_changes.json"),
        "daily_schedule": (f"games/{year}/{month}/{day}/schedule.json", "daily_schedule.json"),
        "game_boxscore": ("games/aaa3ddb3-dd1b-459e-a686-d2bfc4408881/boxscore.json", "game_boxscore.json"),
        "game_summary": ("games/aaa3ddb3-dd1b-459e-a686-d2bfc4408881/summary.json", "game_summary.json"),
        "league_hierarchy": ("league/hierarchy.json", "league_hierarchy.json"),
        "season_leaders": ("seasons/2023/REG/leaders.json", "season_leaders.json"),
        "game_pbp": ("games/aaa3ddb3-dd1b-459e-a686-d2bfc4408881/pbp.json", "game_pbp.json"),
        "season_rankings": ("seasons/2024/REG/rankings.json", "season_rankings.json"),
        "season_schedule": ("games/2024/REG/schedule.json", "season_schedule.json"),
        "team_stats": ("seasons/2024/REG/teams/583eca2f-fb46-11e1-82cb-f4ce4684ea4c/statistics.json", "team_stats.json"),
        "league_seasons": ("league/seasons.json", "league_seasons.json"),
        "season_standings": ("seasons/2024/REG/standings.json", "season_standings.json"),
        # New endpoint for team profile
        "team_profile": ("teams/583eca2f-fb46-11e1-82cb-f4ce4684ea4c/profile.json", "team_profile.json")
    }

    # Fetch data for each endpoint with a delay
    for key, (endpoint, filename) in endpoints.items():
        print(f"Fetching {key} data...")
        fetch_data(endpoint, filename)
        time.sleep(1)  # Delay between requests to avoid hitting the rate limit


if __name__ == "__main__":
    fetch_all_data()
