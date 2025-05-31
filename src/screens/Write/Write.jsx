// src/screens/Write/Write.jsx
import React, { useState, useRef, useEffect } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import MDEditor from "@uiw/react-md-editor";
import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";
import "./Write.css";
import Component18 from "../../icons/GoBackIcon/GoBackIcon";
import CloseIcon from "../../icons/CloseIcon/CloseIcon";
import { SpellCheckComponent } from "../../components/SpellCheckComponent/SpellCheckComponent";
import { SaveDraftComponent } from "../../components/SaveDraftComponent/SaveDraftComponent";
import { PostComponent } from "../../components/PostComponent/PostComponent";
import { PublishComponent } from "../../components/PublishComponent/PublishComponent";

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
          // 커서 바로 앞 한 글자의 모든 포맷 가져오기 (폰트 포함)
          const currentFormat = this.quill.getFormat(range.index, 1);
          // 줄바꿈 삽입
          this.quill.insertText(range.index, "\n", currentFormat);
          // 커서를 다음 줄 맨 앞에 위치
          this.quill.setSelection(range.index + 1, 0);
          return false; // 기본 Enter 동작 방지
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
  const [mode, setMode] = useState("basic");
  const [basicValue, setBasicValue] = useState("");
  const [markdownValue, setMarkdownValue] = useState("");
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState(null);
  const [tags, setTags] = useState("");
  const [isSummaryPopupOpen, setIsSummaryPopupOpen] = useState(false);
  const [summaryText, setSummaryText] = useState("자동으로 요약한 내용을 불러오고, 수정도 가능하도록 했어용가리");
  const [showGithubUrlInput, setShowGithubUrlInput] = useState(false);
  const [githubUrl, setGithubUrl] = useState("");
  const [url, setUrl] = useState(""); // 엔터로 저장할 url 상태 추가
  const [fadeOut, setFadeOut] = useState(false); // fadeOut 상태 추가
  const tagInputRef = useRef(null); // 태그 입력창 포커스용 ref

  const textAreaRef = useRef(null);
  const popupRef = useRef(null);

  useEffect(() => {
    if (isSummaryPopupOpen && textAreaRef.current) {
      textAreaRef.current.focus();
      textAreaRef.current.setSelectionRange(summaryText.length, summaryText.length);
    }
    function handleClickOutside(e) {
      if (popupRef.current && !popupRef.current.contains(e.target)) {
        setIsSummaryPopupOpen(false);
      }
    }
    if (isSummaryPopupOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isSummaryPopupOpen, summaryText]);

  // 팝업이 열릴 때 fadeOut 초기화
  useEffect(() => {
    if (isSummaryPopupOpen) setFadeOut(false);
  }, [isSummaryPopupOpen]);

  const getMissingFields = () => {
    const miss = [];
    if (!title.trim()) miss.push("제목");
    if (!category) miss.push("카테고리");
    const content = mode === "basic" ? basicValue.trim() : markdownValue.trim();
    if (!content) miss.push("내용");
    return miss;
  };

  const handleSaveDraft = () => {
    const miss = getMissingFields();
    if (miss.length) return alert(`${miss.join(", ")}을(를) 입력해 주세요!`);
    alert("임시 저장되었습니다!");
  };
  const handlePost = () => {
    const miss = getMissingFields();
    if (miss.length) return alert(`${miss.join(", ")}을(를) 입력해 주세요!`);
    setIsSummaryPopupOpen(true);
  };
  const handlePublish = () => {
    const miss = getMissingFields();
    if (miss.length) return alert(`${miss.join(", ")}을(를) 입력해 주세요!`);
    alert("게시되었습니다!");
  };

  // 닫기 버튼 핸들러
  const handleCloseSummaryPopup = () => {
    setFadeOut(true);
    setTimeout(() => {
      setIsSummaryPopupOpen(false);
    }, 300); // CSS 트랜지션 시간과 맞춤
  };

  // 깃허브 URL 엔터 시 태그 추출 API 호출 및 태그 입력창에 append
  const handleGithubUrlKeyDown = async (e) => {
    if (e.key === "Enter") {
      const gitUrl = githubUrl;
      setUrl(gitUrl);
      setGithubUrl("");
      setShowGithubUrlInput(false);
      setTimeout(() => {
        if (tagInputRef.current) tagInputRef.current.focus();
      }, 0);
      try {
        const response = await fetch("http://localhost:8000/api/career/tag", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ git_url: gitUrl })
        });
        const result = await response.json();
        // 서버 응답이 { status, message, data } 형태일 때 data만 추출
        const tagArr = Array.isArray(result.data) ? result.data : [];
        if (tagArr.length > 0) {
          const tagString = tagArr.map(tag => `#${tag}`).join(", ");
          setTags(prev => prev ? prev + ", " + tagString : tagString);
        }
      } catch (err) {
        alert("깃허브 태그 추출에 실패했습니다.");
      }
    }
  };

  return (
    <div className="write-editor">
      <div className="editor-top-bar">
        <Component18 />
      </div>

      <div className="editor-content">
        <div className="editor-title-category">
          <input
            type="text"
            placeholder="Enter a title"
            value={title}
            onChange={e => setTitle(e.target.value)}
            className="editor-title-input"
          />
          <select
            value={mode}
            onChange={e => setMode(e.target.value)}
            className="editor-mode-select"
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
              />
            ) : (
              <input
                type="text"
                placeholder="#태그를 입력하세요 (#JavaScript #React ...)"
                value={tags}
                onChange={e => setTags(e.target.value)}
                className="editor-tag-input"
                ref={tagInputRef}
              />
            )}
            <button
              type="button"
              className="editor-github-tag-btn"
              onClick={() => setShowGithubUrlInput(v => !v)}
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
            />
          ) : (
            <MDEditor
              value={markdownValue}
              onChange={setMarkdownValue}
              height={500}
            />
          )}
        </div>

        <div className="editor-actions">
          <SpellCheckComponent className="spell-check-component" />
          <div className="editor-button-group">
            <SaveDraftComponent onClick={handleSaveDraft} />
            <PostComponent onClick={handlePost} />
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
            <div className="popup-buttons">
              <PublishComponent onClick={handlePublish} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}