import PropTypes from "prop-types";
import React from "react";
import { useNavigate } from "react-router-dom";
import "./style.css";

export const Component = ({ property1, className }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/login");
  };

  return (
    <div
      className={`component ${property1} ${className}`}
      onClick={handleClick}
      style={{ cursor: "pointer" }}
    >
      <div className="text-wrapper">Log in</div>
    </div>
  );
};

Component.propTypes = {
  property1: PropTypes.oneOf(["fill", "default"]),
};

export default Component;
