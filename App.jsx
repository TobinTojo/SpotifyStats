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
import "./styles/custombarchart.css";
import ArtistSongChart from './components/ArtistSongChart';
import AlbumPieChart from './components/AlbumPieChart';

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
  const [searchQuery, setSearchQuery] = useState("");
  const [mode, setMode] = useState("topStats"); // New state for mode: "topStats" or "search"
  const [topTracksSecondSet, setTopTracksSecondSet] = useState([]); // Tracks 51-100 for past 4 weeks
const [topTracksSixMonthsSecondSet, setTopTracksSixMonthsSecondSet] = useState([]); // Tracks 51-100 for 6 months
const [topTracksYearSecondSet, setTopTracksYearSecondSet] = useState([]); // Tracks 51-100 for past year
const [isLoading, setIsLoading] = useState(false); // Add this with other state declarations

const [selectedTrack, setSelectedTrack] = useState(null);
const [trackRankShort, setTrackRankShort] = useState(null);
const [trackRankMedium, setTrackRankMedium] = useState(null);
const [trackRankLong, setTrackRankLong] = useState(null);
const [trackImage, setTrackImage] = useState(null);
const [trackSpotifyLink, setTrackSpotifyLink] = useState(null);

const [searchType, setSearchType] = useState("artist"); // Add this with other state declarations

const formatDuration = (ms) => {
  const minutes = Math.floor(ms / 60000);
  const seconds = ((ms % 60000) / 1000).toFixed(0);
  return `${minutes}:${seconds.padStart(2, '0')}`;
};

// Modify the handleTrackClick function to handle search tracks
const handleTrackClick = (track) => {
  // Get ranks across all time ranges from ALL available tracks
  const getAllTracks = (timeRange) => {
    switch(timeRange) {
      case "short_term": return [...topTracks, ...topTracksSecondSet];
      case "medium_term": return [...topTracksSixMonths, ...topTracksSixMonthsSecondSet];
      case "long_term": return [...topTracksYear, ...topTracksYearSecondSet];
      default: return [];
    }
  };

  const getRank = (trackList, targetId) => {
    const index = trackList.findIndex(t => t.id === targetId);
    return index !== -1 ? index + 1 : null;
  };

  // Get ranks for all time ranges
  setTrackRankShort(getRank(getAllTracks("short_term"), track.id));
  setTrackRankMedium(getRank(getAllTracks("medium_term"), track.id));
  setTrackRankLong(getRank(getAllTracks("long_term"), track.id));

  setTrackImage(track.album.images[0]?.url);
  setTrackSpotifyLink(track.external_urls.spotify);
  setSelectedTrack(track);
};

// Add this useEffect to load top tracks on mount
useEffect(() => {
  const loadAllTracks = async () => {
    if (accessToken) {
      const shortTerm = await fetchTopTracks(0);
      const shortTermSecond = await fetchTopTracks(50);
      const sixMonths = await fetchTopTracksLastSixMonths(0);
      const sixMonthsSecond = await fetchTopTracksLastSixMonths(50);
      const year = await fetchTopTracksYear(0);
      const yearSecond = await fetchTopTracksYear(50);

      setTopTracks(shortTerm);
      setTopTracksSecondSet(shortTermSecond);
      setTopTracksSixMonths(sixMonths);
      setTopTracksSixMonthsSecondSet(sixMonthsSecond);
      setTopTracksYear(year);
      setTopTracksYearSecondSet(yearSecond);
    }
  };
  loadAllTracks();
}, [accessToken]);

