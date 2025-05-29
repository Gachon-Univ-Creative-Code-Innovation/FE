import PropTypes from "prop-types";
import React from "react";
import { Link } from "react-router-dom";
import "./SelectHeadhunterComponent.css";

export const SelectHeadhunterComponent = ({ property1, className, to }) => {
  return (
    <Link className={`component-23 ${property1} ${className}`} to={to}>
      <div className="text-wrapper-16">Headhunter</div>
    </Link>
  );
};

SelectHeadhunterComponent.propTypes = {
  property1: PropTypes.oneOf(["frame-106", "frame-38"]),
  to: PropTypes.string,
};

export default SelectHeadhunterComponent;
