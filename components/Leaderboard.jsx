import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";
import "../styles/leaderboard.css";

const Leaderboard = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      const usersRef = collection(db, "users");
      const snapshot = await getDocs(usersRef);

      const scores = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        if (typeof data.totalScore === "number") {
          scores.push({ name: data.username || "Unknown", score: data.totalScore });
        }
      });

      scores.sort((a, b) => b.score - a.score);
      setUsers(scores);
    };

    fetchLeaderboard();
  }, []);

  return (
    <div className="leaderboard-container">
      <h1>Leaderboard</h1>
      <ul>
        {users.map((user, index) => (
          <li key={index} className={index < 3 ? `top-${index + 1}` : ""}>
            <div className="rank">
              <strong>#{index + 1}</strong>
            </div>
            <div className="user-info">
              <span className="name">{user.name}</span>
              <span className="score">{user.score} points</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Leaderboard;