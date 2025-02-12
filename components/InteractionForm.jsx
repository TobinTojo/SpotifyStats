import React from "react";

const InteractionForm = ({
  statType,
  setStatType,
  timeRange,
  setTimeRange,
  trackLimit,
  setTrackLimit,
  onSubmit,
}) => {
  const isFormValid = statType && timeRange && trackLimit;

  return (
    <div id="interaction-container">
      <h1>Spotify Stats</h1>
      <p className="intro-text">Select your preferences to view personalized Spotify stats.</p>
      
      <div className="form-group">
        <label htmlFor="stat-type">
          Stat Type:
          <span className="tooltip-icon" aria-label="Stat type help">
            ?
            <span className="tooltip-text">Choose between Top Artists or Top Tracks</span>
          </span>
        </label>
        <select
          id="stat-type"
          value={statType}
          onChange={(e) => setStatType(e.target.value)}
        >
          <option value="">Select Type</option>
          <option value="tracks">Tracks</option>
          <option value="artists">Artists</option>
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="time-range">
          Time Range:
          <span className="tooltip-icon" aria-label="Time range help">
            ?
            <span className="tooltip-text">Time Range: Stats are based on your listening history during this period.</span>
          </span>
        </label>
        <select
          id="time-range"
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
        >
          <option value="">Select Time Range</option>
          <option value="short_term">Last 4 weeks</option>
          <option value="medium_term">Last 6 months</option>
          <option value="long_term">Last 1 year</option>
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="track-limit">
          Number of Results:
          <span className="tooltip-icon" aria-label="Results limit help">
            ?
            <span className="tooltip-text">Number of items to display in your results</span>
          </span>
        </label>
        <select
          id="track-limit"
          value={trackLimit}
          onChange={(e) => setTrackLimit(e.target.value)}
        >
          <option value="">Select Limit</option>
          <option value="20">1-20</option>
          <option value="40">21-40</option>
          <option value="60">41-60</option>
          <option value="80">61-80</option>
          <option value="100">81-100</option>
        </select>
      </div>

      <button 
        id="submit-button" 
        onClick={onSubmit} 
        disabled={!isFormValid}
        aria-label="Show results"
      >
        Show Results
      </button>
      
      {!isFormValid && (
        <p className="action-text">Choose a stat type, time range, and limit above.</p>
      )}
    </div>
  );
};

export default InteractionForm;