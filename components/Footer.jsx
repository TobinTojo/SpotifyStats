import React from "react";

const Footer = ({ onPrivacyPolicyClick }) => {
  return (
    <footer style={{ textAlign: "center", marginTop: "40px", padding: "10px" }}>
      © 2025 Statifly. Created by Tobin Tojo. All rights reserved.{" "}
      <span 
        id="policy-link" style={{ color: "#55b2e0", cursor: "pointer", textDecoration: "underline" }} 
        onClick={onPrivacyPolicyClick}
      >
        Privacy Policy
      </span>
    </footer>
  );
};

export default Footer;