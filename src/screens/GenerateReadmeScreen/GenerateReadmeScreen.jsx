import React, { useState, useEffect } from "react";
import GenerateReadme from "../../components/GenerateReadme/GenerateReadme";
import History from "../../components/Historys/Historys";
import PageTransitionWrapper from "../../components/PageTransitionWrapper/PageTransitionWrapper";
import ReadmeGenerator from "../../components/ReadmeGenerator/ReadmeGenerator";
import PaperPlaneIcon from "../../icons/PaperPlaneIcon/PaperPlaneIcon";
import HistoryList from "../../components/HistoryList/HistoryList";
import Readme from "../ShowReadme/ShowReadme";
import Navbar2 from "../../components/Navbar2/Navbar2";
import axios from "axios";
import "./GenerateReadmeScreen.css";

export const GenerateReadmeScreen = () => {
  const [selectedTab, setSelectedTab] = useState("generate");
  const [url, setUrl] = useState("");
  const [historyItems, setHistoryItems] = useState([]);
  const [showLoader, setShowLoader] = useState(false);
  const [showReadmePopup, setShowReadmePopup] = useState(false);
  const [previewUrl, setPreviewUrl] = useState("");
  const [previewMarkdown, setPreviewMarkdown] = useState("");

  const handleGenerate = async () => {
    if (!url.trim()) {
      alert("Repository 주소를 입력하세요!");
      return;
    }
    setShowLoader(true);
    try {
      const apiUrl = `http://localhost:8000/api/career/readme`;
      const token = localStorage.getItem("jwtToken");
      const response = await axios.post(
        apiUrl,
        { git_url: url },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("API response:", response.data);
      if (
        response.data.status !== 200 ||
        !response.data.data
      )
        throw new Error("README 정보를 불러오지 못했습니다.");
      const downloadUrl = response.data.data;
      console.log("downloadUrl:", downloadUrl);
      if (!downloadUrl) throw new Error("README 다운로드 URL이 없습니다.");

      const mdResp = await fetch(downloadUrl);
      console.log("mdResp status:", mdResp.status);
      if (!mdResp.ok) throw new Error("README 파일을 불러오지 못했습니다.");
      const markdown = await mdResp.text();
      setHistoryItems((prev) => {
        const existingItem = prev.find((item) => item.url === url);
        const newBlock = { image: "/img/readme-preview.png", markdown };
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
      setPreviewUrl(url);
      setPreviewMarkdown(markdown);
      setShowReadmePopup(true);
      setShowLoader(false);
    } catch (e) {
      alert("README를 불러오지 못했습니다.\n" + (e.message || e));
      setShowLoader(false);
    } finally {
      setShowLoader(false);
    }
  };

  const handleReadmeDone = () => {
    setShowLoader(false);
  };

  // supabase에서 README를 fetch해서 보여주는 핸들러
  const handlePreviewFromHistory = async (url, downloadUrl) => {
    setPreviewUrl(url);
    setShowReadmePopup(true);
    setPreviewMarkdown(''); // 로딩 중 비움
    if (downloadUrl) {
      try {
        const resp = await fetch(downloadUrl);
        if (!resp.ok) throw new Error('README 파일을 불러오지 못했습니다.');
        const markdown = await resp.text();
        setPreviewMarkdown(markdown);
      } catch (e) {
        setPreviewMarkdown('README를 불러오지 못했습니다.');
      }
    } else {
      setPreviewMarkdown('README 다운로드 URL이 없습니다.');
    }
  };

  const handleCloseReadmePopup = () => {
    setShowReadmePopup(false);
    setShowLoader(false);
  };

  // history 탭 진입 시 서버에서 데이터 받아오기
  useEffect(() => {
    if (selectedTab === "history") {
      const fetchHistory = async () => {
        setShowLoader(true);
        try {
          const userId = 312;
          const apiUrl = `http://localhost:8000/api/career/db/user?userID=${userId}`;
          const token = localStorage.getItem("jwtToken");
          const response = await axios.get(apiUrl, {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (response.data.status !== 200 || !Array.isArray(response.data.data)) {
            throw new Error("히스토리 데이터를 불러오지 못했습니다.");
          }
          // github_url별로 묶어서 blocks 배열로 변환
          const grouped = {};
          response.data.data.forEach((item) => {
            if (!grouped[item.github_url]) grouped[item.github_url] = [];
            grouped[item.github_url].push({
              markdown: item.meta_data || "",
              version: item.version,
              download_url: item.download_url,
            });
          });
          const items = Object.entries(grouped).map(([url, blocks]) => ({ url, blocks }));
          setHistoryItems(items);
        } catch (e) {
          alert("히스토리 불러오기 실패\n" + (e.message || e));
        } finally {
          setShowLoader(false);
        }
      };
      fetchHistory();
    }
  }, [selectedTab]);

  useEffect(() => {
    if (!showReadmePopup) {
      setShowLoader(false);
    }
  }, [showReadmePopup]);

  useEffect(() => {
    return () => {
      setShowLoader(false);
    };
  }, []);

  return (
    <PageTransitionWrapper>
      <Navbar2 />
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

          {/* ReadmeGenerator는 generate 탭에서만 렌더링 */}
          {selectedTab === "generate" && (
            <ReadmeGenerator active={showLoader} onDone={handleReadmeDone} />
          )}

          {showReadmePopup && (
            <div className="readme-popup-overlay">
              <Readme
                onClose={handleCloseReadmePopup}
                markdown={previewMarkdown}
                url={previewUrl}
                onRegenerate={setPreviewMarkdown}
              />
            </div>
          )}
        </div>
      </div>
    </PageTransitionWrapper>
  );
};

export default GenerateReadmeScreen;
