import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score

# Load the expanded feature-engineered dataset
try:
    data = pd.read_csv('nba_featured_data_expanded.csv')
except FileNotFoundError:
    print("Error: 'nba_featured_data_expanded.csv' not found. Ensure the feature engineering step was completed.")
    exit()

# Define target and features
# Replace 'game_outcome' with the actual column name for game result if available
X = data[['win_loss_ratio_diff', 'points_scored_diff', 'points_allowed_diff', 'is_home_game']]
y = data['game_outcome'] if 'game_outcome' in data.columns else [0] * len(data)  # Placeholder

# Split the data into training and testing sets
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Initialize and train the model
model = RandomForestClassifier(random_state=42)
model.fit(X_train, y_train)

# Make predictions and evaluate the model
y_pred = model.predict(X_test)
accuracy = accuracy_score(y_test, y_pred)
print(f"Model Accuracy with Expanded Features: {accuracy}")
