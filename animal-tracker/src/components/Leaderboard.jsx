import React, { useEffect, useState } from "react";
import "./Leaderboard.css";

const Leaderboard = () => {
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboardData = async () => {
      try {
        // Fetch the scoreboard data
        const scoreboardResponse = await fetch("/user/scoreboard");
        const scoreboard = await scoreboardResponse.json();

        // Map over the scoreboard and fetch additional details for each user
        const userProfiles = await Promise.all(
            scoreboard.map(async (user) => {
              const profileResponse = await fetch(`/user/profile?slug=${user.slug}`);
              console.log(user.slug, profileResponse);
              const profile = await profileResponse.json();
              console.log(profile);
              return {
                ...profile,
                self: user.self,
              };
            })
        );

        // Update the leaderboard data
        setLeaderboardData(userProfiles);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching leaderboard data:", error);
        setLoading(false);
      }
    };

    fetchLeaderboardData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
      <div className="leaderboard-container">
        <h2 className="leaderboard-title">Leaderboard</h2>
        <div className="leaderboard-scroll">
          <ul className="leaderboard-list">
            {leaderboardData.map((player, index) => (
                <li
                    key={index}
                    className={`leaderboard-item ${player.self ? "self-highlight" : ""}`}
                >
              <span
                  className={`rank ${
                      index === 0 ? "gold" : index === 1 ? "silver" : index === 2 ? "bronze" : ""
                  }`}
              >
                {index + 1}
              </span>
                    <span>Name: </span>
                  <span className="name">{player.name}</span>
                    <span>  Favorite Animal: </span>
                  <span className="animal">   {player.animal}  </span>
                    <span>   Coins earned: </span>
                  <span className="coins">   {player.balance}  </span>
                </li>
            ))}
          </ul>
        </div>
      </div>
  );
};

export default Leaderboard;