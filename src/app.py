from flask import Flask, jsonify
from flask_cors import CORS
import json
import os

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

@app.route('/api/live_scores', methods=['GET'])
def get_live_scores():
    scores = []
    try:
        # Look in the 'data_responses' directory for live score files
        for filename in os.listdir("data_responses"):
            if filename.endswith("_live_score.json"):
                with open(os.path.join("data_responses", filename), "r") as f:
                    data = json.load(f)
                    scores.append(data)
        return jsonify(scores)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True)
