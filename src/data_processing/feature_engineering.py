import pandas as pd

# Load the merged data
merged_df = pd.read_csv('nba_merged_data.csv')

# Extract date-related features from 'last_modified_schedule' if available
if 'last_modified_schedule' in merged_df.columns:
    merged_df['last_modified_schedule'] = pd.to_datetime(
        merged_df['last_modified_schedule']
    )
    merged_df['day_of_week'] = merged_df['last_modified_schedule'].dt.dayofweek
    merged_df['month'] = merged_df['last_modified_schedule'].dt.month

# Using 'season_id_schedule' as the placeholder to create a feature
# This is just an example; replace the logic as needed based on actual data
merged_df['home_team_win_ratio'] = merged_df['season_id_schedule'].apply(
    lambda x: 0.5  # Placeholder logic; replace with actual calculations if available
)

# Add the 'win' column as the target variable
# Here, 1 represents a home team win, and 0 represents an away team win
# Ensure 'home_points' and 'away_points' columns are in 'nba_merged_data.csv'
if 'home_points' in merged_df.columns and 'away_points' in merged_df.columns:
    merged_df['win'] = merged_df.apply(
        lambda row: 1 if row['home_points'] > row['away_points'] else 0, axis=1)
else:
    print("Warning: 'home_points' and/or 'away_points' columns missing. 'win' column not created.")

# Save the feature-engineered dataset with the new 'win' target column
merged_df.to_csv('nba_featured_data.csv', index=False)
print("Feature-engineered data saved to nba_featured_data.csv")

# Preview the engineered data
print("\nFeature-engineered DataFrame preview:")
print(merged_df.head())
