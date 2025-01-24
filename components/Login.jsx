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
      <h1>Login to Spotify Stats</h1>
      <button id="login-button" onClick={() => (window.location.href = authUrl)}>
        Login with Spotify
      </button>
    </div>
  );
};

export default Login;
