# backend/api/routes.py
from flask import Flask, jsonify
from fetch_nba_data import fetch_live_scores_for_today

app = Flask(__name__)

@app.route('/api/live-scores', methods=['GET'])
def live_scores():
    scores = fetch_live_scores_for_today()  # Call function that fetches live scores
    return jsonify(scores)

if __name__ == '__main__':
    app.run(port=5000)
