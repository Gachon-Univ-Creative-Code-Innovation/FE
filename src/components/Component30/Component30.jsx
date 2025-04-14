import PropTypes from "prop-types";
import React from "react";
import "./Component30.css";

export const Component30 = ({ property1, className }) => {
  return (
    <div className={`component-30 ${property1} ${className}`}>
      <div className="text-wrapper-18">Unread</div>
    </div>
  );
};

Component30.propTypes = {
  property1: PropTypes.oneOf(["selected", "default"]),
};

export default Component30;
