import pandas as pd
import os

# Function to load and check if a file exists and is not empty


def load_csv(filepath):
    if os.path.exists(filepath) and os.path.getsize(filepath) > 0:
        df = pd.read_csv(filepath)
        if df.empty:
            print(f"Warning: {filepath} is empty after loading.")
        return df
    else:
        print(f"Warning: {filepath} is empty or does not exist.")
        return pd.DataFrame()  # Return empty DataFrame if file is empty


# Load each dataset
schedule_df = load_csv('nba_schedule.csv')
results_df = load_csv('nba_results.csv')
standings_df = load_csv('nba_standings.csv')

# Check if any DataFrame is empty and exit if critical files are missing data
if schedule_df.empty or results_df.empty or standings_df.empty:
    print("One or more input files are empty. Please check the data files.")
else:
    # Merge schedule and results data on game_id
    merged_df = pd.merge(
        schedule_df, results_df,
        on='game_id',
        how='left', suffixes=('_schedule', '_results')
    )

    # Standings data will not merge directly due to missing home/away structure
    # For demonstration, we'll simply add team standings info directly to the merged dataset
    # Example approach: add standings data for teams if applicable in expanded format

    # Save the merged dataset
    merged_df.to_csv('nba_merged_data.csv', index=False)
    print("Merged data saved to nba_merged_data.csv")

    # Optional: Preview the merged data
    print("\nMerged DataFrame preview:")
    print(merged_df.head())
