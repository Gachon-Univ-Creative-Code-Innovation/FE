import React, { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "./CommunityWrite.css";
import Component18 from "../../icons/GoBackIcon/GoBackIcon";
import { SaveDraftComponent } from "../../components/SaveDraftComponent/SaveDraftComponent";
import { PostComponent } from "../../components/PostComponent/PostComponent";

const CommunityCategories = [
  { key: null, label: "카테고리 선택" },
  { key: "전체", label: "전체" },
  { key: "프로젝트", label: "프로젝트" },
  { key: "공모전", label: "공모전" },
  { key: "스터디", label: "스터디" },
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

export default function CommunityWrite() {
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState(null);

  const getMissingFields = () => {
    const miss = [];
    if (!title.trim()) miss.push("제목");
    if (!category) miss.push("카테고리");
    if (!content.trim()) miss.push("내용");
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

  return (
    <div className="community-write-editor">
      <div className="community-editor-top-bar">
        <Component18 />
      </div>

      <div className="community-editor-content">
        <div className="community-editor-title-category">
          <select
            value={category ?? ""}
            onChange={e => setCategory(e.target.value || null)}
            className="community-editor-category-select"
          >
            {CommunityCategories.map(c => (
              <option key={c.key ?? "default"} value={c.key ?? ""}>
                {c.label}
              </option>
            ))}
          </select>
          <input
            type="text"
            placeholder="Enter a title"
            value={title}
            onChange={e => setTitle(e.target.value)}
            className="community-editor-title-input"
          />
        </div>

        <div className="community-editor-area">
          <ReactQuill
            value={content}
            onChange={setContent}
            theme="snow"
            modules={modules}
            formats={formats}
            placeholder="내용을 입력하세요..."
          />
        </div>

        <div className="community-editor-actions">
          <div className="community-editor-button-group">
            <SaveDraftComponent onClick={handleSaveDraft} />
            <PostComponent onClick={handlePost} />
          </div>
        </div>
      </div>
    </div>
  );
}
