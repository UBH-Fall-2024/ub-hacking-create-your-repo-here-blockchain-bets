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


def fetch_data(endpoint, filename, retries=3):
    url = f"{BASE_URL}/{endpoint}?api_key={API_KEY}"
    print(f"Fetching data from {url}...")
    for attempt in range(retries):
        try:
            response = requests.get(url, headers=HEADERS)
            if response.status_code == 200:
                with open(os.path.join(OUTPUT_DIR, filename), "w") as f:
                    json.dump(response.json(), f, indent=4)
                print(f"Data saved to {filename}")
                return response.json()
            elif response.status_code == 429:
                print(f"Rate limit hit. Retrying after delay... (Attempt {attempt + 1}/{retries})")
                time.sleep(2 ** attempt)  # Exponential backoff
            else:
                print(f"Failed to fetch data from {url} - Status code: {response.status_code}")
        except Exception as e:
            print(f"Error during data fetch: {e}")
    print(f"Failed to fetch data from {url} after {retries} attempts.")
    return None


# Function to fetch today's schedule and game IDs


def get_today_game_ids():
    today = datetime.now()
    year, month, day = today.strftime(
        "%Y"), today.strftime("%m"), today.strftime("%d")
    endpoint = f"games/{year}/{month}/{day}/schedule.json"
    filename = "today_schedule.json"
    schedule_data = fetch_data(endpoint, filename)

    if schedule_data:
        game_ids = []
        print("\nToday's Games and Game IDs:")
        for game in schedule_data.get("games", []):
            home_team = game["home"]["name"]
            away_team = game["away"]["name"]
            game_id = game["id"]
            game_ids.append(game_id)
            print(f"{home_team} vs {away_team} - Game ID: {game_id}")
        return game_ids
    return []

# Function to fetch live game score with rate limit handling


def fetch_live_game_score(game_id, retries=3):
    endpoint = f"games/{game_id}/boxscore.json"
    url = f"{BASE_URL}/{endpoint}?api_key={API_KEY}"

    for attempt in range(retries):
        response = requests.get(url, headers=HEADERS)

        if response.status_code == 200:
            data = response.json()
            filename = f"{game_id}_live_score.json"
            with open(os.path.join(OUTPUT_DIR, filename), "w") as f:
                json.dump(data, f, indent=4)
            print(f"Live game score saved to {filename}")
            return data
        elif response.status_code == 429:
            print(
                f"Rate limit hit. Retrying after delay... (Attempt {attempt + 1}/{retries})")
            time.sleep(2 ** attempt)  # Exponential backoff
        else:
            print(
                f"Failed to fetch live score - Status code: {response.status_code}")
            return None
    print(
        f"Failed to fetch live score for Game ID: {game_id} after {retries} attempts due to rate limiting.")
    return None

# Function to fetch live scores for all games scheduled for today


def fetch_live_scores_for_today():
    game_ids = get_today_game_ids()
    for game_id in game_ids:
        print(f"\nFetching live score for Game ID: {game_id}")
        fetch_live_game_score(game_id)
        # Increase delay to 5 seconds between live score requests to avoid rate limit
        time.sleep(5)


if __name__ == "__main__":
    fetch_live_scores_for_today()
