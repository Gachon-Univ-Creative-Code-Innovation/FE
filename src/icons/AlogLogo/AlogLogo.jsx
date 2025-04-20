import React from "react";

const AlogLogo = ({ width = 200, height = 80, className = "" }) => {
  return (
    <svg
      className={className}
      width={width}
      height={height}
      viewBox="0 0 200 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
    >
      <rect width="200" height="80" fill="url(#pattern0_1191_285)" />
      <defs>
        <pattern
          id="pattern0_1191_285"
          patternContentUnits="objectBoundingBox"
          width="1"
          height="1"
        >
          <use xlinkHref="#image0_1191_285" transform="scale(0.005 0.0125)" />
        </pattern>
        <image
          id="image0_1191_285"
          width="200"
          height="80"
          preserveAspectRatio="none"
          xlinkHref="data:image/png;base64,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"
        />
      </defs>
    </svg>
  );
};

export default AlogLogo;
