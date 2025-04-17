import PropTypes from "prop-types";
import React from "react";
import "./LogoutComponent.css";

export const LogoutComponent = ({ className, divClassName }) => {
  return (
    <div className={`logout-component ${className}`}>
      <div className={`text-wrapper ${divClassName}`}>Logout</div>
    </div>
  );
};

LogoutComponent.propTypes = {
  className: PropTypes.string,
  divClassName: PropTypes.string,
};

export default LogoutComponent;
