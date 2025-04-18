import PropTypes from "prop-types";
import React from "react";
import "./Historys.css";

export const Historys = ({ property1, className }) => {
  const stateClass = property1 === "selected" ? "selected" : "default";

  return (
    <div className={`history ${stateClass} ${className}`}>
      <div className="frame">
        <div className="text-wrapper">History</div>
      </div>
    </div>
  );
};

Historys.propTypes = {
  property1: PropTypes.oneOf(["default", "selected"]),
  className: PropTypes.string,
};

export default Historys;
