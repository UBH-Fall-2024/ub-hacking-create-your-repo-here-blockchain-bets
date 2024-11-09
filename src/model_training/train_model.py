import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, classification_report
import joblib

# Load the feature-engineered data
data = pd.read_csv('nba_featured_data.csv')

# Define features and target variable
# Adjust 'win' if your target column differs or needs to be added after further processing
# Add more features if available
features = ['day_of_week', 'month', 'home_team_win_ratio']
target = 'win'  # Define this column as 0 or 1 for home/away win, if not yet added, it should be engineered

# Ensure the target column exists
if target not in data.columns:
    raise ValueError(
        f"Target column '{target}' not found in dataset. Ensure the target column is included in 'nba_featured_data.csv'.")

# Split data into features (X) and target (y)
X = data[features]
y = data[target]

# Split the data into training and testing sets
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42)

# Initialize and train the model
model = RandomForestClassifier(random_state=42)
model.fit(X_train, y_train)

# Evaluate the model
y_pred = model.predict(X_test)
accuracy = accuracy_score(y_test, y_pred)
print(f"Model Accuracy: {accuracy:.2f}")
print("\nClassification Report:\n", classification_report(y_test, y_pred))

# Save the trained model for later use
model_filename = 'nba_game_outcome_model.pkl'
joblib.dump(model, model_filename)
print(f"Trained model saved to {model_filename}")
