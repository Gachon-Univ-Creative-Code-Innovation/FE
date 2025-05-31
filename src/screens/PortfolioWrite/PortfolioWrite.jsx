import React, { useState, useRef, useEffect } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "./PortfolioWrite.css";
import Component18 from "../../icons/GoBackIcon/GoBackIcon";
import CloseIcon from "../../icons/CloseIcon/CloseIcon";
import { SaveDraftComponent } from "../../components/SaveDraftComponent/SaveDraftComponent";
import { PostComponent } from "../../components/PostComponent/PostComponent";

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

export default function PortfolioWrite() {
  const [basicValue, setBasicValue] = useState("");
  const [title, setTitle] = useState("");
  const [tags, setTags] = useState("");
  const [isRepoPopupOpen, setIsRepoPopupOpen] = useState(false);
  const [repoUrl, setRepoUrl] = useState("");
  const [fadeOut, setFadeOut] = useState(false);

  const inputRef = useRef(null);
  const popupRef = useRef(null);

  useEffect(() => {
    if (isRepoPopupOpen && inputRef.current) {
      inputRef.current.focus();
    }
    function handleClickOutside(e) {
      if (popupRef.current && !popupRef.current.contains(e.target)) {
        setIsRepoPopupOpen(false);
      }
    }
    if (isRepoPopupOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isRepoPopupOpen]);

  // 팝업이 열릴 때 fadeOut 초기화
  useEffect(() => {
    if (isRepoPopupOpen) setFadeOut(false);
  }, [isRepoPopupOpen]);

  const getMissingFields = () => {
    const miss = [];
    if (!title.trim()) miss.push("제목");
    if (!basicValue.trim()) miss.push("내용");
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
    alert("게시되었습니다!");
  };

  const handleAIHelper = () => {
    setIsRepoPopupOpen(true);
  };

  // 닫기 버튼 핸들러
  const handleCloseRepoPopup = () => {
    setFadeOut(true);
    setTimeout(() => {
      setIsRepoPopupOpen(false);
      setRepoUrl("");
    }, 300);
  };

  const handleCreateFromRepo = () => {
    if (!repoUrl.trim()) {
      alert("레포지토리 주소를 입력해 주세요!");
      return;
    }
    // 여기에 레포지토리 분석 로직 추가
    alert("레포지토리 분석을 시작합니다!");
    handleCloseRepoPopup();
  };

  return (
    <div className="portfolio-write-container">
      <div className="header-bar">
        <Component18 />
      </div>

      <div className="main-content">
        <div className="title-section">
          <input
            type="text"
            placeholder="Enter a title"
            value={title}
            onChange={e => setTitle(e.target.value)}
            className="title-input"
          />
        </div>

        <div className="tags-section">
          <input
            type="text"
            placeholder="#태그를 입력하세요 (#FE #React ...)"
            value={tags}
            onChange={e => setTags(e.target.value)}
            className="tags-input"
          />
        </div>

        <div className="quill-editor-container">
          <ReactQuill
            value={basicValue}
            onChange={setBasicValue}
            theme="snow"
            modules={modules}
            formats={formats}
            placeholder="내용을 입력하세요..."
          />
        </div>

        <div className="actions-section">
          <div className="actions-button-group">
            <button
              type="button"
              className="ai-helper-button"
              onClick={handleAIHelper}
            >
              🔮 AI 도우미 ✨
            </button>
            <div className="action-buttons-group">
              <SaveDraftComponent onClick={handleSaveDraft} />
              <PostComponent onClick={handlePost} />
            </div>
          </div>
        </div>
      </div>

      {isRepoPopupOpen && (
        <div className={`repo-popup-overlay${fadeOut ? ' fade-out' : ''}`}>
          <div ref={popupRef} className="repo-popup-content">
            <div className="repo-popup-header">
              <div className="repo-popup-title">🚀 레포지토리 주소를 입력하면, AlOG가 초안을 만들어드려요! 🚀</div>
              <CloseIcon onClick={handleCloseRepoPopup} className="repo-popup-close" />
            </div>
            <div className="repo-input-container">
              <input
                ref={inputRef}
                type="text"
                placeholder="레포지토리 주소를 입력하세요"
                value={repoUrl}
                onChange={e => setRepoUrl(e.target.value)}
                className="repo-input"
              />
              <button
                type="button"
                className="repo-create-button"
                onClick={handleCreateFromRepo}
              >
                만들기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}