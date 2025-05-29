import PropTypes from "prop-types";
import React from "react";
import "./Cone.css";

export const Cone = ({ color, className }) => {
  return <div className={`cone cone-${color} ${className || ""}`} />;
};

Cone.propTypes = {
  color: PropTypes.oneOf(["white-glossy"]).isRequired,
  className: PropTypes.string,
};

export default Cone;
