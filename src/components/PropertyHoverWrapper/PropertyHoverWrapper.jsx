import PropTypes from "prop-types";
import React from "react";
import "./PropertyHoverWrapper.css";

export const PropertyHoverWrapper = ({ className }) => {
  return (
    <div className={`property-hover-wrapper ${className}`}>
      <img className="img-front" src="/img/front-real.png" alt="front" />
      <img className="img-hover" src="/img/hover-real.png" alt="hover" />
    </div>
  );
};

PropertyHoverWrapper.propTypes = {
  className: PropTypes.string,
};

export default PropertyHoverWrapper;