// Add this useEffect to reset search results when changing search type
useEffect(() => {
  setData([]);
  setSearchQuery("");
}, [searchType]);

    // Reset data when mode changes
    useEffect(() => {
      setData([]); // Clear the artist/track list when toggling modes
    }, [mode]);

     // Toggle between Top Stats and Search
  const handleModeChange = (newMode) => {
    setMode(newMode);
    setData([]); // Clear data when switching modes
  };

  const handleSearch = async (query) => {
    if (!query) return;
  
    // Capture the current searchType when the request is made
    const currentSearchType = searchType;
  
    try {
      const response = await fetch(
        `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=${currentSearchType}&limit=10`,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
      const data = await response.json();
      // Safely access items with optional chaining and default to empty array
      const items = currentSearchType === "artist" 
        ? data.artists?.items || [] 
        : data.tracks?.items || [];
      setData(items);
    } catch (error) {
      console.error("Failed to search:", error);
      setData([]); // Reset data on error
    }
  };

  // Render the appropriate content based on the mode
  const renderContent = () => {
    if (mode === "topStats") {
      return (
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
            <TracksList tracks={data} onTrackClick={handleTrackClick} />
          ) : (
            <ArtistsList
              artists={data}
              onArtistClick={handleArtistClick}
              isSearchMode={false} // Not in search mode
            />
          )}
        </div>
      );
    } else if (mode === "search") {
      return (
        <div className="search-container">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSearch(searchQuery);
            }}
          >
            <div className="search-controls">
              <select 
                value={searchType} 
                onChange={(e) => setSearchType(e.target.value)}
                className="search-type-select"
              >
                <option value="artist">Artists</option>
                <option value="track">Tracks</option>
              </select>
              <input
                type="text"
                placeholder={`Search for ${searchType === "artist" ? "an artist..." : "a track..."}`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
              <button type="submit" className="search-button">Search</button>
            </div>
          </form>
          {searchType === "artist" ? (
            <ArtistsList
              artists={data}
              onArtistClick={handleArtistClick}
              isSearchMode={true}
            />
          ) : (
            <TracksList 
              tracks={data} 
              onTrackClick={handleTrackClick} 
              isSearchMode={true}
            />
          )}
        </div>
      );
    }
  };


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
      const endpoint = statType === "tracks" ? "me/top/tracks" : "me/top/artists";
      const limit = trackLimit ? parseInt(trackLimit) : 20; // Default to 20 if not specified
      const maxLimitPerRequest = 50; // Spotify's maximum limit per request
      const numberOfRequests = Math.ceil(limit / maxLimitPerRequest);
      let allItems = [];
  
      for (let i = 0; i < numberOfRequests; i++) {
        const offset = i * maxLimitPerRequest;
        const currentLimit = Math.min(maxLimitPerRequest, limit - offset);
        if (currentLimit <= 0) break;
  
        const url = `https://api.spotify.com/v1/${endpoint}?${new URLSearchParams({
          time_range: timeRange,
          limit: currentLimit,
          offset: offset,
        })}`;
  
        const response = await fetch(url, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        const result = await response.json();
        allItems = [...allItems, ...result.items];
      }
  
      // Slice to ensure we don't exceed the requested limit
      setData(allItems.slice(0, limit));
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

  // Fetch top 100 tracks for past 4 weeks
  const fetchTopTracks = async (offset = 0) => {
    try {
      const topTracksUrl = `https://api.spotify.com/v1/me/top/tracks?time_range=short_term&limit=50&offset=${offset}`;
      const response = await fetch(topTracksUrl, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const result = await response.json();
      return result.items; // Return the fetched tracks
    } catch (error) {
      console.error("Failed to fetch top tracks:", error);
      return [];
    }
  };

  useEffect(() => {
    if (accessToken) {
      fetchTopTracks(); // Fetch the top 50 tracks when the token is available
    }
  }, [accessToken]);

  const fetchTopTracksLastSixMonths = async (offset = 0) => {
    try {
      const topTracksUrl = `https://api.spotify.com/v1/me/top/tracks?time_range=medium_term&limit=50&offset=${offset}`;
      const response = await fetch(topTracksUrl, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const result = await response.json();
      return result.items; // Return ALL tracks (no artist filter)
    } catch (error) {
      console.error("Failed to fetch 6-month tracks:", error);
      return [];
    }
  };

  const fetchTopTracksYear = async (offset = 0) => {
    try {
      const topTracksUrl = `https://api.spotify.com/v1/me/top/tracks?time_range=long_term&limit=50&offset=${offset}`;
      const response = await fetch(topTracksUrl, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const result = await response.json();
      return result.items; // Return ALL tracks (no artist filter)
    } catch (error) {
      console.error("Failed to fetch year tracks:", error);
      return [];
    }
  };
  const fetchArtistTopTracks = async (artistId, artistName) => {
    try {
      // Fetch ALL tracks for each time range (no filtering)
      // --- Past 4 Weeks ---
      const shortTermFirstSet = await fetchTopTracks(0);
      const shortTermSecondSet = await fetchTopTracks(50);
      const allShortTermTracks = [...shortTermFirstSet, ...shortTermSecondSet];
      // Filter by artist
      const artistShortTermTracks = allShortTermTracks.filter((track) =>
        track.artists.some((a) => a.id === artistId)
      );
  
      // --- Past 6 Months ---
      const sixMonthsFirstSet = await fetchTopTracksLastSixMonths(0);
      const sixMonthsSecondSet = await fetchTopTracksLastSixMonths(50);
      const allSixMonthsTracks = [...sixMonthsFirstSet, ...sixMonthsSecondSet];
      // Filter by artist
      const artistSixMonthsTracks = allSixMonthsTracks.filter((track) =>
        track.artists.some((a) => a.id === artistId)
      );
  
      // --- Past Year ---
      const yearFirstSet = await fetchTopTracksYear(0);
      const yearSecondSet = await fetchTopTracksYear(50);
      const allYearTracks = [...yearFirstSet, ...yearSecondSet];
      // Filter by artist
      const artistYearTracks = allYearTracks.filter((track) =>
        track.artists.some((a) => a.id === artistId)
      );
  
      // Log the filtered tracks
      console.log("4 Weeks Tracks:", artistShortTermTracks);
      console.log("6 Months Tracks:", artistSixMonthsTracks);
      console.log("1 Year Tracks:", artistYearTracks);
  
      // Update state with filtered tracks
      setPopupTracks(artistShortTermTracks);
      setPopupTracksSixMonths(artistSixMonthsTracks);
      setPopupTracksYear(artistYearTracks);
  
      // Store unfiltered track sets for rank calculation
      setTopTracks(shortTermFirstSet);
      setTopTracksSecondSet(shortTermSecondSet);
      setTopTracksSixMonths(sixMonthsFirstSet);
      setTopTracksSixMonthsSecondSet(sixMonthsSecondSet);
      setTopTracksYear(yearFirstSet);
      setTopTracksYearSecondSet(yearSecondSet);
  
      setSelectedArtist(artistName);
    } catch (error) {
      console.error("Failed to fetch artist tracks:", error);
    }
  };
  const handleArtistClick = async (artist) => {
    setIsLoading(true);
    try {
      setSelectedArtist(artist.name);
      const artistDetails = await fetchArtistDetails(artist.id);
      setArtistImage(artistDetails.images?.[0]?.url);
      setArtistSpotifyLink(artistDetails.external_urls.spotify);
      setArtistGenres(artistDetails.genres || []);
  
      await fetchArtistTopTracks(artist.id, artist.name);
  
      // Fetch artist ranks
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
    } catch (error) {
      console.error("Error fetching artist data:", error);
    } finally {
      setIsLoading(false);
    }
  };


  const getRankClass = (rank) => {
    if (rank === 1) return 'rank-label-1';
    if (rank === 2) return 'rank-label-2';
    if (rank === 3) return 'rank-label-3';
    return '';
  };
  
  const getSuffix = (number) => {
    if (number > 3) return 'th';
    return ['st', 'nd', 'rd'][number - 1];
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
          {/* Toggle between Top Stats and Search */}
          <div className="mode-toggle">
            <button
              className={mode === "topStats" ? "active" : ""}
              onClick={() => handleModeChange("topStats")}
            >
              Statify Top Stats
            </button>
            <button
              className={mode === "search" ? "active" : ""}
              onClick={() => handleModeChange("search")}
            >
              Statify Search
            </button>
          </div>

          {/* Render the appropriate content */}
          {renderContent()}
        </div>
      )}
      <Footer />

      {selectedTrack && (
  <div className="popup-overlay">
    <div className="popup-content">
      <button className="close-popup" onClick={() => setSelectedTrack(null)}>×</button>
      <h1>{selectedTrack.name}</h1>
      <img 
        src={trackImage} 
        alt={selectedTrack.name} 
        className="popup-track-img"
      />

      <div className="credited-artist">
        By {selectedTrack.artists.map(artist => artist.name).join(", ")}
      </div>

        {/* Add track duration */}
        <div className="track-meta">
        <span className="duration">
          Duration: {formatDuration(selectedTrack.duration_ms)}
        </span>
        {/* Add album information if not a single */}
        {selectedTrack.album.album_type !== 'single' && (
          <span className="album">
            Album: {selectedTrack.album.name}
          </span>
        )}
      </div>

      <div className="track-ranks">
        <div className="rank-card">
          <div className="rank-header">4 Week Rank</div>
          <div className={`rank-value ${getRankClass(trackRankShort)}`}>
            {trackRankShort || <span className="na">&gt;100</span>}
            {trackRankShort && <span className="rank-suffix">{getSuffix(trackRankShort)}</span>}
          </div>
        </div>

        <div className="rank-card">
          <div className="rank-header">6 Month Rank</div>
          <div className={`rank-value ${getRankClass(trackRankMedium)}`}>
            {trackRankMedium || <span className="na">&gt;100</span>}
            {trackRankMedium && <span className="rank-suffix">{getSuffix(trackRankMedium)}</span>}
          </div>
        </div>

        <div className="rank-card">
          <div className="rank-header">1 Year Rank</div>
          <div className={`rank-value ${getRankClass(trackRankLong)}`}>
            {trackRankLong || <span className="na">&gt;100</span>}
            {trackRankLong && <span className="rank-suffix">{getSuffix(trackRankLong)}</span>}
          </div>
        </div>
      </div>

      <button 
        className="track-spotify-button"
        onClick={() => window.open(trackSpotifyLink, "_blank")}
      >
        <img 
          src="./spotify_512_black.png" 
          alt="Spotify" 
          style={{ width: "28px", marginRight: "8px" }} 
          className="spotify-icon"
        />
        Play on Spotify
      </button>
    </div>
  </div>
)}

      {selectedArtist && (
  <div className="popup-overlay">
    <div className="popup-content">
      {isLoading ? (
        <div className="loading-spinner-container">
          <div className="loading-spinner"></div>
        </div>
      ) : (
        <>
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
            className="popup-artist-img"
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

          {/* Check if the artist has tracks in any time range */}
          {((popupTracks?.length ?? 0) > 0 || 
            (popupTracksSixMonths?.length ?? 0) > 0 || 
            (popupTracksYear?.length ?? 0) > 0) && (
            <>
              <div className="chart-container">
                <h3 className="chart-title">Number of Songs in Top 100</h3>
                <ArtistSongChart data={[
                  { timeFrame: '4 Weeks', "Number of Songs": popupTracks ? popupTracks.length : 0 },
                  { timeFrame: '6 Months', "Number of Songs": popupTracksSixMonths ? popupTracksSixMonths.length : 0 },
                  { timeFrame: '1 Year', "Number of Songs": popupTracksYear ? popupTracksYear.length : 0 },
                ]} />
              </div>

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
              
              <div className="pie-chart-container">
                <h3 className="chart-title">Album Distribution in Top 100</h3>
                <AlbumPieChart data={getFilteredTracks()} selectedArtist={selectedArtist} />
              </div>
            </>
          )}
          

          {/* Check if no tracks in any of the time periods */}
          {(
            (popupTracks && popupTracks.length === 0) &&
            (popupTracksSixMonths && popupTracksSixMonths.length === 0) &&
            (popupTracksYear && popupTracksYear.length === 0)
          ) ? (
            <p>No tracks by {selectedArtist} in the top 100 from the past 4 weeks, 6 months, or the past year</p>
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
                  // Determine the global rank based on the selected time range
                  let globalRank = null;

                  switch (selectedTimeRange) {
                    case "short_term":
                      // Check first 50 tracks
                      const shortTermIndex = topTracks.findIndex((t) => t.id === track.id);
                      if (shortTermIndex !== -1) {
                        globalRank = shortTermIndex + 1;
                      } else {
                        // Check next 50 tracks
                        const secondSetIndex = topTracksSecondSet.findIndex((t) => t.id === track.id);
                        if (secondSetIndex !== -1) globalRank = secondSetIndex + 51;
                      }
                      break;

                    case "medium_term":
                      const mediumTermIndex = topTracksSixMonths.findIndex((t) => t.id === track.id);
                      if (mediumTermIndex !== -1) {
                        globalRank = mediumTermIndex + 1;
                      } else {
                        const secondSetIndex = topTracksSixMonthsSecondSet.findIndex((t) => t.id === track.id);
                        if (secondSetIndex !== -1) globalRank = secondSetIndex + 51;
                      }
                      break;

                    case "long_term":
                      const longTermIndex = topTracksYear.findIndex((t) => t.id === track.id);
                      if (longTermIndex !== -1) {
                        globalRank = longTermIndex + 1;
                      } else {
                        const secondSetIndex = topTracksYearSecondSet.findIndex((t) => t.id === track.id);
                        if (secondSetIndex !== -1) globalRank = secondSetIndex + 51;
                      }
                      break;
                  }

                  // Track style logic remains the same
                  const { trackStyle, nameStyle } = getTrackStyle(index);

                  return (
                    <div key={track.id} className="track-item" style={trackStyle}  onClick={() => {
                      handleTrackClick(track);
                      closePopup(); // Close artist popup when clicking track
                    }}>
                      <div className="track-number" style={{ color: trackStyle.color }}>
                        {globalRank ? `${globalRank}.` : "N/A"}
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
        </>
      )}
    </div>
  </div>
)}
    </div>
  );
};

export default App;