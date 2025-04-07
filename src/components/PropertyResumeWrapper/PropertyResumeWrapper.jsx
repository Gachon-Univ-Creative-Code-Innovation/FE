import PropTypes from "prop-types";
import React from "react";
import "./PropertyResumeWrapper.css";

export const PropertyResumeWrapper = ({ className }) => {
  return (
    <div className={`property-resume-wrapper ${className}`}>
      <img className="resume-back" src="/img/resume-back.png" alt="default" />
      <img className="resume-hover" src="/img/resume-hover.png" alt="hover" />
    </div>
  );
};

PropertyResumeWrapper.propTypes = {
  className: PropTypes.string,
};

export default PropertyResumeWrapper;
