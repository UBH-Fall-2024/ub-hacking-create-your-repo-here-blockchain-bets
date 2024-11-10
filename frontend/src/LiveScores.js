// LiveScores.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './LiveScores.css';

function LiveScores({ isWalletConnected }) {
  const [liveScores, setLiveScores] = useState([]);
  const navigate = useNavigate(); // Use navigate for routing

  useEffect(() => {
    if (isWalletConnected) {
      async function fetchScores() {
        try {
          const response = await fetch('http://127.0.0.1:5000/api/live_scores');
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
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

  // Handler for navigating to the betting page with selected game data
  const handleGameClick = (game) => {
    navigate('/betting', { state: { game } }); // Navigate with game data in state
  };

  return (
    <div className="live-scores">
      <h2>Live NBA Scores</h2>
      {isWalletConnected ? (
        liveScores.length > 0 ? (
          <ul>
            {liveScores.map((game, index) => (
              <li key={index} className="game-item" onClick={() => handleGameClick(game)}>
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
