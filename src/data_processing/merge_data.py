import pandas as pd
import numpy as np

# Load the CSV files
schedule_df = pd.read_csv('nba_schedule.csv')
standings_df = pd.read_csv('nba_standings.csv')

# Rename 'sr_id' in standings_df to 'team_id' for merging consistency
standings_df = standings_df.rename(columns={'sr_id': 'team_id'})

# Placeholder: Simulate historical performance metrics for each team
# Here we add sample columns for win-loss records, average points scored, and points allowed
standings_df['win_loss_ratio'] = np.random.uniform(0.3, 0.7, len(standings_df))
standings_df['avg_points_scored'] = np.random.randint(90, 120, len(standings_df))
standings_df['avg_points_allowed'] = np.random.randint(90, 120, len(standings_df))

# Add hypothetical columns for team identifiers
schedule_df['home_team_id'] = standings_df['team_id'].sample(n=len(schedule_df), replace=True).values
schedule_df['away_team_id'] = standings_df['team_id'].sample(n=len(schedule_df), replace=True).values

# Merge standings information for home and away teams based on 'team_id'
schedule_with_home_team_info = schedule_df.merge(
    standings_df, left_on='home_team_id', right_on='team_id', suffixes=('', '_home')
)
schedule_with_full_team_info = schedule_with_home_team_info.merge(
    standings_df, left_on='away_team_id', right_on='team_id', suffixes=('', '_away')
)

# Drop unnecessary columns
columns_to_drop = ['team_id', 'team_id_home', 'team_id_away']
existing_columns = [col for col in columns_to_drop if col in schedule_with_full_team_info.columns]
schedule_with_full_team_info = schedule_with_full_team_info.drop(columns=existing_columns)

# Display merged DataFrame preview
print("Expanded Merged DataFrame preview:")
print(schedule_with_full_team_info.head())

# Save the merged DataFrame with expanded features
schedule_with_full_team_info.to_csv('nba_merged_data_expanded.csv', index=False)
print("Expanded merged data saved to nba_merged_data_expanded.csv")
