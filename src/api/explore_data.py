import pandas as pd

# Load each CSV file
schedule_df = pd.read_csv('nba_schedule.csv')
results_df = pd.read_csv('nba_results.csv')
standings_df = pd.read_csv('nba_standings.csv')

# Define a function to explore each DataFrame
def explore_data(df, name):
    print(f"Exploring {name} DataFrame")
    print("-" * 40)
    print("First 5 rows:")
    print(df.head())
    print("\nColumn Names and Data Types:")
    print(df.dtypes)
    print("\nSummary Statistics:")
    print(df.describe(include='all'))
    print("-" * 40)
    print("\n\n")

# Explore each DataFrame
explore_data(schedule_df, "Schedule")
explore_data(results_df, "Results")
explore_data(standings_df, "Standings")
