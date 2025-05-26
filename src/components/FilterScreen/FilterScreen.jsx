import React, { useState } from "react";
import SaveButton from "../../components/SaveButton/SaveButton";
import XButton from "../../icons/XButton/XButton";
import "./FilterScreen.css";

export const FilterScreen = ({ onClose, onSave }) => {
  const [selectedFilters, setSelectedFilters] = useState({});

  const handleToggle = (sectionTitle, tag) => {
    setSelectedFilters((prev) => {
      const currentSection = prev[sectionTitle] || [];
      const updatedSection = currentSection.includes(tag)
        ? currentSection.filter((t) => t !== tag)
        : [...currentSection, tag];

      return {
        ...prev,
        [sectionTitle]: updatedSection,
      };
    });
  };

  const handleSave = () => {
    console.log("선택된 필터:", selectedFilters);
    onSave?.(selectedFilters); // 저장할 때 필터 값 전달
  };

  const handleClose = () => {
    onClose?.(); // 그냥 닫기
  };

  const sections = [
    {
      title: "경력",
      tags: ["1년 이상", "3년 이상", "5년 이상", "7년 이상", "10년 이상"],
    },
    {
      title: "사용 가능한 프레임워크",
      tags: ["React", "Vue", "Spring Boot", "기타1", "기타2", "기타3", "기타4"],
    },
    {
      title: "사용 가능한 언어",
      tags: ["Java", "JavaScript", "Python", "C++", "C#", "PHP", "TypeScript"],
    },
    {
      title: "학력",
      tags: [
        "고등학교 졸업",
        "4년제 대학 졸업",
        "2(3)년제 전문대 졸업",
        "석사 졸업",
        "박사 졸업",
      ],
    },
    {
      title: "자격증",
      tags: [
        "정보처리기사",
        "정보처리기능사",
        "SQLD",
        "오징어신선도 감별사",
        "목탁디자이너",
        "맛집탐방자격증",
      ],
    },
  ];

  return (
    <div className="filterscreen-wrapper">
      <header className="filterscreen-header">
        <XButton className="filterscreen-x-button" onClick={handleClose} />
      </header>

      <div className="filterscreen-frame">
        {sections.map((section, idx) => (
          <div className="filterscreen-section" key={idx}>
            <div className="filterscreen-section-header">
              <div className="filterscreen-title">{section.title}</div>
            </div>
            <div className="filterscreen-tag-container">
              {section.tags.map((tag, i) => {
                const isSelected =
                  selectedFilters[section.title]?.includes(tag);
                return (
                  <div
                    key={i}
                    className={`filterscreen-tag ${
                      isSelected ? "filterscreen-tag-selected" : ""
                    }`}
                    onClick={() => handleToggle(section.title, tag)}
                  >
                    <div className="filterscreen-tag-text">{tag}</div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <SaveButton
        className="filterscreen-save-button"
        divClassName="filterscreen-save-text"
        property1="active"
        onClick={handleSave}
      />
    </div>
  );
};

export default FilterScreen;
