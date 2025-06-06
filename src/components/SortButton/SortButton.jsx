// components/SortButton.jsx

import React, { useState, useEffect, useRef } from "react";
import SortIcon from "../../icons/SortIcon/SortIcon";
import "./SortButton.css";

const SortButton = ({ onChange }) => {
  const [selectedOption, setSelectedOption] = useState("최신순");
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  const options = ["최신순", "오래된순", "추천순"];

  const toggleDropdown = () => {
    setShowDropdown((prev) => !prev);
  };

  const handleSelect = (option) => {
    setSelectedOption(option);
    setShowDropdown(false);
    if (onChange) onChange(option);
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="sort-wrapper" ref={dropdownRef}>
      <div
        className={`sort-button ${showDropdown ? "selected" : ""}`}
        onClick={toggleDropdown}
      >
        <span className="sort-text">{selectedOption}</span>
        <SortIcon className="sort-icon" />
      </div>

      {showDropdown && (
        <div className="sort-dropdown">
          {options.map((option) => (
            <div
              key={option}
              className={`sort-option ${selectedOption === option ? "active" : ""}`}
              onClick={() => handleSelect(option)}
            >
              {option}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SortButton;