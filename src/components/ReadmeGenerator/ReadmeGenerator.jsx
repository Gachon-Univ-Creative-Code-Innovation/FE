import React, { useEffect, useState } from "react";
import { Oval } from "react-loader-spinner";
import "./ReadmeGenerator.css";

const ReadmeGenerator = ({ active, onDone }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (active) {
      setVisible(true);

      // 3초 후 종료
      const timer = setTimeout(() => {
        setVisible(false);
        onDone?.();
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [active, onDone]);

  if (!visible) return null;

  return (
    <div className="readme-generator__overlay">
      <div className="readme-generator__spinner-wrapper">
        <p className="readme-generator__text">README 생성 중...</p>
        <Oval
          height={40}
          width={40}
          color="#45a8ff"
          secondaryColor="#a3b3bf"
          strokeWidth={4}
          strokeWidthSecondary={2}
        />
      </div>
    </div>
  );
};

export default ReadmeGenerator;
