import React, { useState } from "react";
import GenerateReadme from "../../components/GenerateReadme/GenerateReadme";
import History from "../../components/Historys/Historys";
import PageTransitionWrapper from "../../components/PageTransitionWrapper/PageTransitionWrapper";
import ReadmeGenerator from "../../components/ReadmeGenerator/ReadmeGenerator";
import PaperPlaneIcon from "../../icons/PaperPlaneIcon/PaperPlaneIcon";
import HistoryList from "../../components/HistoryList/HistoryList";
import { Readme } from "../ShowReadme/ShowReadme";
import Navbar2 from "../../components/Navbar2/Navbar2";
import "./GenerateReadmeScreen.css";

export const GenerateReadmeScreen = () => {
  const [selectedTab, setSelectedTab] = useState("generate");
  const [url, setUrl] = useState("");
  const [historyItems, setHistoryItems] = useState([]);
  const [showLoader, setShowLoader] = useState(false);
  const [showReadmePopup, setShowReadmePopup] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [previewUrl, setPreviewUrl] = useState("");

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
      <Navbar2 /> {/* ✅ 고정 네비게이션 바 삽입 */}
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
