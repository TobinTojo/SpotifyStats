import React, { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { FaCrown, FaMedal, FaTrophy, FaChartLine, FaMusic, FaHistory } from "react-icons/fa";
import { GiRank3, GiRank2, GiRank1 } from "react-icons/gi";

const Profile = ({ userProfile, quizHistory, totalScore, topArtist, topTrack }) => {
  const [showHistory, setShowHistory] = useState(false);

  // Create score distribution data
  const scoreDistribution = Array(11).fill(0).map((_, i) => ({ score: i, count: 0 }));
  quizHistory.forEach(attempt => {
    const percentage = (attempt.score / attempt.total) * 10;
    const roundedScore = Math.round(percentage);
    scoreDistribution[roundedScore].count += 1;
  });

  // Custom Tooltip Content
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

  // Function to calculate rank and progress
  const getRankProgress = (totalScore) => {
    if (totalScore >= 0 && totalScore <= 500) {
      return { rank: "Bronze", emoji: "🥉", progress: (totalScore / 500) * 100, nextRank: "Silver", pointsNeeded: 501 - totalScore };
    } else if (totalScore >= 501 && totalScore <= 1200) {
      return { rank: "Silver", emoji: "🥈", progress: ((totalScore - 500) / 700) * 100, nextRank: "Gold", pointsNeeded: 1201 - totalScore };
    } else if (totalScore >= 1201 && totalScore <= 2000) {
      return { rank: "Gold", emoji: "🥇", progress: ((totalScore - 1200) / 800) * 100, nextRank: "Platinum", pointsNeeded: 2001 - totalScore };
    } else if (totalScore > 2000) {
      return { rank: "Platinum", emoji: "💎", progress: 100, nextRank: "Max", pointsNeeded: 0 };
    } else {
      return { rank: "N/A", emoji: "", progress: 0, nextRank: "", pointsNeeded: 0 };
    }
  };

  return (
    <div className="profile-container">
      <div className="user-card">
        <div className="user-header">
          <img
            src={userProfile.images?.[0]?.url || "/default-avatar.jpg"}
            alt="Profile"
            className="profile-avatar"
          />
          <h2>{userProfile.display_name}</h2>
        </div>

        <div className="user-stats-grid">
          <div className="stat-item">
            <h3><FaTrophy /> Total Points</h3>
            <div className="stat-value">{totalScore}</div>
          </div>
          <div className="stat-item">
            <h3><FaCrown /> Rank</h3>
            <div className="stat-value">
              {getRankProgress(totalScore).emoji} {getRankProgress(totalScore).rank}
            </div>
            <div className="progress-bar">
              <div
                className="progress-bar-fill"
                style={{ width: `${getRankProgress(totalScore).progress}%` }}
              ></div>
            </div>
            <div className="progress-text">
              {getRankProgress(totalScore).pointsNeeded > 0
                ? `${getRankProgress(totalScore).pointsNeeded} points to ${getRankProgress(totalScore).nextRank}`
                : "Max Rank"}
            </div>
          </div>
        </div>

        {/* Top Artists Section */}
        <div className="top-artists">
          <h3><FaMusic /> Top Artists</h3>
          <div className="musician-grid">
            <div className="musician-item">
              <h4>Last 4 Weeks</h4>
              <div className="stat-value">{topArtist?.last4Weeks?.name || "N/A"}</div>
            </div>
            <div className="musician-item">
              <h4>Last 6 Months</h4>
              <div className="stat-value">{topArtist?.last6Months?.name || "N/A"}</div>
            </div>
            <div className="musician-item">
              <h4>Last Year</h4>
              <div className="stat-value">{topArtist?.lastYear?.name || "N/A"}</div>
            </div>
          </div>
        </div>

        {/* Top Tracks Section */}
        <div className="top-tracks">
          <h3><FaMusic /> Top Tracks</h3>
          <div className="song-grid">
            <div className="song-item">
              <h4>Last 4 Weeks</h4>
              <div className="stat-value">{topTrack?.last4Weeks?.name || "N/A"}</div>
            </div>
            <div className="song-item">
              <h4>Last 6 Months</h4>
              <div className="stat-value">{topTrack?.last6Months?.name || "N/A"}</div>
            </div>
            <div className="song-item">
              <h4>Last Year</h4>
              <div className="stat-value">{topTrack?.lastYear?.name || "N/A"}</div>
            </div>
          </div>
        </div>

        <div className="score-distribution">
          <h3><FaChartLine /> Quiz Score Distribution</h3>
          <div className="histogram-container">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={scoreDistribution}>
                <XAxis 
                  dataKey="score" 
                  label={{ value: 'Score (out of 10)', position: 'bottom' }}
                />
                <YAxis 
                  label={{ value: 'Number of Quizzes', angle: -90, position: 'insideLeft' }}
                />
                <Tooltip content={<CustomTooltip />} /> {/* Use custom tooltip */}
                <Bar 
                  dataKey="count" 
                  fill="#27adf5" 
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Button to toggle quiz history */}
        <button 
          className="show-history-button"
          onClick={() => setShowHistory(!showHistory)}
        >
          <FaHistory /> {showHistory ? "Hide Quiz History" : "Show Quiz History"}
        </button>

        {/* Quiz history section */}
        {showHistory && (
          <div className="quiz-history">
            <h3>Quiz History</h3>
            {quizHistory.map((attempt, index) => (
              <div key={index} className="quiz-attempt">
                <span>{new Date(attempt.date).toLocaleDateString()}</span>
                <span>{attempt.score}/{attempt.total}</span>
                <span>+{attempt.points} points</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;