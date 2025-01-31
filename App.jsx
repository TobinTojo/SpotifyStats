import React, { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import Login from "./components/Login";
import InteractionForm from "./components/InteractionForm";
import TracksList from "./components/TracksList";
import ArtistsList from "./components/ArtistsList";
import Footer from "./components/Footer";
import "./styles/styles.css";
import "./styles/login.css";
import "./styles/interactionform.css";
import "./styles/liststyles.css";
import "./styles/popup.css";

const App = () => {
  const [accessToken, setAccessToken] = useState(localStorage.getItem("accessToken") || null);
  const [userProfile, setUserProfile] = useState(null);
  const [statType, setStatType] = useState("");
  const [timeRange, setTimeRange] = useState("");
  const [trackLimit, setTrackLimit] = useState("");
  const [data, setData] = useState([]);
  const [popupTracks, setPopupTracks] = useState(null); // Tracks for popup data (past 4 weeks)
  const [popupTracksSixMonths, setPopupTracksSixMonths] = useState(null); // Tracks for 6 months
  const [popupTracksYear, setPopupTracksYear] = useState(null); // Tracks for past year
  const [selectedArtist, setSelectedArtist] = useState(null); // Selected artist for the popup
  const [topTracks, setTopTracks] = useState([]); // Stores the top 50 tracks (past 4 weeks)
  const [topTracksSixMonths, setTopTracksSixMonths] = useState([]); // Stores the top 50 tracks for 6 months
  const [topTracksYear, setTopTracksYear] = useState([]); // Stores the top 50 tracks for the past year
  const [selectedTimeRange, setSelectedTimeRange] = useState("short_term"); // Default to Past 4 Weeks
  const [artistImage, setArtistImage] = useState(null); // State to hold the artist's image
  const [artistSpotifyLink, setArtistSpotifyLink] = useState(null); // State to hold the artist's Spotify link
  const [artistGenres, setArtistGenres] = useState([]); // Add this with other state declarations
  const [artistRankShort, setArtistRankShort] = useState(null);
  const [artistRankMedium, setArtistRankMedium] = useState(null);
  const [artistRankLong, setArtistRankLong] = useState(null);
  

  const fetchTopArtists = async (timeRange, offset = 0) => {
    try {
      const url = `https://api.spotify.com/v1/me/top/artists?time_range=${timeRange}&limit=50&offset=${offset}`;
      const response = await fetch(url, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const data = await response.json();
      return data.items;
    } catch (error) {
      console.error(`Failed to fetch top artists for ${timeRange}:`, error);
      return [];
    }
  };
  
  
    const fetchArtistDetails = async (artistId) => {
      try {
        const response = await fetch(`https://api.spotify.com/v1/artists/${artistId}`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        const artistDetails = await response.json();
        return artistDetails; // This will contain artist details including their Spotify link
      } catch (error) {
        console.error("Failed to fetch artist details:", error);
      }
    };

  // Update time range when the dropdown value changes
  const handleTimeRangeChange = (e) => {
    const selectedRange = e.target.value;
    setSelectedTimeRange(selectedRange);
  };

  // Auto-select the first valid time range on popup open
useEffect(() => {
  if (popupTracks || popupTracksSixMonths || popupTracksYear) {
    const { default: defaultRange } = getAvailableTimeRanges();
    if (defaultRange) {
      setSelectedTimeRange(defaultRange);
    }
  }
}, [popupTracks, popupTracksSixMonths, popupTracksYear]);

  const getFilteredTracks = () => {
    switch (selectedTimeRange) {
      case "short_term":
        return popupTracks; // Past 4 weeks
      case "medium_term":
        return popupTracksSixMonths; // Past 6 months
      case "long_term":
        return popupTracksYear; // Past Year
      default:
        return [];
    }
  };

  // Helper function to check available time ranges
const getAvailableTimeRanges = () => {
  const ranges = [
    { value: "short_term", tracks: popupTracks },
    { value: "medium_term", tracks: popupTracksSixMonths },
    { value: "long_term", tracks: popupTracksYear },
  ];

 // Filter valid ranges
 const validRanges = ranges.filter((range) => range.tracks && range.tracks.length > 0);

 return {
   available: validRanges.map((range) => range.value), // List of enabled ranges
   default: validRanges.length > 0 ? validRanges[0].value : null, // First available range
 };
};
  


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

  // Fetch top 50 tracks for past 4 weeks
  const fetchTopTracks = async () => {
    try {
      const topTracksUrl = `https://api.spotify.com/v1/me/top/tracks?time_range=short_term&limit=50`;
      const response = await fetch(topTracksUrl, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const result = await response.json();
      setTopTracks(result.items); // Store top 50 tracks for past 4 weeks
    } catch (error) {
      console.error("Failed to fetch top tracks:", error);
    }
  };

  useEffect(() => {
    if (accessToken) {
      fetchTopTracks(); // Fetch the top 50 tracks when the token is available
    }
  }, [accessToken]);

  // Fetch top 50 tracks from the last 6 months
  const fetchTopTracksLastSixMonths = async (artistId, artistName) => {
    try {
      const topTracksUrl = `https://api.spotify.com/v1/me/top/tracks?time_range=medium_term&limit=50`;
      const response = await fetch(topTracksUrl, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const result = await response.json();
      const tracksByArtist = result.items.filter((track) =>
        track.artists.some((artist) => artist.id === artistId)
      );
      setTopTracksSixMonths(result.items); // Store all 6-month tracks
      setPopupTracksSixMonths(tracksByArtist); // Store the tracks for the last 6 months filtered by artist
    } catch (error) {
      console.error("Failed to fetch top tracks from the last 6 months:", error);
    }
  };

  // Fetch top 50 tracks from the past year
  const fetchTopTracksYear = async (artistId, artistName) => {
    try {
      const topTracksUrl = `https://api.spotify.com/v1/me/top/tracks?time_range=long_term&limit=50`;
      const response = await fetch(topTracksUrl, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const result = await response.json();
      const tracksByArtist = result.items.filter((track) =>
        track.artists.some((artist) => artist.id === artistId)
      );
      setTopTracksYear(result.items); // Store all year tracks
      setPopupTracksYear(tracksByArtist); // Store the tracks for the past year filtered by artist
    } catch (error) {
      console.error("Failed to fetch top tracks from the past year:", error);
    }
  };

  const fetchArtistTopTracks = (artistId, artistName) => {
    const tracksByArtist = topTracks.filter((track) =>
      track.artists.some((artist) => artist.id === artistId)
    );
    setPopupTracks(tracksByArtist);
    setSelectedArtist(artistName);
    fetchTopTracksLastSixMonths(artistId, artistName);
    fetchTopTracksYear(artistId, artistName);
  };

  const handleArtistClick = async (artist) => {
    setSelectedArtist(artist.name);
    const artistDetails = await fetchArtistDetails(artist.id);
    setArtistImage(artistDetails.images?.[0]?.url);
    setArtistSpotifyLink(artistDetails.external_urls.spotify);
    setArtistGenres(artistDetails.genres || []); // Add this line
    fetchArtistTopTracks(artist.id, artist.name);

     // New artist rank fetching with offset
    const fetchAllRanks = async (timeRange) => {
      try {
        const [firstSet, secondSet] = await Promise.all([
          fetchTopArtists(timeRange, 0),
          fetchTopArtists(timeRange, 50)
        ]);
        return [...firstSet, ...secondSet];
      } catch (error) {
        return [];
      }
    };

    // New artist rank fetching
    const [shortTermArtists, mediumTermArtists, longTermArtists] = await Promise.all([
      fetchAllRanks('short_term'),
      fetchAllRanks('medium_term'),
      fetchAllRanks('long_term')
    ]);

    const findRank = (list, artistId) => {
      const index = list.findIndex(a => a.id === artistId);
      return index >= 0 ? index + 1 : null;
    };
  
    setArtistRankShort(findRank(shortTermArtists, artist.id));
    setArtistRankMedium(findRank(mediumTermArtists, artist.id));
    setArtistRankLong(findRank(longTermArtists, artist.id));
  
  };

const closePopup = () => {
  const overlay = document.querySelector('.popup-overlay');
  const content = document.querySelector('.popup-content');

  setArtistRankShort(null);
  setArtistRankMedium(null);
  setArtistRankLong(null);

  if (overlay && content) {
      overlay.classList.add('closing');
      content.classList.add('closing');
      setTimeout(() => {
        setPopupTracks(null);
        setPopupTracksSixMonths(null);
        setPopupTracksYear(null);
        setSelectedArtist(null);
        setArtistGenres([]); // Add this line
        setSelectedTimeRange("short_term");
      }, 300);
  }
};
  

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
      nameStyle = { color: "gold" };
    }
    if (index === 1) {
      trackStyle = {
        color: "silver",
        backgroundColor: "#2a2a2a",
        border: "2px solid silver",
        boxShadow: "0 0 10px silver",
      };
      nameStyle = { color: "silver" };
    }
    if (index === 2) {
      trackStyle = {
        color: "#cd7f32", // Bronze
        backgroundColor: "#2a2a2a",
        border: "2px solid #cd7f32",
        boxShadow: "0 0 10px #cd7f32",
      };
      nameStyle = { color: "#cd7f32" };
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
            setStatType={handleStatTypeChange}
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
{(popupTracks !== null || popupTracksSixMonths !== null || popupTracksYear !== null) && (
        <div className="popup-overlay">
          <div className="popup-content">

          <button 
            className="close-popup" 
            onClick={closePopup}
            aria-label="Close"
          >
            {/* Text content removed - using CSS pseudo-elements */}
          </button>

            {/* Artist's Title */}
            <h1>{selectedArtist}</h1>

            {/* Artist's Image */}
            <img
              class="popup-artist-img"
              src={artistImage}
              alt={selectedArtist}
              style={{ width: '100px', height: '100px', objectFit: 'cover' }}
            />

          <div className="genre-section">
            <strong>Genres: </strong>
            {artistGenres.length > 0 
              ? artistGenres.join(", ") 
              : "Not Provided By Spotify"}
          </div>

          <div className="artist-ranks">
    <div className="rank-card">
      <div className="rank-header">4 Week Rank</div>
      <div className={`rank-value ${
        artistRankShort === 1 ? 'rank-label-1' :
        artistRankShort === 2 ? 'rank-label-2' :
        artistRankShort === 3 ? 'rank-label-3' : ''
      }`}>
        {artistRankShort !== null ? artistRankShort : <span className="na">&gt;100</span>}
        {artistRankShort && (
          <span className="rank-suffix">
            {artistRankShort === 1 ? 'st' :
            artistRankShort === 2 ? 'nd' :
            artistRankShort === 3 ? 'rd' : 'th'}
          </span>
        )}
      </div>
    </div>
    <div className="rank-card">
      <div className="rank-header">6 Month Rank</div>
      <div className={`rank-value ${
        artistRankMedium === 1 ? 'rank-label-1' :
        artistRankMedium === 2 ? 'rank-label-2' :
        artistRankMedium === 3 ? 'rank-label-3' : ''
      }`}>
        {artistRankMedium !== null ? artistRankMedium : <span className="na">&gt;100</span>}
        {artistRankMedium && (
          <span className="rank-suffix">
            {artistRankMedium === 1 ? 'st' :
            artistRankMedium === 2 ? 'nd' :
            artistRankMedium === 3 ? 'rd' : 'th'}
          </span>
        )}
      </div>
    </div>
    <div className="rank-card">
      <div className="rank-header">1 Year Rank</div>
      <div className={`rank-value ${
        artistRankLong === 1 ? 'rank-label-1' :
        artistRankLong === 2 ? 'rank-label-2' :
        artistRankLong === 3 ? 'rank-label-3' : ''
      }`}>
        {artistRankLong !== null ? artistRankLong : <span className="na">&gt;100</span>}
        {artistRankLong && (
          <span className="rank-suffix">
            {artistRankLong === 1 ? 'st' :
            artistRankLong === 2 ? 'nd' :
            artistRankLong === 3 ? 'rd' : 'th'}
          </span>
        )}
      </div>
    </div>
  </div>

            {/* Button to go to the artist's Spotify page */}
            <button
              className="artist-spotify-button"
              onClick={() => window.open(artistSpotifyLink, "_blank")}
            >
              <img 
                src="./spotify_512_black.png" 
                alt="Spotify Icon" 
                style={{ width: "28px", marginRight: "8px" }} 
              />
              Visit Artist on Spotify
            </button>
            
            {/* Dropdown for selecting time range */}
            <div>
              <label htmlFor="time-range-select">Filter by Time Range: </label>
              <select
                id="time-range-select"
                value={selectedTimeRange}
                onChange={handleTimeRangeChange}
              >
                <option value="short_term" disabled={!popupTracks || popupTracks.length === 0}>
                  Past 4 Weeks
                </option>
                <option
                  value="medium_term"
                  disabled={!popupTracksSixMonths || popupTracksSixMonths.length === 0}
                >
                  Past 6 Months
                </option>
                <option
                  value="long_term"
                  disabled={!popupTracksYear || popupTracksYear.length === 0}
                >
                  Past Year
                </option>
              </select>
            </div>

            {/* Check if no tracks in any of the time periods */}
            {(
              (popupTracks && popupTracks.length === 0) &&
              (popupTracksSixMonths && popupTracksSixMonths.length === 0) &&
              (popupTracksYear && popupTracksYear.length === 0)
            ) ? (
              <p>No tracks by {selectedArtist} in the top 50 from the past 4 weeks, 6 months, or the past year</p>
            ) : (
              <>
                <h3>Your Top Tracks Featuring {selectedArtist}</h3>

                {/* Display filtered tracks based on selected time range */}
                <div id="tracks-container">
                  <div className="click-hint">
                    Click any track to listen on Spotify
                    <span className="pulsating-arrow">→</span>
                  </div>
  {getFilteredTracks().map((track, index) => {
    const { trackStyle, nameStyle } = getTrackStyle(index);
    let trackRank = 0;

    // Calculate the rank based on the selected time range
    switch (selectedTimeRange) {
      case "short_term":
        trackRank = topTracks.findIndex((t) => t.id === track.id) + 1;
        break;
      case "medium_term":
        trackRank = topTracksSixMonths.findIndex((t) => t.id === track.id) + 1;
        break;
      case "long_term":
        trackRank = topTracksYear.findIndex((t) => t.id === track.id) + 1;
        break;
      default:
        trackRank = index + 1; // Default to index if no match
    }

    const handleTrackClick = () => {
      // Redirect to the track's Spotify page
      window.open(track.external_urls.spotify, "_blank");
    };

    return (
      <div
        key={track.id}
        className="track-item"
        style={trackStyle}
        onClick={handleTrackClick} // Add onClick event
      >
        <div className="track-number" style={{ color: trackStyle.color }}>
          {trackRank}.
        </div>
        <img
          src={track.album.images?.[2]?.url || track.album.images?.[0]?.url}
          alt={track.name}
          className="track-image"
        />
        <div className="track-info">
          <strong style={nameStyle}>{track.name}</strong>
          <br />
          <span>by {track.artists.map((artist) => artist.name).join(", ")}</span>
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
            <path d="M9 18l6-6-6-6"/>
          </svg>
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