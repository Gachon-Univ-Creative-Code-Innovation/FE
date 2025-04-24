import React from "react";

const UserEditIcon = ({
  width = 13,
  height = 14,
  className = "",
  style = {},
}) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 13 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={style}
    >
      <path
        d="M6.65944 3.76097L0.5 9.92032V13L3.57972 13L9.73914 6.84064M6.65944 3.76097L8.86808 1.55234L8.86941 1.55103C9.17344 1.247 9.32572 1.09472 9.50127 1.03768C9.6559 0.987439 9.82249 0.987439 9.97712 1.03768C10.1525 1.09468 10.3047 1.24679 10.6083 1.55039L11.9478 2.88989C12.2527 3.19479 12.4052 3.34731 12.4623 3.5231C12.5126 3.67774 12.5126 3.84431 12.4623 3.99894C12.4052 4.17461 12.2529 4.3269 11.9485 4.63136L11.9478 4.63202L9.73914 6.84064M6.65944 3.76097L9.73914 6.84064"
        stroke="black"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default UserEditIcon;
