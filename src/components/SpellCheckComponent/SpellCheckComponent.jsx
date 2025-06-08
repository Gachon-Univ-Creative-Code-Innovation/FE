import PropTypes from "prop-types";
import React, { useState } from "react";
import "./SpellCheckComponent.css";

export const SpellCheckComponent = ({ className }) => {
  const [hoverState, setHoverState] = useState("default");

  return (
    <div
      className={`spell-check-component ${hoverState} ${className}`}
      onMouseEnter={() => setHoverState("hover")}
      onMouseLeave={() => setHoverState("default")}
    >
      <div className="text-wrapper">맞춤법 검사</div>

      <div className="group">
        <div className="overlap-group">
          <div className="div">→</div>
        </div>
      </div>
    </div>
  );
};

SpellCheckComponent.propTypes = {
  className: PropTypes.func,
};
