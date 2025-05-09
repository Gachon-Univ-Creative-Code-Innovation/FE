import React from "react";
import "./RoadmapList.css";

const RoadmapList = ({ onCardClick }) => {
  return (
    <div className="roadmaplist-wrapper">
      <div className="roadmaplist-container">
        <div
          className="roadmaplist-card"
          onClick={() => onCardClick("/img/backend-1.png")}
        >
          <img
            className="roadmaplist-image"
            alt="Backend"
            src="/img/backend.png"
          />
          <div className="roadmaplist-label">Backend</div>
        </div>

        <div className="roadmaplist-card" onClick={() => onCardClick("")}>
          <img
            className="roadmaplist-image"
            alt="Frontend"
            src="/img/frontend.png"
          />
          <div className="roadmaplist-label">Frontend</div>
        </div>

        <div className="roadmaplist-card" onClick={() => onCardClick("")}>
          <img
            className="roadmaplist-image"
            alt="Fullstack"
            src="/img/fullstack.png"
          />
          <div className="roadmaplist-label">Full Stack</div>
        </div>

        <div className="roadmaplist-card" onClick={() => onCardClick("")}>
          <img
            className="roadmaplist-image"
            alt="DevOps"
            src="/img/devops.png"
          />
          <div className="roadmaplist-label">DevOps</div>
        </div>

        <div className="roadmaplist-card" onClick={() => onCardClick("")}>
          <div className="roadmaplist-placeholder" />
          <div className="roadmaplist-label">AI Engineer</div>
        </div>

        <div className="roadmaplist-card" onClick={() => onCardClick("")}>
          <div className="roadmaplist-placeholder" />
          <div className="roadmaplist-label">Data Analyst</div>
        </div>

        <div className="roadmaplist-card" onClick={() => onCardClick("")}>
          <div className="roadmaplist-placeholder" />
          <div className="roadmaplist-label">AI and Data Scientist</div>
        </div>

        <div className="roadmaplist-card" onClick={() => onCardClick("")}>
          <div className="roadmaplist-placeholder" />
          <div className="roadmaplist-label">Android</div>
        </div>

        <div className="roadmaplist-card" onClick={() => onCardClick("")}>
          <div className="roadmaplist-placeholder" />
          <div className="roadmaplist-label">iOS</div>
        </div>

        <div className="roadmaplist-card" onClick={() => onCardClick("")}>
          <div className="roadmaplist-placeholder" />
          <div className="roadmaplist-label">PostgreSQL</div>
        </div>
      </div>
    </div>
  );
};

export default RoadmapList;
