import React from "react";
import "./Leaderboard.css";

const Leaderboard = () => {
  const leaderboardData = [
    { name: "Player1", score: 1200 },
    { name: "Player2", score: 1100 },
    { name: "Player3", score: 1050 },
    { name: "Player4", score: 900 },
    { name: "Player5", score: 850 },
    { name: "Player6", score: 800 },
    { name: "Player7", score: 750 },
    { name: "Player8", score: 700 },
    { name: "Player9", score: 650 },
    { name: "Player10", score: 600 },
  ];

  return (
    <div className="leaderboard-container">
      <h2 className="leaderboard-title">Leaderboard</h2>
      <div className="leaderboard-scroll">
        <ul className="leaderboard-list">
          {leaderboardData.map((player, index) => (
            <li key={index} className="leaderboard-item">
              <span
                className={`rank ${
                  index === 0 ? "gold" : index === 1 ? "silver" : index === 2 ? "bronze" : ""
                }`}
              >
                {index + 1}
              </span>
              <span className="name">{player.name}</span>
              <span className="score">{player.score} WildCoins</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Leaderboard;