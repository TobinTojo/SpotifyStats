import React, { useState } from "react";

const Navbar = ({ userProfile, onLogout, onModeChange, mode }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className={userProfile ? "logged-in" : ""}>
      <div id="logo">Statifly</div>
      <div id="user-info-container">
        {userProfile ? (
          <>
            {/* Toggle options for larger screens */}
            <div className="nav-options">
              <button
                className={mode === "topStats" ? "active" : ""}
                onClick={() => onModeChange("topStats")}
              >
                Statifly Top Stats
              </button>
              <button
                className={mode === "search" ? "active" : ""}
                onClick={() => onModeChange("search")}
              >
                Statifly Search
              </button>
              <button
                className={mode === "quiz" ? "active" : ""}
                onClick={() => onModeChange("quiz")}
              >
                Statifly Quiz Me
              </button>
              <button id="sign-out-button" onClick={onLogout}>
                Sign Out
              </button>
            </div>

            {/* Hamburger menu for smaller screens */}
            <button id="hamburger-menu" onClick={toggleMenu}>
              ☰
            </button>
            <div className={`menu-content ${isMenuOpen ? "open" : ""}`}>
              <button
                className={mode === "topStats" ? "active" : ""}
                onClick={() => {
                  onModeChange("topStats");
                  setIsMenuOpen(false);
                }}
              >
                Statifly Top Stats
              </button>
              <button
                className={mode === "search" ? "active" : ""}
                onClick={() => {
                  onModeChange("search");
                  setIsMenuOpen(false);
                }}
              >
                Statifly Search
              </button>
              <button
                className={mode === "quiz" ? "active" : ""}
                onClick={() => {
                  onModeChange("quiz");
                  setIsMenuOpen(false);
                }}
              >
                Statifly Quiz Me
              </button>
              <button id="sign-out-button" onClick={onLogout}>
                Sign Out
              </button>
            </div>
          </>
        ) : null}
      </div>
    </nav>
  );
};

export default Navbar;