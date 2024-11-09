import pandas as pd

# Load the expanded merged data
schedule_with_full_team_info = pd.read_csv('nba_merged_data_expanded.csv')

# Feature 1: Win-loss ratio difference (home - away)
schedule_with_full_team_info['win_loss_ratio_diff'] = (
    schedule_with_full_team_info['win_loss_ratio'] - schedule_with_full_team_info['win_loss_ratio_away']
)

# Feature 2: Points scored vs. points allowed difference (home - away)
schedule_with_full_team_info['points_scored_diff'] = (
    schedule_with_full_team_info['avg_points_scored'] - schedule_with_full_team_info['avg_points_allowed_away']
)

# Feature 3: Points allowed difference (home - away)
schedule_with_full_team_info['points_allowed_diff'] = (
    schedule_with_full_team_info['avg_points_allowed'] - schedule_with_full_team_info['avg_points_scored_away']
)

# Indicator for home game (already set to 1 as an example)
schedule_with_full_team_info['is_home_game'] = 1

# Display a preview of the feature-engineered data
print("Feature-engineered data preview with expanded features:")
print(schedule_with_full_team_info[['win_loss_ratio_diff', 'points_scored_diff', 'points_allowed_diff', 'is_home_game']].head())

# Save the feature-engineered data with expanded features for model training
schedule_with_full_team_info.to_csv('nba_featured_data_expanded.csv', index=False)
print("Feature-engineered data with expanded features saved to nba_featured_data_expanded.csv")
