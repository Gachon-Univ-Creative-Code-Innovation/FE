import PropTypes from "prop-types";
import React from "react";
import { Link } from "react-router-dom";
import "./Component22.css";

export const Component22 = ({ property1, className, to }) => {
  return (
    <Link className={`component-22 ${property1} ${className}`} to={to}>
      <div className="text-wrapper-15">User</div>
    </Link>
  );
};

Component22.propTypes = {
  property1: PropTypes.oneOf(["frame-105", "frame-38"]),
  to: PropTypes.string,
};

export default Component22;
