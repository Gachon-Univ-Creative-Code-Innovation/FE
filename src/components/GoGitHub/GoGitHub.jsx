import PropTypes from "prop-types";
import React from "react";
import "./GoGitHub.css";

export const GoGitHub = ({ property1, className }) => {
  return (
    <div className={`git-hub ${className}`}>
      <div className="div">GitHub ⟶</div>
    </div>
  );
};

GoGitHub.propTypes = {
  property1: PropTypes.oneOf(["default"]),
};

export default GoGitHub;
