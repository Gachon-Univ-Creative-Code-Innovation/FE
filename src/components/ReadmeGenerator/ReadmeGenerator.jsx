import React, { useEffect, useState } from "react";
import { Oval } from "react-loader-spinner";
import "./ReadmeGenerator.css";

const ReadmeGenerator = ({ active, onDone }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // active가 true가 되면 visible = true, 3초 후에 visible = false & onDone()
    if (active) {
      setVisible(true);
      const timer = setTimeout(() => {
        setVisible(false);
        onDone?.();
      }, 3000);
      return () => clearTimeout(timer);
    }

    // (“active가 false로 바뀔 때” 혹은 컴포넌트 언마운트 시) 즉시 visible을 false 처리
    setVisible(false);
  }, [active, onDone]);

  // visible이 false면 아무것도 렌더링하지 않음
  if (!visible) return null;

  return (
    <div className="readme-generator__overlay">
      <div className="readme-generator__spinner-wrapper">
        <p className="readme-generator__text">README가 생성되면 알려드릴게요</p>
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
