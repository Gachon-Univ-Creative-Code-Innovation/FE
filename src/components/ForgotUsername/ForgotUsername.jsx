import React from "react";
import "./ForgotUsername.css";

export const ForgotUsername = ({ className = "" }) => {
  return (
    <div className={`forgot-username ${className}`}>
      <div className="div">Forgot username</div>
    </div>
  );
};

export default ForgotUsername;
