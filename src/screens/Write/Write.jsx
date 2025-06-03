// src/screens/Write/Write.jsx
import React, { useState, useRef, useEffect } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import MDEditor from "@uiw/react-md-editor";
import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";
import "./Write.css";
import GoBackIcon from "../../icons/GoBackIcon/GoBackIcon";
import CloseIcon from "../../icons/CloseIcon/CloseIcon";
import { SpellCheckComponent } from "../../components/SpellCheckComponent/SpellCheckComponent";
import { SaveDraftComponent } from "../../components/SaveDraftComponent/SaveDraftComponent";
import { PostComponent } from "../../components/PostComponent/PostComponent";
import { PublishComponent } from "../../components/PublishComponent/PublishComponent";

// API 엔드포인트 상수화
const API_ENDPOINTS = {
  SUMMARIZE: "http://localhost:8500/api/summarize-service/summarize",
  POST: "http://localhost:8000/api/post",
  TAG_EXTRACT: "http://localhost:8000/api/career/tag"
};

const Categories = [
  { key: null, label: "카테고리 선택" },
  { key: "개발", label: "개발" },
  { key: "클라우드&인프라", label: "클라우드 & 인프라" },
  { key: "AI", label: "AI" },
  { key: "데이터베이스", label: "데이터베이스" },
  { key: "cs", label: "CS 지식" },
  { key: "프로젝트", label: "프로젝트" },
  { key: "트러블슈팅", label: "문제해결(트러블 슈팅)" },
  { key: "성장", label: "성장 기록" },
  { key: "it뉴스", label: "IT 뉴스" },
  { key: "기타", label: "기타" }
];

// ReactQuill 모듈 설정
const modules = {
  toolbar: [
    [{ header: [1, 2, 3, 4, 5, 6, false] }],
    [{ font: [] }],
    ["bold", "italic", "underline", "strike"],
    ["blockquote", "code-block"],
    [{ color: [] }, { background: [] }],
    [{ script: "sub" }, { script: "super" }],
    [{ list: "ordered" }, { list: "bullet" }],
    [{ indent: "-1" }, { indent: "+1" }],
    [{ align: [] }],
    ["link", "image", "video"],
    ["clean"]
  ],
  keyboard: {
    bindings: {
      // Shift + Enter로 같은 포맷 유지하며 줄바꿈
      "shift enter": {
        key: "Enter",
        shiftKey: true,
        handler(range) {
          const currentFormat = this.quill.getFormat(range.index, 1);
          this.quill.insertText(range.index, "\n", currentFormat);
          this.quill.setSelection(range.index + 1, 0);
          return false;
        }
      }
    }
  },
  clipboard: {
    matchVisual: false
  }
};

// ReactQuill 포맷 설정
const formats = [
  "header", "font",
  "bold", "italic", "underline", "strike",
  "blockquote", "code-block",
  "color", "background",
  "script", "list", "bullet", "indent",
  "align",
  "link", "image", "video"
];

