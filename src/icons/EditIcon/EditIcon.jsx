import React from "react";
import PropTypes from "prop-types";

const EditIcon = ({ size = 18, color = "#1D1652", className = "" }) => {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 18 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* 펜 몸통 */}
      <path
        d="M0 18H3.75L14.81 6.94L11.06 3.19L0 14.25V18ZM2 15.08L11.06 6.02L11.98 6.94L2.92 16H2V15.08Z"
        fill={color}
      />
      {/* 지우개 */}
      <path
        d="M15.37 0.29C14.98 -0.1 14.35 -0.1 13.96 0.29L12.13 2.12L15.88 5.87L17.71 4.04C18.1 3.65 18.1 3.02 17.71 2.63L15.37 0.29Z"
        fill={color}
      />
    </svg>
  );
};

EditIcon.propTypes = {
  size: PropTypes.number,
  color: PropTypes.string,
  className: PropTypes.string,
};

export default EditIcon;
