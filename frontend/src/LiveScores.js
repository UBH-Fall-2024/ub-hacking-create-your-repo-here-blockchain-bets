// LiveScores.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation
import './LiveScores.css';


function LiveScores({ isWalletConnected }) {
  const [liveScores, setLiveScores] = useState([]);
  const navigate = useNavigate(); // Initialize navigation

  useEffect(() => {
    if (isWalletConnected) {
      async function fetchScores() {
        try {
          const response = await fetch('http://127.0.0.1:5000/api/live_scores'); // Fetch from Flask backend
          if (!response.ok) throw new Error('Network response was not ok');
          const data = await response.json();
          setLiveScores(data);
        } catch (error) {
          console.error("Error fetching live scores:", error);
        }
      }
      fetchScores();
    } else {
      setLiveScores([]);
    }
  }, [isWalletConnected]);

  const handleGameClick = (game) => {
    // Redirect to BettingPage with game info
    navigate('/betting', { state: { game } });
  };

  return (
    <div className="live-scores">
      <h2>Live NBA Scores</h2>
      {isWalletConnected ? (
        liveScores.length > 0 ? (
          <ul>
            {liveScores.map((game, index) => (
              <li
                key={index}
                className="game-item"
                onClick={() => handleGameClick(game)}
                style={{ cursor: 'pointer' }}
              >
                <p><strong>{game.home.name}</strong> vs <strong>{game.away.name}</strong></p>
                <p>Score: {game.home_points} - {game.away_points}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p>No live games available.</p>
        )
      ) : (
        <p>Please connect your wallet to view live scores.</p>
      )}
    </div>
  );
}

export default LiveScores;
