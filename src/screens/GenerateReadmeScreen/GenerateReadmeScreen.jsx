import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GenerateReadme from "../../components/GenerateReadme/GenerateReadme";
import History from "../../components/Historys/Historys";
import GoBackIcon from "../../icons/GoBackIcon/GoBackIcon";
import PageTransitionWrapper from "../../components/PageTransitionWrapper/PageTransitionWrapper";
import ReadmeGenerator from "../../components/ReadmeGenerator/ReadmeGenerator";
import PaperPlaneIcon from "../../icons/PaperPlaneIcon/PaperPlaneIcon";
import HistoryList from "../../components/HistoryList/HistoryList";
import { Readme } from "../ShowReadme/ShowReadme";
import "./GenerateReadmeScreen.css";

export const GenerateReadmeScreen = () => {
  const [selectedTab, setSelectedTab] = useState("generate");
  const [url, setUrl] = useState("");
  const [historyItems, setHistoryItems] = useState([]);
  const [showLoader, setShowLoader] = useState(false);
  const [showReadmePopup, setShowReadmePopup] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [previewUrl, setPreviewUrl] = useState("");
  const navigate = useNavigate();

  const handleGenerate = () => {
    if (!url.trim()) {
      alert("Repository 주소를 입력하세요!");
      return;
    }

    setHistoryItems((prev) => {
      const existingItem = prev.find((item) => item.url === url);
      const newBlock = { image: "/img/readme-preview.png" };

      if (existingItem) {
        return prev.map((item) =>
          item.url === url
            ? { ...item, blocks: [...(item.blocks || []), newBlock] }
            : item
        );
      } else {
        return [...prev, { url, blocks: [newBlock] }];
      }
    });

    setShowLoader(true);
  };

  const handleReadmeDone = () => {
    setShowLoader(false);
    setPreviewUrl(url);
    setPreviewImage("/img/readme-preview.png");
    setShowReadmePopup(true);
  };

  const handlePreviewFromHistory = (url, image) => {
    setPreviewUrl(url);
    setPreviewImage(image);
    setShowReadmePopup(true);
  };

  return (
    <PageTransitionWrapper>
      <GoBackIcon className="gobackcomponent" />
      <div className="generate-README-screen">
        <div className="generate-README-2">
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

          {selectedTab === "generate" ? (
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
          ) : (
            <div className="historylist-wrapper">
              <HistoryList
                items={historyItems}
                onPreview={handlePreviewFromHistory}
              />
            </div>
          )}

          <ReadmeGenerator active={showLoader} onDone={handleReadmeDone} />

          {showReadmePopup && (
            <div className="readme-popup-overlay">
              <Readme
                onClose={() => setShowReadmePopup(false)}
                image={previewImage}
                url={previewUrl}
              />
            </div>
          )}
        </div>
      </div>
    </PageTransitionWrapper>
  );
};

export default GenerateReadmeScreen;
