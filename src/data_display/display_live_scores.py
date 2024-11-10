import json
import os

# Directory containing the JSON files
data_dir = "data_responses"

# List of JSON files (update with your actual file names)
json_files = [
    "1328f8ad-2522-4783-a7d3-81fee0be534e_live_score.json",
    "41a0d542-0a37-4489-8f9e-04029ca7369a_live_score.json",
    "a3dc924b-929d-44b9-8c29-4f50bb017300_live_score.json",
    "f14b4353-6e02-4d28-92b6-db2ab6b633b9_live_score.json"
]

# Helper function to display game information


def display_game_info(game_data):
    try:
        # Extract relevant game data
        game_id = game_data.get("id", "Unknown")
        home_team = game_data["home"].get("name", "Home Team")
        away_team = game_data["away"].get("name", "Away Team")
        home_score = game_data["home"].get("points", 0)
        away_score = game_data["away"].get("points", 0)
        status = game_data.get("status", "Unknown")
        quarter = game_data.get("quarter", "N/A")
        clock = game_data.get("clock", "00:00")

        # Format the output
        output = (
            f"Game ID: {game_id}\n"
            f"Teams: {home_team} vs {away_team}\n"
            f"Score: {home_team} {home_score} - {away_team} {away_score}\n"
            f"Status: {status} | Quarter: {quarter} | Time Remaining: {clock}\n"
            "------------------------------------------------------\n"
        )
        return output
    except KeyError as e:
        return f"Error processing game data: missing key {e}"


# Process each JSON file
for json_file in json_files:
    file_path = os.path.join(data_dir, json_file)

    # Load the JSON data
    with open(file_path, "r") as f:
        game_data = json.load(f)

    # Display formatted game info
    print(display_game_info(game_data))
