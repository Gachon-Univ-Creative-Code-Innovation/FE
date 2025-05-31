import React, { useState, useEffect } from "react";
import GenerateReadme from "../../components/GenerateReadme/GenerateReadme";
import Historys from "../../components/Historys/Historys";
import PageTransitionWrapper from "../../components/PageTransitionWrapper/PageTransitionWrapper";
import ReadmeGenerator from "../../components/ReadmeGenerator/ReadmeGenerator";
import PaperPlaneIcon from "../../icons/PaperPlaneIcon/PaperPlaneIcon";
import HistoryList from "../../components/HistoryList/HistoryList";
import Readme from "../ShowReadme/ShowReadme";
import Navbar2 from "../../components/Navbar2/Navbar2";
import axios from "axios";
import "./GenerateReadmeScreen.css";

export const GenerateReadmeScreen = () => {
  // 탭을 실제 표시되는 이름 그대로 설정
  const [selectedTab, setSelectedTab] = useState("Generate README");
  const [url, setUrl] = useState("");
  const [historyItems, setHistoryItems] = useState([]);
  const [showLoader, setShowLoader] = useState(false);
  const [showReadmePopup, setShowReadmePopup] = useState(false);
  const [previewUrl, setPreviewUrl] = useState("");
  const [previewMarkdown, setPreviewMarkdown] = useState("");

  // “Generate README” 버튼 클릭 시 실제 API 요청 보내고, showLoader = true
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
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.status !== 200 || !response.data.data) {
        throw new Error("README 정보를 불러오지 못했습니다.");
      }
      const downloadUrl = response.data.data;
      if (!downloadUrl) {
        throw new Error("README 다운로드 URL이 없습니다.");
      }

      const mdResp = await fetch(downloadUrl);
      if (!mdResp.ok) throw new Error("README 파일을 불러오지 못했습니다.");
      const markdown = await mdResp.text();

      // 히스토리 업데이트
      setHistoryItems((prev) => {
        const existing = prev.find((item) => item.url === url);
        const newBlock = { image: "/img/readme-preview.png", markdown };
        if (existing) {
          return prev.map((item) =>
            item.url === url
              ? { ...item, blocks: [...(item.blocks || []), newBlock] }
              : item
          );
        }
        return [...prev, { url, blocks: [newBlock] }];
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

  // ReadmeGenerator가 내부적으로 로딩 끝났을 때 콜백
  const handleReadmeDone = () => {
    setShowLoader(false);
  };

  // 히스토리에서 “미리보기” 클릭 시 README fetch
  const handlePreviewFromHistory = async (url, downloadUrl) => {
    setPreviewUrl(url);
    setShowReadmePopup(true);
    setPreviewMarkdown("");

    if (downloadUrl) {
      try {
        const resp = await fetch(downloadUrl);
        if (!resp.ok) throw new Error("README 파일을 불러오지 못했습니다.");
        const markdown = await resp.text();
        setPreviewMarkdown(markdown);
      } catch (e) {
        setPreviewMarkdown("README를 불러오지 못했습니다.");
      }
    } else {
      setPreviewMarkdown("README 다운로드 URL이 없습니다.");
    }
  };

  // 팝업 닫기 핸들러
  const handleCloseReadmePopup = () => {
    setShowReadmePopup(false);
    setShowLoader(false);
  };

  // “History” 탭일 때만 히스토리 데이터 가져오기
  useEffect(() => {
    if (selectedTab === "History") {
      const fetchHistory = async () => {
        setShowLoader(true);
        try {
          const userId = 312;
          const apiUrl = `http://localhost:8000/api/career/db/user?userID=${userId}`;
          const token = localStorage.getItem("jwtToken");
          const response = await axios.get(apiUrl, {
            headers: { Authorization: `Bearer ${token}` },
          });

          if (
            response.data.status !== 200 ||
            !Array.isArray(response.data.data)
          ) {
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
          const items = Object.entries(grouped).map(([url, blocks]) => ({
            url,
            blocks,
          }));
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

  // Readme 팝업이 닫힐 때 마무리 스피너 해제
  useEffect(() => {
    if (!showReadmePopup) {
      setShowLoader(false);
    }
  }, [showReadmePopup]);

  // 언마운트 시에도 스피너 해제
  useEffect(() => () => setShowLoader(false), []);

  return (
    <PageTransitionWrapper>
      <Navbar2 />

      <div className="generate-README-screen">
        <div className="generate-README-2">
          {/* ─── 탭 버튼(Side by Side) ─── */}
          <div className="category">
            {/* Generate README 탭: 클릭 시 showLoader를 즉시 false로 초기화 */}
            <div
              onClick={() => {
                setSelectedTab("Generate README");
                setShowLoader(false);
              }}
            >
              <GenerateReadme
                property1={
                  selectedTab === "Generate README" ? "selected" : "default"
                }
                className="generate-README-instance"
              />
            </div>

            {/* History 탭: 클릭 시 showLoader를 즉시 false로 초기화 */}
            <div
              onClick={() => {
                setSelectedTab("History");
                setShowLoader(false);
              }}
            >
              <Historys
                property1={selectedTab === "History" ? "selected" : "default"}
                className="history-instance"
              />
            </div>
          </div>

          {/* ─── “Generate README” 화면 (URL 입력 & 전송 버튼) ─── */}
          {selectedTab === "Generate README" ? (
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
            /* ─── “History” 화면 (HistoryList) ─── */
            <div className="historylist-wrapper">
              <HistoryList
                items={historyItems}
                onPreview={handlePreviewFromHistory}
              />
            </div>
          )}

          {/* ─── ReadmeGenerator(로딩 스피너) ─── */}
          {/*
            “Generate README” 탭이고, showLoader === true일 때만 마운트(렌더)됩니다.
            showLoader가 false라면 <ReadmeGenerator> 자체가 렌더되지 않으므로
            스피너도 절대 보이지 않습니다.
          */}
          {selectedTab === "Generate README" && showLoader && (
            <ReadmeGenerator active={showLoader} onDone={handleReadmeDone} />
          )}

          {/* ─── Readme 미리보기 팝업 ─── */}
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
