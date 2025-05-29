import PropTypes from "prop-types";
import React from "react";
import "./Donut.css";

export const Donut = ({ color, className }) => {
  return (
    <div className={`supertoroid supertoroid-${color} ${className || ""}`} />
  );
};

Donut.propTypes = {
  color: PropTypes.oneOf(["purple-glossy"]).isRequired,
  className: PropTypes.string,
};

export default Donut;
