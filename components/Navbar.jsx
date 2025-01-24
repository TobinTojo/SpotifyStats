import React from "react";

const Navbar = ({ userProfile, onLogout }) => {
  return (
    <nav>
      <div id="logo">Spotify Stats</div>
      <div id="user-info-container">
        {userProfile ? (
          <>
            <span id="user-info">Welcome, <strong>{userProfile.display_name}</strong></span>
            <button id="sign-out-button" onClick={onLogout}>
              Sign Out
            </button>
          </>
        ) : null}
      </div>
    </nav>
  );
};

export default Navbar;
