import PropTypes from "prop-types";
import React from "react";
import "./GoGitHub.css";

export const GoGitHub = ({ className }) => {
  return (
    <div className={`git-hub ${className}`}>
      <div className="div">깃허브</div>
    </div>
  );
};

GoGitHub.propTypes = {
  property1: PropTypes.oneOf(["default"]),
};

export default GoGitHub;
