import React from "react";
import XButton from "../../icons/XButton/XButton";
import "./ShowRoadMap.css";

const RoadmapPopup = ({ image, title, onClose }) => {
  return (
    <div className="readme-popup-overlay">
      <div className="roadmappopup-container">
        <div className="roadmappopup-frame">
          <div className="roadmappopup-header">
            <div className="roadmappopup-title">
              <div className="roadmappopup-title-text">{title}</div>
            </div>
            <XButton className="roadmappopup-x-button" onClick={onClose} />
          </div>

          <div className="roadmappopup-center-title-wrapper">
            <div className="roadmappopup-center-title">{title} Roadmap</div>
          </div>

          <div
            className="roadmappopup-preview-image"
            dangerouslySetInnerHTML={{ __html: image }}
          />
        </div>
      </div>
    </div>
  );
};

export default RoadmapPopup;
