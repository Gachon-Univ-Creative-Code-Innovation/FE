import React, { useState } from "react";
import CommunityTabTool from "../CommunityTabTool/CommunityTabTool";
import "./CommunityTab.css";

export const CommunityTab = () => {
  const [selected, setSelected] = useState("전체");

  const tabs = ["전체", "프로젝트", "공모전", "스터디", "기타"];

  return (
    <div className="frame-wrapper">
      {tabs.map((tab) => (
        <CommunityTabTool
          key={tab}
          className="component-316-instance"
          property1={selected === tab ? "active" : "default"}
          text={tab}
          onClick={() => setSelected(tab)}
        />
      ))}
    </div>
  );
};

export default CommunityTab;
