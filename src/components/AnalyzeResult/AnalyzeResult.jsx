import PropTypes from "prop-types";
import React from "react";
import "./AnalyzeResult.css";

export const AnalyzeResult = ({ property1, className }) => {
  const stateClass = property1 === "selected" ? "selected" : "default";

  return (
    <div className={`analyzeresult-button ${stateClass} ${className}`}>
      <div className="analyzeresult-frame">
        <div className="analyzeresult-text">분석 결과</div>
      </div>
    </div>
  );
};

AnalyzeResult.propTypes = {
  property1: PropTypes.oneOf(["default", "selected"]),
  className: PropTypes.string,
};

export default AnalyzeResult;
