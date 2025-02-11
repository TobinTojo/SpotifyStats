import React, { useState } from "react";
import {
  FaChartLine,
  FaSearch,
  FaQuestionCircle,
  FaUser,
  FaSignOutAlt,
} from "react-icons/fa";

const Navbar = ({ userProfile, onLogout, onModeChange, mode }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Icon component
  const NavIcon = ({ icon }) => (
    <span className="nav-icon">{icon}</span>
  );

  return (
    <nav className={userProfile ? "logged-in" : ""}>
      <div id="logo">Statifly</div>
      <div id="user-info-container">
        {userProfile ? (
          <>
            <div className="nav-options">
              <button
                className={mode === "topStats" ? "active" : ""}
                onClick={() => onModeChange("topStats")}
              >
                <NavIcon icon={<FaChartLine />} />
                Top Stats
              </button>
              <button
                className={mode === "search" ? "active" : ""}
                onClick={() => onModeChange("search")}
              >
                <NavIcon icon={<FaSearch />} />
                Search
              </button>
              <button
                className={mode === "quiz" ? "active" : ""}
                onClick={() => onModeChange("quiz")}
              >
                <NavIcon icon={<FaQuestionCircle />} />
                Quiz Me
              </button>
              <button
                className={mode === "profile" ? "active" : ""}
                onClick={() => onModeChange("profile")}
              >
                <NavIcon icon={<FaUser />} />
                Profile
              </button>
              <button id="sign-out-button" onClick={onLogout}>
                <NavIcon icon={<FaSignOutAlt />} />
                Sign Out
              </button>
            </div>

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
                <NavIcon icon={<FaChartLine />} />
                Top Stats
              </button>
              <button
                className={mode === "search" ? "active" : ""}
                onClick={() => {
                  onModeChange("search");
                  setIsMenuOpen(false);
                }}
              >
                <NavIcon icon={<FaSearch />} />
                Search
              </button>
              <button
                className={mode === "quiz" ? "active" : ""}
                onClick={() => {
                  onModeChange("quiz");
                  setIsMenuOpen(false);
                }}
              >
                <NavIcon icon={<FaQuestionCircle />} />
                Quiz Me
              </button>
              <button
                className={mode === "profile" ? "active" : ""}
                onClick={() => {
                  onModeChange("profile");
                  setIsMenuOpen(false);
                }}
              >
                <NavIcon icon={<FaUser />} />
                Profile
              </button>
              <button id="sign-out-button" onClick={onLogout}>
                <NavIcon icon={<FaSignOutAlt />} />
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