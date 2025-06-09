import React from "react";
import CommunityTabTool from "../CommunityTabTool/CommunityTabTool";
import "./CommunityTab.css";

export const CommunityTab = ({ categories, selectedTab, onTabChange }) => {
  return (
    <div className="communitytab-wrapper">
      {categories.map((cat) => (
        <CommunityTabTool
          key={cat.key}
          className="communitytab-instance"
          property1={selectedTab === cat.key ? "active" : "default"}
          text={cat.label}
          onClick={() => onTabChange(cat.key)}
        />
      ))}
    </div>
  );
};

export default CommunityTab;
