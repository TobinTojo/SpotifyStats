import React, { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import Login from "./components/Login";
import InteractionForm from "./components/InteractionForm";
import TracksList from "./components/TracksList";
import ArtistsList from "./components/ArtistsList";
import Footer from "./components/Footer";
import "./styles.css";

const App = () => {
  const [accessToken, setAccessToken] = useState(localStorage.getItem("accessToken") || null);
  const [userProfile, setUserProfile] = useState(null);
  const [statType, setStatType] = useState("");
  const [timeRange, setTimeRange] = useState("");
  const [trackLimit, setTrackLimit] = useState("");
  const [data, setData] = useState([]);
  const [popupTracks, setPopupTracks] = useState(null); // Track for popup data
  const [selectedArtist, setSelectedArtist] = useState(null); // Selected artist for the popup
  const [topTracks, setTopTracks] = useState([]); // Stores the top 50 tracks

  const getAccessTokenFromUrl = () => {
    const hash = window.location.hash;
    const params = new URLSearchParams(hash.substring(1));
    return params.get("access_token");
  };

  useEffect(() => {
    const token = getAccessTokenFromUrl();
    if (token) {
      window.location.hash = ""; // Clear the hash
      setAccessToken(token);
      localStorage.setItem("accessToken", token); // Save token to localStorage
    }
  }, []);

  const fetchUserProfile = async (token) => {
    try {
      const response = await fetch("https://api.spotify.com/v1/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const profile = await response.json();
      setUserProfile(profile);
    } catch (error) {
      console.error("Failed to fetch user profile:", error);
    }
  };

  useEffect(() => {
    if (accessToken) {
      fetchUserProfile(accessToken);
    }
  }, [accessToken]);

  const handleSubmit = async () => {
    try {
      const endpoint =
        statType === "tracks" ? "me/top/tracks" : "me/top/artists";
      const url = `https://api.spotify.com/v1/${endpoint}?${new URLSearchParams(
        {
          time_range: timeRange,
          limit: trackLimit,
        }
      )}`;
      const response = await fetch(url, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const result = await response.json();
      setData(result.items);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    }
  };

  const handleLogout = () => {
    setAccessToken(null);
    setUserProfile(null);
    localStorage.removeItem("accessToken"); // Remove token from localStorage
    window.location.href = "/"; // Redirect to login page
  };

  const handleStatTypeChange = (newStatType) => {
    setStatType(newStatType);
    setData([]); // Clear data when switching dropdown
  };

  useEffect(() => {
    setData([]); // Clear data when statType changes
  }, [statType]);

  // Fetch top 50 tracks
  const fetchTopTracks = async () => {
    try {
      const topTracksUrl = `https://api.spotify.com/v1/me/top/tracks?time_range=short_term&limit=50`;
      const response = await fetch(topTracksUrl, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const result = await response.json();
      setTopTracks(result.items); // Store top 50 tracks
    } catch (error) {
      console.error("Failed to fetch top tracks:", error);
    }
  };

  useEffect(() => {
    if (accessToken) {
      fetchTopTracks(); // Fetch the top 50 tracks when the token is available
    }
  }, [accessToken]);

  const fetchArtistTopTracks = (artistId, artistName) => {
    // Filter tracks for the selected artist from the top 50 tracks
    const tracksByArtist = topTracks.filter((track) =>
      track.artists.some((artist) => artist.id === artistId)
    );

    // Set the artist name and tracks for the popup
    setPopupTracks(tracksByArtist);
    setSelectedArtist(artistName);
  };

  const handleArtistClick = (artist) => {
    fetchArtistTopTracks(artist.id, artist.name); // Fetch the tracks for this artist
  };

  const closePopup = () => {
    setPopupTracks(null); // Close the popup
    setSelectedArtist(null); // Reset selected artist
  };

  // Function to determine the style for the top 3 tracks in the popup based on their order
  const getTrackStyle = (index) => {
    let trackStyle = { backgroundColor: "#181818" }; // Default background color
    let nameStyle = {}; // Track name style

    if (index === 0) {
      trackStyle = {
        color: "gold",
        backgroundColor: "#2a2a2a",
        border: "2px solid gold",
        boxShadow: "0 0 10px gold",
      };
      nameStyle = { color: "gold" }; // Set the track name color to gold
    }
    if (index === 1) {
      trackStyle = {
        color: "silver",
        backgroundColor: "#2a2a2a",
        border: "2px solid silver",
        boxShadow: "0 0 10px silver",
      };
      nameStyle = { color: "silver" }; // Set the track name color to silver
    }
    if (index === 2) {
      trackStyle = {
        color: "#cd7f32", // Bronze
        backgroundColor: "#2a2a2a",
        border: "2px solid #cd7f32",
        boxShadow: "0 0 10px #cd7f32",
      };
      nameStyle = { color: "#cd7f32" }; // Set the track name color to bronze
    }

    return { trackStyle, nameStyle }; // Return both track and name styles
  };

  return (
    <div>
      <Navbar userProfile={userProfile} onLogout={handleLogout} />
      {!accessToken ? (
        <Login />
      ) : (
        <div>
          <InteractionForm
            statType={statType}
            setStatType={handleStatTypeChange} // Pass the new function
            timeRange={timeRange}
            setTimeRange={setTimeRange}
            trackLimit={trackLimit}
            setTrackLimit={setTrackLimit}
            onSubmit={handleSubmit}
          />
          {statType === "tracks" ? (
            <TracksList tracks={data} />
          ) : (
            <ArtistsList artists={data} onArtistClick={handleArtistClick} />
          )}
        </div>
      )}
      <Footer />

      {/* Popup to display top tracks for the selected artist */}
      {popupTracks !== null && (
        <div className="popup-overlay">
          <div className="popup-content">
            <button className="close-popup" onClick={closePopup}>
              Close
            </button>
            {popupTracks.length === 0 ? (
              <p>No tracks by {selectedArtist} in the top 50 from the last 4 weeks</p>
            ) : (
              <>
                <h3>Your Top Tracks Featuring {selectedArtist}</h3>
                <div id="tracks-container">
                  {popupTracks.map((track, index) => {
                    // Get the styles based on the order of tracks in the popup (index)
                    const { trackStyle, nameStyle } = getTrackStyle(index);

                    return (
                      <div key={track.id} className="track-item" style={trackStyle}>
                        <div className="track-number" style={{ color: trackStyle.color }}>
                          {topTracks.findIndex((t) => t.id === track.id) + 1}. {/* Actual rank */}
                        </div>
                        <img
                          src={track.album.images?.[2]?.url || track.album.images?.[0]?.url}
                          alt={track.name}
                          className="track-image"
                        />
                        <div className="track-info">
                          <strong style={nameStyle}>{track.name}</strong> {/* Apply nameStyle */}
                          <br />
                          <span>by {track.artists.map((artist) => artist.name).join(", ")}</span>
                          <br />
                          <span>Popularity: {track.popularity}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
