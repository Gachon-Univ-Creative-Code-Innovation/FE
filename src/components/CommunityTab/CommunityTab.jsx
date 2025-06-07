import React, { useState } from "react";
import CommunityTabTool from "../CommunityTabTool/CommunityTabTool";
import "./CommunityTab.css";


export const CommunityTab = ({selectedTab, onTabChange}) => {
  const tabs = ["전체", "프로젝트", "공모전", "스터디", "기타"];

  return (
    <div className="communitytab-wrapper">
      {tabs.map((tab) => (
        <CommunityTabTool
          key={tab}
          className="communitytab-instance"
          property1={selectedTab === tab ? "active" : "default"}
          text={tab}
          onClick={() => onTabChange(tab)}
        />
      ))}
    </div>
  );
};

export default CommunityTab;
