// SortScreen.jsx
import React from "react";
import "./SortScreen.css";

export const SortScreen = ({ selected, onSelectSort }) => {
  const options = ["추천순", "최신순", "오래된 순"];
  return (
    <div className="sortscreen-container">
      {options.map((opt) => (
        <div
          key={opt}
          className={`sortscreen-item ${selected === opt ? "active" : ""}`}
          onClick={() => onSelectSort(opt)}
        >
          {opt}
        </div>
      ))}
    </div>
  );
};

export default SortScreen;
