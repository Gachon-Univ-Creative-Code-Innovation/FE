import PropTypes from "prop-types";
import React, { useState } from "react";
import "./PropertySelectedWrapper.css";

export const PropertySelectedWrapper = ({ className }) => {
  const [isSelected, setIsSelected] = useState(false);

  const handleClick = () => {
    setIsSelected((prev) => !prev); // 토글 기능
  };

  const currentState = isSelected ? "selected" : "default";

  return (
    <div
      className={`property-selected-wrapper property-1-12-${currentState} ${className}`}
      onClick={handleClick}
    >
      <div className="text-wrapper-17">All</div>
    </div>
  );
};

PropertySelectedWrapper.propTypes = {
  className: PropTypes.string,
};

export default PropertySelectedWrapper;
