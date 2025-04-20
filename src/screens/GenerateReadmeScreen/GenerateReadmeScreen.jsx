import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GenerateReadme from "../../components/GenerateReadme/GenerateReadme";
import History from "../../components/Historys/Historys";
import GoBackIcon from "../../icons/GoBackIcon/GoBackIcon";
import PageTransitionWrapper from "../../components/PageTransitionWrapper/PageTransitionWrapper";
import ReadmeGenerator from "../../components/ReadmeGenerator/ReadmeGenerator";
import PaperPlaneIcon from "../../icons/PaperPlaneIcon/PaperPlaneIcon";
import "./GenerateReadmeScreen.css";

export const GenerateReadmeScreen = () => {
  const [selectedTab, setSelectedTab] = useState("generate");
  const [url, setUrl] = useState("");
  const [showLoader, setShowLoader] = useState(false);
  const navigate = useNavigate();

  const handleGenerate = () => {
    if (!url.trim()) {
      alert("Repository 주소를 입력하세요!");
      return;
    }
    setShowLoader(true);
  };

  return (
    <PageTransitionWrapper>
      <GoBackIcon className="gobackcomponent" />
      <div className="generate-README-screen">
        <div className="generate-README-2">
          {/* 탭 */}
          <div className="category">
            <div onClick={() => setSelectedTab("generate")}>
              <GenerateReadme
                className="generate-README-instance"
                property1={selectedTab === "generate" ? "selected" : "default"}
              />
            </div>
            <div onClick={() => setSelectedTab("history")}>
              <History
                className="history-instance"
                property1={selectedTab === "history" ? "selected" : "default"}
              />
            </div>
          </div>

          <div className="frame-2">
            <div className="component-wrapper" />
            <img
              className="alog-logo"
              alt="Alog logo"
              src="/img/alog-logo.png"
              onClick={() => navigate("/MainPageAfter")}
              style={{ cursor: "pointer" }}
            />
            <div className="frame-3">
              <div className="mode-edit">
                <div className="group">
                  <div className="overlap-group-wrapper">
                    <div className="overlap-group" />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="frame-4">
            <input
              className="url-input"
              type="text"
              placeholder="https://github.com/your-repo"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
            <PaperPlaneIcon
              className="generate-readme__icon"
              onClick={handleGenerate}
            />
          </div>

          {/* 로딩 스피너 */}
          <ReadmeGenerator
            active={showLoader}
            onDone={() => setShowLoader(false)}
          />
        </div>
      </div>
    </PageTransitionWrapper>
  );
};

export default GenerateReadmeScreen;
