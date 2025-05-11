import PropTypes from "prop-types";
import React from "react";
import "./Cube.css";

export const Cube = ({ color, className }) => {
  return <div className={`cube cube-${color} ${className || ""}`} />;
};

Cube.propTypes = {
  color: PropTypes.oneOf(["iridescent"]).isRequired,
  className: PropTypes.string,
};

export default Cube;
