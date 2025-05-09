import React, { useState, useRef, useEffect } from "react";
import MDEditor from "@uiw/react-md-editor";
import ReactQuill from "react-quill";
import Component18 from "../../icons/GoBackIcon/GoBackIcon";
import "react-quill/dist/quill.snow.css";
import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";
import "./Write.css";
import CloseIcon from "../../icons/CloseIcon/CloseIcon";
import { SpellCheckComponent } from "../../components/SpellCheckComponent/SpellCheckComponent";
import { SaveDraftComponent } from "../../components/SaveDraftComponent/SaveDraftComponent";
import { PostComponent } from "../../components/PostComponent/PostComponent";
import { PublishComponent } from "../../components/PublishComponent/PublishComponent";

const MODES = [
  { key: "basic", label: "기본모드" },
  { key: "markdown", label: "markdown" },
];

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
  { key: "기타", label: "기타" },
];

export default function Write() {
  const [mode, setMode] = useState("basic");
  const [basicValue, setBasicValue] = useState("");
  const [markdownValue, setMarkdownValue] = useState("");
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState(null);
  const [tags, setTags] = useState("");
  const [isSummaryPopupOpen, setIsSummaryPopupOpen] = useState(false);
  const [summaryText, setSummaryText] = useState(
    "Expo로 리액트 네이티브 앱 개발 요약\n" +
    "Expo CLI로 프로젝트 생성 후, Expo Go 앱에서 실시간 테스트 가능\n" +
    "파일 기반 라우팅 지원: 폴더/파일 구조로 경로 자동 생성\n" +
    "Stack, Tab 등 다양한 내비게이션 패턴 제공\n" +
    "React Navigation 라이브러리와 통합\n" +
    "Expo SDK로 카메라, 위치 정보 등 다양한 기능 제공\n"
  );

  // textarea의 ref를 생성
  const textAreaRef = useRef(null);
  const popupRef = useRef(null); 

  useEffect(() => {
    if (isSummaryPopupOpen && textAreaRef.current) {
      textAreaRef.current.focus();
      textAreaRef.current.setSelectionRange(summaryText.length, summaryText.length);
    }

    const handleClickOutside = (e) => {
      if (popupRef.current && !popupRef.current.contains(e.target)) {
        setIsSummaryPopupOpen(false);
      }
    };

    if (isSummaryPopupOpen) {
      document.addEventListener("mousedown", handleClickOutside); // ✅ 팝업 바깥 클릭 감지
    } 

    return () => {
      document.removeEventListener("mousedown", handleClickOutside); // ✅ 팝업이 닫히면 이벤트 제거
    };
  }, [isSummaryPopupOpen]);

  // 텍스트 길이에 따라 동적 높이 설정
  const calculateHeight = () => {
    const baseHeight = 80;
    const maxHeight = 450;
    const heightPerLine = 20;

    const lineCount = summaryText.split("\n").length;
    const calculatedHeight = baseHeight + lineCount * heightPerLine;

    return Math.min(calculatedHeight, maxHeight);
  };

  return (
    <div className="tistory-editor">
      {/* 상단 바 */}
      <div className="editor-top-bar">
        <Component18 />
      </div>

      {/* 본문 영역 */}
      <div className="editor-content">
        {/* 제목 + 모드 선택 */}
        <div className="editor-title-category">
          <input
            type="text"
            placeholder="Enter a title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="editor-title-input"
          />
          <select
            value={mode}
            onChange={(e) => setMode(e.target.value)}
            className="editor-mode-select"
          >
            {MODES.map((m) => (
              <option key={m.key} value={m.key}>
                {m.label}
              </option>
            ))}
          </select>
        </div>

        {/* 카테고리 선택 + 태그 입력 */}
        <div className="editor-tag-category">
          <select
            value={category === null ? "" : category}
            onChange={(e) => {
              const selectedValue = e.target.value;
              setCategory(selectedValue === "" ? null : selectedValue);
            }}
            className="editor-category-select"
          >
            {Categories.map((c) => (
              <option key={c.key ?? "default"} value={c.key ?? ""}>
                {c.label}
              </option>
            ))}
          </select>
          <input
            type="text"
            placeholder="#태그를 입력하세요 (예: #JavaScript, #React)"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            className="editor-tag-input"
          />
        </div>


        {/* 에디터 영역 */}
        <div className="editor-area">
          {mode === "basic" ? (
            <ReactQuill
              theme="snow"
              value={basicValue}
              onChange={setBasicValue}
              placeholder="내용을 입력하세요"
              modules={{
                toolbar: [
                  [{ font: ["arial", "times-new-roman", "comic-sans"] }], // 🔥 사용자 지정 폰트 추가
                  [{ header: [1, 2, 3, 4, 5, 6, false] }],
                  ["bold", "italic", "underline", "strike"],
                  [{ list: "ordered" }, { list: "bullet" }],
                  ["link", "image"],
                  [{ align: [] }],
                  [{ color: [] }, { background: [] }],
                ],
              }}
              className="reactquill-editor"
            />
          ) : (
            <MDEditor value={markdownValue} onChange={setMarkdownValue} height={500} />
          )}
        </div>

        {/* 하단 버튼 영역 */}
        <div className="editor-actions">
          <SpellCheckComponent
            property1="default"
            className="spell-check-component"
            onMouseEnter={(e) => e.currentTarget.classList.add("hover")}
            onMouseLeave={(e) => e.currentTarget.classList.remove("hover")}
          />
          <div className="editor-button-group">
            <SaveDraftComponent property1="default" className="save-draft-component" onClick={() => alert("임시 저장되었습니다!")} />
            <PostComponent property1="default" className="post-component" onClick={() => setIsSummaryPopupOpen(true)} />
          </div>
        </div>
      </div>

      {/* 요약된 글 확인 팝업 */}
      {isSummaryPopupOpen && (
        <div className="summary-popup-overlay">
          <div ref={popupRef} className="summary-popup-content">
            <div className="popup-header">
              <div className="popup-title">🫧 AlOG가 주요 내용을 간단하게 정리했어요!</div>
              <CloseIcon onClick={() => setIsSummaryPopupOpen(false)} className="close-icon" />
            </div>
            <textarea
              ref={textAreaRef}
              value={summaryText}
              onChange={(e) => setSummaryText(e.target.value)}
              className="summary-textarea"
              style={{
                height: `${calculateHeight()}px`,
                overflowY: summaryText.split("\n").length > 10 ? "auto" : "hidden",
              }}
            />
            <div className="popup-buttons">
              <PublishComponent
                property1="default"
                className="publish-component"
                onMouseEnter={(e) => e.currentTarget.classList.add("hover")}
                onMouseLeave={(e) => e.currentTarget.classList.remove("hover")}
                onClick={() => alert("게시되었습니다!")}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
