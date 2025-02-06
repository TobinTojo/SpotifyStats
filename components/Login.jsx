import React from "react";

const Login = () => {
  const clientId = import.meta.env.VITE_SPOTIFY_API_KEY;
  const redirectUri = "http://localhost:5173";
  const scopes = [
    "user-read-private",
    "user-read-email",
    "user-top-read",
  ];
  const authUrl = `https://accounts.spotify.com/authorize?${new URLSearchParams({
    client_id: clientId,
    response_type: "token",
    redirect_uri: redirectUri,
    scope: scopes.join(" "),
  })}`;

  return (
    <div id="login-container">
      <div className="login-header">
        <img src="./spotify_512_black.png" alt="Spotify Logo" className="spotify-logo" />
        <h1>Statifly</h1>
        <p className="subtitle">Discover your music journey</p>
      </div>

      <div className="login-cta">
        <h2>Get Started</h2>
        <button id="login-button" onClick={() => (window.location.href = authUrl)}>
          <img src="./spotify_512_black.png" alt="Spotify Icon" className="button-logo" />
          Continue with Spotify
        </button>
        <p className="disclaimer">Secure login with Spotify OAuth</p>
      </div>

      <div className="feature-cards">
        <div className="feature-card">
          <div className="music-note">🎵</div>
          <h3>Top Tracks</h3>
          <p>Discover your most played songs across different time periods.</p>
        </div>

        <div className="feature-card">
          <div className="music-note">🎤</div>
          <h3>Artist Insights</h3>
          <p>Explore your favorite artists and their popularity over time.</p>
        </div>

        <div className="feature-card">
          <div className="music-note">🔍</div>
          <h3>Artist Search</h3>
          <p>Search for any artist and view their top tracks in your library.</p>
        </div>

        <div className="feature-card">
          <div className="music-note">📈</div>
          <h3>Trend Analysis</h3>
          <p>Analyze trends in your listening habits over the past year.</p>
        </div>
      </div>

      {/* About Statifly Section */}
      <div className="about-section">
        <h2>About Statifly</h2>
        <p>
          Statifly was born from Tobin Tojo's fascination with music data analytics. 
          Frustrated that Spotify Wrapped only reveals listening stats once a year, 
          Tobin wanted a way to track musical trends and discover insights{" "}
          <em>year-round</em>. This platform empowers users to:
        </p>
        <ul>
          <li>🕒 Access listening history anytime</li>
          <li>📊 Compare trends between months/seasons</li>
          <li>🔍 Discover deeper artist/track insights</li>
          <li>📈 Monitor evolving music tastes over time</li>
        </ul>
        <p className="philosophy">
          "Music shapes our identity — why limit tracking our listening patterns to just December?"
        </p>
      </div>

      <div className="animated-background">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="floating-note">{i % 2 ? '🎵' : '🎧'}</div>
        ))}
      </div>
    </div>
  );
};

export default Login;
