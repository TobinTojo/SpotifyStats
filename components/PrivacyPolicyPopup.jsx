import React from "react";
import "../styles/privacypolicy.css";

const PrivacyPolicyPopup = ({ onClose }) => {
  return (
    <div className="privacy-popup-overlay">
      <div className="privacy-popup-content">
        <button className="privacy-close-popup" onClick={onClose}>×</button>
        <h1>Privacy Policy</h1>
        <p>
          This Privacy Policy describes how your personal information is collected, used, and shared when you visit or use our website.
        </p>
        <h2>Information We Collect</h2>
        <p>
          We collect information from you when you register on our site, log in, or use certain features. This information may include:
        </p>
        <ul>
          <li>Your Spotify username and profile information (e.g., display name, profile picture).</li>
          <li>Your top tracks and artists from Spotify.</li>
          <li>Quiz results and scores.</li>
        </ul>
        <h2>How We Use Your Information</h2>
        <p>
          We use the information we collect to:
        </p>
        <ul>
          <li>Provide and improve our services.</li>
          <li>Personalize your experience.</li>
          <li>Analyze usage and trends.</li>
        </ul>
        <h2>Data Storage</h2>
        <p>
          Your data is stored securely in Firebase Firestore. We store:
        </p>
        <ul>
          <li>Your Spotify username and profile information.</li>
          <li>Your top tracks and artists.</li>
          <li>Your quiz history and scores.</li>
        </ul>
        <h2>Sharing Your Information</h2>
        <p>
          We do not share your personal information with third parties except as required by law or to protect our rights.
        </p>
        <h2>Your Rights</h2>
        <p>
          You have the right to access, correct, or delete your personal data. Please contact us if you wish to exercise these rights.
        </p>
        <h2>Changes to This Policy</h2>
        <p>
          We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy on this page.
        </p>
      </div>
    </div>
  );
};

export default PrivacyPolicyPopup;