export default function Write() {
  // 에디터 모드, 입력 값, 팝업 관련 상태 등
  const [mode, setMode] = useState("basic");
  const [basicValue, setBasicValue] = useState("");
  const [markdownValue, setMarkdownValue] = useState("");
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState(null);
  const [tags, setTags] = useState("");
  const [isSummaryPopupOpen, setIsSummaryPopupOpen] = useState(false);
  const [summaryText, setSummaryText] = useState("");
  const [loadingSummary, setLoadingSummary] = useState(false);
  const [summaryFailed, setSummaryFailed] = useState(false);
  const [showGithubUrlInput, setShowGithubUrlInput] = useState(false);
  const [githubUrl, setGithubUrl] = useState("");
  const [url, setUrl] = useState("");
  const [fadeOut, setFadeOut] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false); // 전반적인 처리 상태

  const tagInputRef = useRef(null);
  const textAreaRef = useRef(null);
  const popupRef = useRef(null);

  // 팝업 외부 클릭 시 닫기 및 textarea 포커스 관리
  useEffect(() => {
    if (isSummaryPopupOpen && !loadingSummary && textAreaRef.current) {
      textAreaRef.current.focus();
      textAreaRef.current.setSelectionRange(summaryText.length, summaryText.length);
    }
    
    function handleClickOutside(e) {
      if (popupRef.current && !popupRef.current.contains(e.target)) {
        handleCloseSummaryPopup();
      }
    }
    
    if (isSummaryPopupOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isSummaryPopupOpen, loadingSummary, summaryText]);

  // 팝업이 열릴 때 fadeOut 초기화
  useEffect(() => {
    if (isSummaryPopupOpen) setFadeOut(false);
  }, [isSummaryPopupOpen]);

  // 필수 입력값 체크 함수
  // HTML 태그를 제거하고, 남는 순수한 텍스트 길이를 체크하는 헬퍼 함수
  const stripHtml = (html) => {
    // 정규 표현식을 통해 <태그>…</태그> 제거
    return html.replace(/<[^>]+>/g, "");
  };

  const getMissingFields = () => {
    const missing = [];
    if (!title.trim()) missing.push("제목");
    if (!category) missing.push("카테고리");

    // ① 에디터 모드에 따라 raw HTML을 가져온다.
    const rawContent = mode === "basic" ? basicValue : markdownValue;
    
    // ② HTML 태그를 모두 제거해서 순수 텍스트만 남긴 뒤 trim()
    const plainText = stripHtml(rawContent).trim();

    // ③ 순수 텍스트 길이가 0이면 “내용 누락”으로 판단
    if (!plainText) missing.push("내용");
    return missing;
  };

  // API 호출 헬퍼 함수
  const apiCall = async (url, options = {}) => {
    try {
      const response = await fetch(url, {
        headers: { "Content-Type": "application/json" },
        ...options
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('API call failed:', error);
      throw error;
    }
  };

  // 요약 API 호출 함수
  const fetchSummary = async (content) => {
    const response = await apiCall(API_ENDPOINTS.SUMMARIZE, {
      method: "POST",
      body: JSON.stringify({ post_id: 0, context: content })
    });
    
    if (response.status !== 200) {
      throw new Error(response.message || "요약 생성에 실패했습니다.");
    }
    
    return response.data;
  };

  // 임시 저장 버튼 클릭
  const handleSaveDraft = () => {
    const missingFields = getMissingFields();
    if (missingFields.length > 0) {
      alert(`${missingFields.join(', ')}을 입력해 주세요!`);
      return;
    }
    
    // 임시 저장 로직 구현
    const draftData = {
      title,
      category,
      tags,
      content: mode === "basic" ? basicValue : markdownValue,
      mode,
      github_url: url,
      saved_at: new Date().toISOString()
    };
    
    // localStorage에 임시 저장 (실제로는 서버에 저장해야 함)
    try {
      localStorage.setItem('draft_post', JSON.stringify(draftData));
      alert("임시 저장이 완료되었습니다!");
    } catch (error) {
      console.error("임시 저장 실패:", error);
      alert("임시 저장에 실패했습니다.");
    }
  };

  // 게시하기 버튼 클릭 (요약 팝업 열기)
  const handlePost = async () => {
    const missingFields = getMissingFields();
    if (missingFields.length > 0) {
      alert(`${missingFields.join(', ')}을 입력해 주세요!`);
      return;
    }

    if (isProcessing) return;

    const content = mode === "basic" ? basicValue : markdownValue;

    setSummaryText("");
    setIsSummaryPopupOpen(true);
    setLoadingSummary(true);
    setSummaryFailed(false);

    try {
      const summary = await fetchSummary(content);
      setSummaryText(summary);
      setSummaryFailed(false);
    } catch (error) {
      console.error("요약 생성 실패:", error);
      setSummaryFailed(true);
    } finally {
      setLoadingSummary(false);
    }
  };

  // 게시하기(요약 결과 포함하여 POST 요청)
  const handlePublish = async () => {
    const missingFields = getMissingFields();
    if (missingFields.length > 0) {
      alert(`${missingFields.join(', ')}을 입력해 주세요!`);
      return;
    }

    if (isProcessing) return;

    setIsProcessing(true);
    setIsSummaryPopupOpen(false);

    const contentValue = mode === "basic" ? basicValue : markdownValue;
    const postData = {
      title,
      category,
      tags: tags
        .split(",")
        .map(tag => tag.trim())
        .filter(tag => tag), // 빈 문자열 필터링
      content: contentValue,
      summary: summaryText,
      github_url: url
    };

    try {
      const result = await apiCall(API_ENDPOINTS.POST, {
        method: "POST",
        body: JSON.stringify(postData)
      });
      
      if (result.status !== 200) {
        throw new Error(result.message || "게시글 등록에 실패했습니다.");
      }
      
      alert("게시글이 성공적으로 등록되었습니다!");
      // 성공 시 폼 초기화 또는 페이지 이동 로직 추가
      
    } catch (error) {
      console.error("게시글 등록 실패:", error);
      alert("게시글 등록에 실패했습니다.");
    } finally {
      setIsProcessing(false);
    }
  };

  // 요약 재생성
  const handleRegenerateSummary = async () => {
    const content = mode === "basic" ? basicValue : markdownValue;
    setLoadingSummary(true);
    setSummaryFailed(false);

    try {
      const summary = await fetchSummary(content);
      setSummaryText(summary);
      setSummaryFailed(false);
    } catch (error) {
      console.error("요약 재생성 실패:", error);
      setSummaryFailed(true);
    } finally {
      setLoadingSummary(false);
    }
  };

  // 팝업 닫기 버튼 클릭
  const handleCloseSummaryPopup = () => {
    setFadeOut(true);
    setTimeout(() => {
      setIsSummaryPopupOpen(false);
      setFadeOut(false);
    }, 300); // CSS 트랜지션 시간과 맞춤
  };

  // 깃허브 URL 입력 후 Enter → 태그 추출 API 호출
  const handleGithubUrlKeyDown = async (e) => {
    if (e.key === "Enter" && githubUrl.trim()) {
      const gitUrl = githubUrl.trim();
      setUrl(gitUrl);
      setGithubUrl("");
      setShowGithubUrlInput(false);
      
      setTimeout(() => {
        if (tagInputRef.current) tagInputRef.current.focus();
      }, 0);

      try {
        const result = await apiCall(API_ENDPOINTS.TAG_EXTRACT, {
          method: "POST",
          body: JSON.stringify({ git_url: gitUrl })
        });
        
        const tagArr = Array.isArray(result.data) ? result.data : [];
        if (tagArr.length > 0) {
          const tagString = tagArr.map(tag => `#${tag}`).join(", ");
          setTags(prev => (prev ? prev + ", " + tagString : tagString));
        }
        
      } catch (error) {
        console.error("깃허브 태그 추출 실패:", error);
      }
    }
  };

  // 초기 드래프트 로드
  useEffect(() => {
    try {
      const savedDraft = localStorage.getItem('draft_post');
      if (savedDraft) {
        const draft = JSON.parse(savedDraft);
        setTitle(draft.title || "");
        setCategory(draft.category || null);
        setTags(draft.tags || "");
        setMode(draft.mode || "basic");
        if (draft.mode === "basic") {
          setBasicValue(draft.content || "");
        } else {
          setMarkdownValue(draft.content || "");
        }
        setUrl(draft.github_url || "");
      }
    } catch (error) {
      console.error("드래프트 로드 실패:", error);
    }
  }, []);

  return (
    <div className="write-editor">
      <div className="editor-top-bar">
        <GoBackIcon />
      </div>

      <div className="editor-content">
        <div className="editor-title-category">
          <input
            type="text"
            placeholder="Enter a title"
            value={title}
            onChange={e => setTitle(e.target.value)}
            className="editor-title-input"
            disabled={isProcessing}
          />
          <select
            value={mode}
            onChange={e => setMode(e.target.value)}
            className="editor-mode-select"
            disabled={isProcessing}
          >
            <option value="basic">기본모드</option>
            <option value="markdown">Markdown</option>
          </select>
        </div>

        <div className="editor-tag-category">
          <select
            value={category ?? ""}
            onChange={e => setCategory(e.target.value || null)}
            className="editor-category-select"
            disabled={isProcessing}
          >
            {Categories.map(c => (
              <option key={c.key ?? "default"} value={c.key ?? ""}>
                {c.label}
              </option>
            ))}
          </select>
          
          <div style={{ display: 'flex', alignItems: 'center', width: '100%', gap: '8px' }}>
            {showGithubUrlInput ? (
              <input
                type="text"
                placeholder="깃허브 저장소 URL을 입력하세요"
                value={githubUrl}
                onChange={e => setGithubUrl(e.target.value)}
                onKeyDown={handleGithubUrlKeyDown}
                className="editor-github-url-input editor-github-url-input-animated"
                disabled={isProcessing}
              />
            ) : (
              <input
                type="text"
                placeholder="#태그를 입력하세요 (예: #JavaScript, #React)"
                value={tags}
                onChange={e => setTags(e.target.value)}
                className="editor-tag-input"
                ref={tagInputRef}
                disabled={isProcessing}
              />
            )}
            <button
              type="button"
              className="editor-github-tag-btn"
              onClick={() => setShowGithubUrlInput(v => !v)}
              disabled={isProcessing}
            >
              {showGithubUrlInput ? '돌아가기' : '깃허브에서 태그 추출'}
            </button>
          </div>
        </div>

        <div className="editor-area">
          {mode === "basic" ? (
            <ReactQuill
              value={basicValue}
              onChange={setBasicValue}
              theme="snow"
              modules={modules}
              formats={formats}
              placeholder="내용을 입력하세요..."
              readOnly={isProcessing}
            />
          ) : (
            <MDEditor
              value={markdownValue}
              onChange={setMarkdownValue}
              height={500}
              preview="edit"
            />
          )}
        </div>

        <div className="editor-actions">
          <SpellCheckComponent className="spell-check-component" />
          <div className="editor-button-group">
            <SaveDraftComponent 
              onClick={handleSaveDraft} 
              disabled={isProcessing}
            />
            <PostComponent 
              onClick={handlePost} 
              disabled={isProcessing}
            />
          </div>
        </div>
      </div>

      {isSummaryPopupOpen && (
        <div className={`summary-popup-overlay${fadeOut ? ' fade-out' : ''}`}>
          <div ref={popupRef} className="summary-popup-content">
            <div className="popup-header">
              <div className="popup-title">🫧 AlOG가 글을 요약했어요! 🫧</div>
              <CloseIcon onClick={handleCloseSummaryPopup} className="close-icon" />
            </div>

            {loadingSummary ? (
              <div style={{ padding: "40px 0", textAlign: "center" }}>
                <p style={{ fontSize: "1.1rem" }}>요약 중… 잠시만 기다려 주세요</p>
              </div>
            ) : summaryFailed ? (
              <>
                <div className="summary-failed-content">
                  <div className="failed-icon">⚠️</div>
                  <div className="failed-message">요약 생성에 실패했습니다</div>
                  <div className="failed-description">
                    네트워크 문제이거나 일시적인 오류일 수 있습니다.<br/>
                    다시 시도해주세요.
                  </div>
                </div>
                <div className="popup-buttons">
                  <button
                    onClick={handleRegenerateSummary}
                    className="regenerate-button"
                    disabled={loadingSummary}
                  >
                    다시 만들기
                  </button>
                </div>
              </>
            ) : (
              <textarea
                ref={textAreaRef}
                value={summaryText}
                onChange={e => setSummaryText(e.target.value)}
                className="summary-textarea"
                style={{
                  height: Math.min(80 + summaryText.split("\n").length * 20, 450) + "px",
                  overflowY: summaryText.split("\n").length > 10 ? "auto" : "hidden"
                }}
              />
            )}

            {!loadingSummary && !summaryFailed && (
              <div className="popup-buttons">
                <PublishComponent 
                  onClick={handlePublish} 
                  disabled={isProcessing}
                />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}