// README 생성 화면 - 사용자 경험 개선 완료 (UI 한국어화, 타이핑 애니메이션 등)
import React, { useState, useEffect } from "react";
import GenerateReadme from "../../components/GenerateReadme/GenerateReadme";
import Historys from "../../components/Historys/Historys";
import PageTransitionWrapper from "../../components/PageTransitionWrapper/PageTransitionWrapper";
import ReadmeGenerator from "../../components/ReadmeGenerator/ReadmeGenerator";
import PaperPlaneIcon from "../../icons/PaperPlaneIcon/PaperPlaneIcon";
import HistoryList from "../../components/HistoryList/HistoryList";
import Readme from "../ShowReadme/ShowReadme";
import Navbar2 from "../../components/Navbar2/Navbar2";
import api from "../../api/instance";
import "./GenerateReadmeScreen.css";

export const GenerateReadmeScreen = () => {
  // 탭을 실제 표시되는 이름 그대로 설정
  const [selectedTab, setSelectedTab] = useState("README 생성");
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
      const apiUrl = "/github-service/readme";
      const response = await api.post(
        apiUrl,
          { git_url: url },
          { headers: { Accept: "application/json" } }
      );

      if (response.data.status !== 200 || !response.data.data) {
        throw new Error("README 정보를 불러오지 못했습니다.");
      }
      const downloadUrl = response.data.data;
      console.log("[DEBUG] downloadUrl:", downloadUrl); // 디버깅용 출력
      if (!downloadUrl) {
        throw new Error("README 다운로드 URL이 없습니다.");
      }

      let markdown = "";
      try {
        const mdResp = await fetch(downloadUrl);
        if (!mdResp.ok) throw new Error("README 파일을 불러오지 못했습니다. status: " + mdResp.status);
        markdown = await mdResp.text();
      } catch (fetchErr) {
        console.error("[DEBUG] fetch error:", fetchErr);
        throw fetchErr;
      }

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
    if (selectedTab === "내 작업실") {
      const fetchHistory = async () => {
        setShowLoader(true);
        try {
          const apiUrl = `github-service/db/user`;            
          const response = await api.get(apiUrl, { headers: { Accept: "application/json" } });

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
            {/* README 생성 탭: 클릭 시 showLoader를 즉시 false로 초기화 */}
            <div
              onClick={() => {
                setSelectedTab("README 생성");
                setShowLoader(false);
              }}
            >
              <GenerateReadme
                property1={
                  selectedTab === "README 생성" ? "selected" : "default"
                }
                className="generate-README-instance"
              />
            </div>

            {/* 내 작업실 탭: 클릭 시 showLoader를 즉시 false로 초기화 */}
            <div
              onClick={() => {
                setSelectedTab("내 작업실");
                setShowLoader(false);
              }}
            >
              <Historys
                property1={selectedTab === "내 작업실" ? "selected" : "default"}
                className="history-instance"
              />
            </div>
          </div>

          {/* ─── “Generate README” 화면 (URL 입력 & 전송 버튼) ─── */}
          {selectedTab === "README 생성" ? (
            <>
              <div className="frame-4">
                <input
                  className="url-input"
                  type="text"
                  placeholder="https://github.com/your-repo"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                />
                <PaperPlaneIcon
                  className={`generate-readme__icon ${url.trim() ? 'active' : ''}`}
                  onClick={handleGenerate}
                />
              </div>
              
              <div className="readme-intro">
                <h3>
                  {"✨ README 작성이 어려우신가요?".split('').map((char, index) => (
                    <span 
                      key={index} 
                      className="typing-char"
                      style={{animationDelay: `${index * 0.05}s`}}
                    >
                      {char === ' ' ? '\u00A0' : char}
                    </span>
                  ))}
                </h3>
                <p>
                  {"GitHub 주소만 넣어주세요!".split('').map((char, index) => (
                    <span 
                      key={index} 
                      className="typing-char"
                      style={{animationDelay: `${(20 + index) * 0.05}s`}}
                    >
                      {char === ' ' ? '\u00A0' : char}
                    </span>
                  ))}
                  <br/>
                  {"AlOG가 프로젝트를 분석해서 멋진 README를 만들어드릴게요.".split('').map((char, index) => (
                    <span 
                      key={index} 
                      className="typing-char"
                      style={{animationDelay: `${(35 + index) * 0.05}s`}}
                    >
                      {char === ' ' ? '\u00A0' : char}
                    </span>
                  ))}
                </p>
              </div>
            </>
          ) : (
            /* “History” 화면 (HistoryList) ─*/
            <div className="historylist-wrapper">
              <HistoryList
                items={historyItems}
                onPreview={handlePreviewFromHistory}
              />
            </div>
          )}

          {/* ReadmeGenerator(로딩 스피너) */}
          {selectedTab === "README 생성" && showLoader && (
            <ReadmeGenerator active={showLoader} onDone={handleReadmeDone} />
          )}

          {/* Readme 미리보기 팝업 */}
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
