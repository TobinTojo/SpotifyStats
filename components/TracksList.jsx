import React from "react";

const TracksList = ({ tracks = [], onTrackClick, isSearchMode, offset = 0 }) => {
  if (!tracks || tracks.length === 0) {
    return <div>No tracks to display. Please submit your selection.</div>;
  }

  const getStyle = (index) => {
    if (isSearchMode) {
      return { backgroundColor: "#181818" };
    }

    if (index === 0) {
      return {
        color: "gold",
        backgroundColor: "#2a2a2a",
        border: "2px solid gold",
        boxShadow: "0 0 10px gold",
      };
    }
    if (index === 1) {
      return {
        color: "silver",
        backgroundColor: "#2a2a2a",
        border: "2px solid silver",
        boxShadow: "0 0 10px silver",
      };
    }
    if (index === 2) {
      return {
        color: "#cd7f32",
        backgroundColor: "#2a2a2a",
        border: "2px solid #cd7f32",
        boxShadow: "0 0 10px #cd7f32",
      };
    }
    return { backgroundColor: "#181818" };
  };

  const getFontWeight = (index) => (index < 3 && !isSearchMode ? "bold" : "normal");

  return (
    <div id="tracks-container">
      {!isSearchMode && <h2>Leaderboard</h2>}
      {isSearchMode && tracks.length === 0 && (
        <div>No tracks found. Try a different search.</div>
      )}

      {!isSearchMode && tracks.length > 0 && (
        <div className="click-hint">
          Click any track to listen on Spotify
          <span className="pulsating-arrow">→</span>
        </div>
      )}

      {tracks.map((track, index) => (
        <a
          key={track.id}
          onClick={() => onTrackClick(track)}
          className="track-item"
          style={getStyle(index)}
        >
          {!isSearchMode && (
            <div
              className="track-number"
              style={{ color: getStyle(index).color, fontWeight: getFontWeight(index) }}
            >
              {index + 1 + offset}. {/* Add the offset to the rank */}
            </div>
          )}
          <img
            className="track-image"
            src={track.album?.images?.[2]?.url || track.album?.images?.[0]?.url || ""}
            alt={track.name}
          />
          <div className="track-info">
            <strong
              style={{ color: getStyle(index).color, fontWeight: getFontWeight(index) }}
            >
              {track.name}
            </strong>
            <br />
            <span>by {track.artists?.map((artist) => artist.name).join(", ")}</span>
            <br />
            <span>Popularity: {track.popularity}</span>
          </div>
          <div className="click-indicator">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M9 18l6-6-6-6" />
            </svg>
          </div>
        </a>
      ))}
    </div>
  );
};

export default TracksList;