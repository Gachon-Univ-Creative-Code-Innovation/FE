import PropTypes from "prop-types";
import React from "react";
import "./GenerateReadme.css";

export const GenerateReadme = ({ property1, className }) => {
  const stateClass = property1 === "selected" ? "selected" : "default";

  return (
    <div className={`generate-README ${stateClass} ${className}`}>
      <div className="frame">
        <div className="text-wrapper">Generate README</div>
      </div>
    </div>
  );
};

GenerateReadme.propTypes = {
  property1: PropTypes.oneOf(["default", "selected"]),
  className: PropTypes.string,
};

export default GenerateReadme;
