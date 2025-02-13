import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";

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
          <li key={index}>
            <strong>#{index + 1}</strong> {user.name}: {user.score} points
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Leaderboard;

