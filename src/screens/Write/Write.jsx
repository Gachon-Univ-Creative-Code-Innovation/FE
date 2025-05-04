import React, { useState } from "react";
import MDEditor from "@uiw/react-md-editor";
import ReactQuill from "react-quill";
import Component18 from "../../icons/GoBackIcon/GoBackIcon";
import "react-quill/dist/quill.snow.css";
import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";
import "./Write.css";

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

  return (
    <div className="tistory-editor">
      {/* 상단 바 */}
      <div className="editor-top-bar">
        <div>
          <Component18 />
        </div>
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
                  [{ font: [] }, { header: [1, 2, 3, 4, 5, 6, false] }],
                  ["bold", "italic", "underline", "strike"],
                  [{ color: [] }, { background: [] }],
                  [{ list: "ordered" }, { list: "bullet" }],
                  ["link", "image"],
                  ["clean"],
                ],
              }}
              className="reactquill-editor"
            />
          ) : (
            <MDEditor
              value={markdownValue}
              onChange={setMarkdownValue}
              height={500}
            />
          )}
        </div>

        {/* 하단 버튼 영역 */}
        <div className="editor-actions">
          <button className="editor-button spell-check">
            맞춤법 검사 →
          </button>
          <div className="editor-button-group">
            <button className="editor-button">임시 저장</button>
            <button className="editor-button">게시</button>
          </div>
        </div>
      </div>
    </div>
  );
}
