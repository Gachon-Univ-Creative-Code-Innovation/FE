import React from "react";

const BlogEditIcon = ({ className, onClick }) => {
  return (
    <svg
      className={className}
      onClick={onClick}
      width="15"
      height="14"
      viewBox="0 0 15 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ cursor: "pointer" }}
    >
      <path
        d="M1 13.5H14M1 13.5V10.1637L7.5 3.49105M1 13.5L4.25 13.5L10.75 6.82736M7.5 3.49105L9.83076 1.09837L9.83216 1.09695C10.153 0.767586 10.3137 0.602613 10.499 0.540823C10.6621 0.486392 10.8379 0.486392 11.0011 0.540823C11.1862 0.602569 11.3468 0.767355 11.6672 1.09625L13.0807 2.54738C13.4025 2.87769 13.5635 3.04292 13.6237 3.23336C13.6768 3.40088 13.6767 3.58133 13.6237 3.74885C13.5635 3.93916 13.4028 4.10414 13.0815 4.43398L13.0808 4.43468L10.75 6.82736M7.5 3.49105L10.75 6.82736"
        stroke="#FAFDFF"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default BlogEditIcon;
