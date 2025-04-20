import React from "react";
import PropTypes from "prop-types";

const RegenerateIcon = ({ size = 26, color = "white", className = "" }) => {
  return (
    <svg
      className={className}
      width={(size * 24) / 26}
      height={size}
      viewBox="0 0 24 26"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M15.9418 8.05891H23.0007V1M22.5902 19.8571C21.2747 21.8828 19.3444 23.4335 17.0826 24.2813C14.8209 25.1292 12.3467 25.2296 10.0237 24.5679C7.7007 23.9061 5.65143 22.5175 4.17599 20.605C2.70056 18.6926 1.87728 16.3574 1.8267 13.9425C1.77611 11.5276 2.50051 9.16012 3.89456 7.18758C5.28862 5.21503 7.27841 3.74168 9.57169 2.98325C11.865 2.22482 14.3412 2.22118 16.6365 2.9736C18.9317 3.72603 20.9253 5.19433 22.3245 7.16322"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

RegenerateIcon.propTypes = {
  size: PropTypes.number,
  color: PropTypes.string,
  className: PropTypes.string,
};

export default RegenerateIcon;
