import React, { useEffect, useState } from "react";
import { 
  FaChevronRight,
  FaQuoteLeft,
  FaMusic, 
  FaMicrophone, 
  FaSearch, 
  FaChartLine,
  FaSpotify 
} from "react-icons/fa";
import AOS from 'aos';
import 'aos/dist/aos.css';
import '../styles/login.css'; // Ensure your CSS is imported

const Login = () => {
  const [showDisclaimer, setShowDisclaimer] = useState(true);
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

  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true,
      offset: 200,
      easing: 'ease-out-quad',
      mirror: false
    });
    setTimeout(() => AOS.refresh(), 1000);
  }, []);

  const handleCloseDisclaimer = () => {
    setShowDisclaimer(false);
  };

  return (
    <div id="login-container">
      {/* Disclaimer Popup */}
      {showDisclaimer && (
        <div className="disclaimer-popup">
          <div className="disclaimer-content">
            <h2>Beta Disclaimer</h2>
            <p>
              This project is currently in <strong>Beta</strong>. To join the beta, please reach out to <strong>Tobin Tojo</strong>.
            </p>
            <p>
              A <strong>Spotify Premium account</strong> is required to use this site as intended.
            </p>
            <button onClick={handleCloseDisclaimer}>I Understand</button>
          </div>
        </div>
      )}

      {/* Rest of your existing code */}
      <div className="hero-section">
        <div className="hero-content">
          <div className="spotify-logo-3d">
            <img src="./spotify_512_black.png" alt="Spotify Logo" className="spotify-logo" />
          </div>
          <h1>Statifly</h1>
          <p className="subtitle">Discover your music journey</p>
          <button id="login-button" onClick={() => (window.location.href = authUrl)}>
            <img src="./spotify_512_black.png" alt="Spotify Icon" className="button-logo" />
            Continue with Spotify
          </button>
        </div>
      </div>

      {/* Feature Cards Section */}
      <div className="feature-cards">
        {[
          { 
            icon: <FaMusic />, 
            title: "Top Tracks", 
            text: "Discover your most played songs across different time periods." 
          },
          { 
            icon: <FaMicrophone />, 
            title: "Artist Insights", 
            text: "Explore your favorite artists and their popularity over time." 
          },
          { 
            icon: <FaSearch />, 
            title: "Artist Search", 
            text: "Search for any artist and view their top tracks in your library." 
          },
          { 
            icon: <FaChartLine />, 
            title: "Trend Analysis", 
            text: "Analyze trends in your listening habits over the past year." 
          },
        ].map((feature, index) => (
          <div 
            className="feature-card" 
            key={feature.title}
            data-aos="fade-up"
            data-aos-delay={index * 100}
            data-aos-offset="150"
          >
            <div className="feature-icon">{feature.icon}</div>
            <h3>{feature.title}</h3>
            <p>{feature.text}</p>
          </div>
        ))}
      </div>

      {/* About Section */}
      <div 
        className="about-section"
        data-aos="fade-up"
        data-aos-delay="200"
      >
        <div className="about-header">
          <h2>About Statifly</h2>
        </div>
        
        <div className="about-grid">
          <div className="about-content">
            <p className="lead-text">
              Statifly transforms your Spotify data into meaningful insights 365 days a year.
              Designed for music enthusiasts who want more than just annual statistics.
            </p>
            
            <div className="feature-list">
              {[
                "Access real-time listening history",
                "Compare musical trends across time periods",
                "Discover detailed artist & track analytics",
                "Monitor evolving music preferences"
              ].map((item, index) => (
                <div key={index} className="feature-item">
                  <FaChevronRight className="feature-arrow" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="about-philosophy">
            <FaQuoteLeft className="quote-icon" />
            <blockquote>
              "Music is the fingerprint of personal growth – why measure it 
              only once a year when it evolves daily?"
            </blockquote>
            <div className="founder">
              <span>Tobin Tojo</span>
              <span>Creator of Statifly</span>
            </div>
          </div>
        </div>
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