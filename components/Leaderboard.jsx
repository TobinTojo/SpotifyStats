import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { FaCrown, FaMedal, FaTrophy, FaChartLine, FaMusic, FaHistory } from "react-icons/fa";
import { GiRank3, GiRank2, GiRank1 } from "react-icons/gi";
import "../styles/leaderboard.css";

const Leaderboard = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      const usersRef = collection(db, "users");
      const snapshot = await getDocs(usersRef);

      const scores = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        if (typeof data.totalScore === "number") {
          scores.push({ 
            id: doc.id,
            name: data.username || "Unknown", 
            score: data.totalScore,
            image: data.spotifyImage || "/default-avatar.jpg",
            quizHistory: data.quizHistory || [],
            topArtist: data.topArtist || null, // Add top artist data
            topTrack: data.topTrack || null, // Add top track data
          });
        }
      });

      scores.sort((a, b) => b.score - a.score);
      setUsers(scores);
    };

    fetchLeaderboard();
  }, []);

  const handleUserClick = (user) => {
    setSelectedUser(user);
  };

  const closePopup = () => {
    setSelectedUser(null);
  };

  // Create score distribution data for the selected user
  const scoreDistribution = Array(11).fill(0).map((_, i) => ({ score: i, count: 0 }));
  selectedUser?.quizHistory.forEach(attempt => {
    const percentage = (attempt.score / attempt.total) * 10;
    const roundedScore = Math.round(percentage);
    scoreDistribution[roundedScore].count += 1;
  });

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip">
          <p>{`Count: ${payload[0].value}`}</p>
        </div>
      );
    }
    return null;
  };

  // Function to get rank icon based on rank
  const getRankIcon = (rank) => {
    if (rank === 1) return <FaCrown />;
    if (rank === 2) return <GiRank2 />;
    if (rank === 3) return <GiRank3 />;
    return <FaMedal />;
  };

  return (
    <div className="leaderboard-container">
      <h1>Leaderboard</h1>
      <ul>
        {users.map((user, index) => (
          <li key={index} className={index < 3 ? `top-${index + 1}` : ""} onClick={() => handleUserClick(user)}>
            <div className="rank">
              <strong>#{index + 1}</strong>
              {index < 3 && <span className="rank-icon">{getRankIcon(index + 1)}</span>}
            </div>
            <div className="user-info">
              <img 
                src={user.image} 
                alt="Profile" 
                className="leaderboard-profile-img" 
              />
              <div className="user-details">
                <span className="name">{user.name}</span>
                <span className="score">{user.score} points</span>
              </div>
            </div>
          </li>
        ))}
      </ul>

      {selectedUser && (
        <div className="leaderboard-popup-overlay">
          <div className="leaderboard-popup-content">
            <button className="leaderboard-close-popup" onClick={closePopup}>×</button>
            <h1>{selectedUser.name}</h1>
            <img
              src={selectedUser.image}
              alt="Profile"
              className="leaderboard-profile-avatar"
            />

            {/* Total Points and Rank Section */}
            <div className="user-stats-grid">
              <div className="stat-item">
                <h3><FaTrophy /> Total Points</h3>
                <div className="stat-value">{selectedUser.score}</div>
              </div>
              <div className="stat-item">
                <h3><FaCrown /> Rank</h3>
                <div className="stat-value">#{users.findIndex(user => user.id === selectedUser.id) + 1}</div>
              </div>
            </div>

            {/* Top Artists Section */}
            <div className="leaderboard-top-artists-section">
              <h3><FaMusic /> Top Artists</h3>
              <div className="leaderboard-top-artists-grid">
                {selectedUser.topArtist && (
                  <>
                    <div className="leaderboard-artist-card">
                      <h4>Last 4 Weeks</h4>
                      {selectedUser.topArtist.last4Weeks ? (
                        <>
                          <img src={selectedUser.topArtist.last4Weeks.image} alt={selectedUser.topArtist.last4Weeks.name} />
                          <p>{selectedUser.topArtist.last4Weeks.name}</p>
                        </>
                      ) : (
                        <p>No data</p>
                      )}
                    </div>
                    <div className="leaderboard-artist-card">
                      <h4>Last 6 Months</h4>
                      {selectedUser.topArtist.last6Months ? (
                        <>
                          <img src={selectedUser.topArtist.last6Months.image} alt={selectedUser.topArtist.last6Months.name} />
                          <p>{selectedUser.topArtist.last6Months.name}</p>
                        </>
                      ) : (
                        <p>No data</p>
                      )}
                    </div>
                    <div className="leaderboard-artist-card">
                      <h4>Last Year</h4>
                      {selectedUser.topArtist.lastYear ? (
                        <>
                          <img src={selectedUser.topArtist.lastYear.image} alt={selectedUser.topArtist.lastYear.name} />
                          <p>{selectedUser.topArtist.lastYear.name}</p>
                        </>
                      ) : (
                        <p>No data</p>
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Top Tracks Section */}
            <div className="leaderboard-top-tracks-section">
              <h3><FaMusic /> Top Tracks</h3>
              <div className="leaderboard-top-tracks-grid">
                {selectedUser.topTrack && (
                  <>
                    <div className="leaderboard-track-card">
                      <h4>Last 4 Weeks</h4>
                      {selectedUser.topTrack.last4Weeks ? (
                        <>
                          <img src={selectedUser.topTrack.last4Weeks.album.image} alt={selectedUser.topTrack.last4Weeks.name} />
                          <p>{selectedUser.topTrack.last4Weeks.name}</p>
                          <p>by {selectedUser.topTrack.last4Weeks.artists.map(artist => artist.name).join(", ")}</p>
                        </>
                      ) : (
                        <p>No data</p>
                      )}
                    </div>
                    <div className="leaderboard-track-card">
                      <h4>Last 6 Months</h4>
                      {selectedUser.topTrack.last6Months ? (
                        <>
                          <img src={selectedUser.topTrack.last6Months.album.image} alt={selectedUser.topTrack.last6Months.name} />
                          <p>{selectedUser.topTrack.last6Months.name}</p>
                          <p>by {selectedUser.topTrack.last6Months.artists.map(artist => artist.name).join(", ")}</p>
                        </>
                      ) : (
                        <p>No data</p>
                      )}
                    </div>
                    <div className="leaderboard-track-card">
                      <h4>Last Year</h4>
                      {selectedUser.topTrack.lastYear ? (
                        <>
                          <img src={selectedUser.topTrack.lastYear.album.image} alt={selectedUser.topTrack.lastYear.name} />
                          <p>{selectedUser.topTrack.lastYear.name}</p>
                          <p>by {selectedUser.topTrack.lastYear.artists.map(artist => artist.name).join(", ")}</p>
                        </>
                      ) : (
                        <p>No data</p>
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Score Distribution */}
            <div className="leaderboard-score-distribution">
              <h3><FaChartLine /> Quiz Score Distribution</h3>
              <div className="leaderboard-histogram-container">
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={scoreDistribution}>
                    <XAxis 
                      dataKey="score" 
                      label={{ value: 'Score (out of 10)', position: 'bottom' }}
                    />
                    <YAxis 
                      label={{ value: 'Number of Quizzes', angle: -90, position: 'insideLeft' }}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar 
                      dataKey="count" 
                      fill="#27adf5" 
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Quiz History */}
            <div className="leaderboard-quiz-history">
              <h3><FaHistory /> Quiz History</h3>
              {selectedUser.quizHistory
                .sort((a, b) => new Date(b.date) - new Date(a.date))
                .map((attempt, index) => (
                  <div key={index} className="leaderboard-quiz-attempt">
                    <span>{new Date(attempt.date).toLocaleDateString()}</span>
                    <span>{attempt.score}/{attempt.total}</span>
                    <span>+{attempt.points} points</span>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Leaderboard;