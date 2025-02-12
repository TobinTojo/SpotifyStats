import React from "react";

const ArtistsList = ({ artists = [], onArtistClick, isSearchMode, offset = 0 }) => {
  if (!artists || artists.length === 0) {
    return <div>No artists to display. Please submit your selection.</div>;
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
    <div id="artists-container">
      {!isSearchMode && <h2>Leaderboard</h2>}

      <div className="click-hint">
        Click any artist to view their advanced stats
        <span className="pulsating-arrow">→</span>
      </div>
      {artists.map((artist, index) => (
        <div
          key={artist.id}
          className="artist-item"
          style={getStyle(index)}
          onClick={() => onArtistClick(artist)}
        >
          {!isSearchMode && (
            <div
              className="artist-number"
              style={{ color: getStyle(index).color, fontWeight: getFontWeight(index) }}
            >
              {index + 1 + offset}. {/* Add the offset to the rank */}
            </div>
          )}
          <img
            className="artist-image"
            src={artist.images?.[2]?.url || artist.images?.[0]?.url || ""}
            alt={artist.name}
          />
          <div className="artist-info">
            <strong
              style={{ color: getStyle(index).color, fontWeight: getFontWeight(index) }}
            >
              {artist.name}
            </strong>
            <br />
            <span>
              Followers: {artist.followers?.total?.toLocaleString() ?? "N/A"}
            </span>
            <br />
            <span>Popularity: {artist.popularity}</span>
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
              <path d="M9 18l6-6-6-6"/>
            </svg>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ArtistsList;