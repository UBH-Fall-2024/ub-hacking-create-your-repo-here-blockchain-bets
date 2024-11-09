import requests
import pandas as pd
import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()
API_KEY = os.getenv('SPORTRADAR_API_KEY')

url = f"https://api.sportradar.com/nba/trial/v8/en/league/2024/01/27/changes.json?api_key={API_KEY}"
headers = {"accept": "application/json"}

response = requests.get(url, headers=headers)
data = response.json()

# Extract and save each section as needed
# 1. Save League Information
league_info = data['league']
league_df = pd.DataFrame([league_info])
league_df.to_csv('nba_league_info.csv', index=False)

# 2. Save Schedule Data
schedule_data = data.get('schedule', [])
schedule_df = pd.DataFrame(schedule_data)
schedule_df.to_csv('nba_schedule.csv', index=False)

# 3. Save Results Data
results_data = data.get('results', [])
results_df = pd.DataFrame(results_data)
results_df.to_csv('nba_results.csv', index=False)

# 4. Save Standings Data
standings_data = data.get('standings', [])
standings_df = pd.DataFrame(standings_data)
standings_df.to_csv('nba_standings.csv', index=False)

print("Data successfully saved to CSV files.")
