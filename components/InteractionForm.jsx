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
      <label htmlFor="stat-type">Stat Type:</label>
      <select id="stat-type" value={statType} onChange={(e) => setStatType(e.target.value)}>
        <option value="">Select Type</option>
        <option value="tracks">Tracks</option>
        <option value="artists">Artists</option>
      </select>
      <label htmlFor="time-range">Time Range:</label>
      <select id="time-range" value={timeRange} onChange={(e) => setTimeRange(e.target.value)}>
        <option value="">Select Time Range</option>
        <option value="short_term">Last 4 weeks</option>
        <option value="medium_term">Last 6 months</option>
        <option value="long_term">Last 1 year</option>
      </select>
      <label htmlFor="track-limit">Limit (Number of Artists/Tracks):</label>
      <select id="track-limit" value={trackLimit} onChange={(e) => setTrackLimit(e.target.value)}>
        <option value="">Select Limit</option>
        <option value="5">5</option>
        <option value="10">10</option>
        <option value="20">20</option>
      </select>
      <button id="submit-button" onClick={onSubmit} disabled={!isFormValid}>
        Submit
      </button>
    </div>
  );
};

export default InteractionForm;
