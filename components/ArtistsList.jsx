import React from "react";

const ArtistsList = ({ artists }) => {
  if (!artists || artists.length === 0) {
    return <div>No artists to display. Please submit your selection.</div>;
  }

  // Define styles for the top 3 and others
  const getStyle = (index) => {
    if (index === 0) {
      return {
        color: "gold",
        backgroundColor: "#2a2a2a", // Lighter shade of default (#181818)
        border: "2px solid gold",
        boxShadow: "0 0 10px gold",
      };
    }
    if (index === 1) {
      return {
        color: "silver",
        backgroundColor: "#2a2a2a", // Lighter shade of default (#181818)
        border: "2px solid silver",
        boxShadow: "0 0 10px silver",
      };
    }
    if (index === 2) {
      return {
        color: "#cd7f32", // Bronze
        backgroundColor: "#2a2a2a", // Lighter shade of default (#181818)
        border: "2px solid #cd7f32",
        boxShadow: "0 0 10px #cd7f32",
      };
    }
    return { backgroundColor: "#181818" }; // Default for others
  };

  const getFontWeight = (index) => (index < 3 ? "bold" : "normal");

  return (
    <div id="artists-container">
      <h2>Leaderboard</h2>
      {artists.map((artist, index) => (
        <a
          key={artist.id}
          href={artist.external_urls.spotify}
          target="_blank"
          rel="noopener noreferrer"
          className="artist-item"
          style={getStyle(index)}
        >
          <div
            className="artist-number"
            style={{ color: getStyle(index).color, fontWeight: getFontWeight(index) }}
          >
            {index + 1}.
          </div>
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
            <span>Followers: {artist.followers.total.toLocaleString()}</span>
            <br />
            <span>Popularity: {artist.popularity}</span>
          </div>
        </a>
      ))}
    </div>
  );
};

export default ArtistsList;

