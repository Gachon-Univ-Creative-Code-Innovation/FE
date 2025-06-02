import React, { useState, useRef, useEffect, useMemo } from "react";
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
import api from "../../api/local-instance";

const Categories = [
  { key: null, label: "카테고리 선택" },
  { key: 1, label: "개발" },
  { key: 2, label: "클라우드 & 인프라" },
  { key: 3, label: "AI" },
  { key: 4, label: "데이터베이스" },
  { key: 5, label: "CS 지식" },
  { key: 6, label: "프로젝트" },
  { key: 7, label: "문제해결(트러블 슈팅)" },
  { key: 8, label: "성장 기록" },
  { key: 9, label: "IT 뉴스" },
  { key: 10, label: "기타" },
];

export default function Write() {
  // 상태 정의
  const [mode, setMode] = useState("basic");
  const [basicValue, setBasicValue] = useState("");
  const [markdownValue, setMarkdownValue] = useState("");
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState(null);
  const [tags, setTags] = useState("");
  const [isSummaryPopupOpen, setIsSummaryPopupOpen] = useState(false);
  const [summaryText, setSummaryText] = useState(
    "자동으로 요약한 내용을 불러오고, 수정도 가능하도록 했어용가리"
  );
  const [loadingSummary, setLoadingSummary] = useState(false);
  const [showGithubUrlInput, setShowGithubUrlInput] = useState(false);
  const [githubUrl, setGithubUrl] = useState("");
  const [url, setUrl] = useState("");
  const [fadeOut, setFadeOut] = useState(false);

  const tagInputRef = useRef(null);
  const reactQuillRef = useRef(null);
  const fileInputRef = useRef(null);
  const textAreaRef = useRef(null);
  const popupRef = useRef(null);

  // =============================================================================
  // 1) Quill 이미지 업로드 핸들러 함수들 (modules 선언보다 위에 위치)
  // =============================================================================
  // **이미지 data URL ↔ 원본 파일명 매핑을 보관할 Map**
  const imageNameMap = useRef({});

  // (a) 툴바의 “이미지” 버튼을 클릭하면, 숨겨둔 file input 열기
  const handleImageInsert = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // (b) 파일이 선택되면 FileReader로 data URL을 생성 → Quill에 삽입
  const onQuillImageSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result;
      imageNameMap.current[dataUrl] = file;

      const quill = reactQuillRef.current.getEditor();
      // 현재 커서 위치(없으면 맨 뒤) 구하기
      const range = quill.getSelection();
      const index = range ? range.index : quill.getLength();
      // data URL로 이미지 삽입
      quill.insertEmbed(index, "image", dataUrl);
      quill.setSelection(index + 1, 0);
    };
    reader.readAsDataURL(file);

    // 선택 후 input 초기화
    e.target.value = "";
  };

  // =============================================================================
  // 2) useMemo로 한 번만 modules/ formats 객체 생성
  // =============================================================================

  const modules = useMemo(() => {
    return {
      toolbar: {
        container: [
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
          ["clean"],
        ],
        handlers: {
          image: handleImageInsert,
        },
      },
      keyboard: {
        bindings: {
          "shift enter": {
            key: "Enter",
            shiftKey: true,
            handler(range) {
              const currentFormat = this.quill.getFormat(range.index, 1);
              this.quill.insertText(range.index, "\n", currentFormat);
              this.quill.setSelection(range.index + 1, 0);
              return false;
            },
          },
        },
      },
      clipboard: {
        matchVisual: false,
      },
    };
  }, []); // [] 빈 배열, 최초 1회만 생성

  const formats = useMemo(() => {
    return [
      "header",
      "font",
      "bold",
      "italic",
      "underline",
      "strike",
      "blockquote",
      "code-block",
      "color",
      "background",
      "script",
      "list",
      "bullet",
      "indent",
      "align",
      "link",
      "image",
      "video",
    ];
  }, []); // [] 빈 배열, 최초 1회만 생성



  // =============================================================================
  // 3) 그 외 쓰던 로직: 요약 팝업, 게시하기 등
  // =============================================================================

  useEffect(() => {
    if (isSummaryPopupOpen && !loadingSummary && textAreaRef.current) {
      textAreaRef.current.focus();
      textAreaRef.current.setSelectionRange(
        summaryText.length,
        summaryText.length
      );
    }
    function handleClickOutside(e) {
      if (popupRef.current && !popupRef.current.contains(e.target)) {
        setIsSummaryPopupOpen(false);
      }
    }
    if (isSummaryPopupOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isSummaryPopupOpen, loadingSummary, summaryText]);

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

  const fetchSummary = async (content) => {
    const res = await fetch(
      "http://localhost:8500/api/summarize-service/summarize",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ post_id: 0, context: content }),
      }
    );
    const json = await res.json();
    if (json.status !== 200) {
      throw new Error(json.message);
    }
    return json.data;
  };

  const handleSaveDraft = () => {
    const miss = getMissingFields();
    if (miss.length) return alert(`${miss.join(", ")}을(를) 입력해 주세요!`);
    alert("임시 저장되었습니다!");
  };

  const handlePost = async () => {
    const miss = getMissingFields();
    if (miss.length) return alert(`${miss.join(", ")}을(를) 입력해 주세요!`);

    const content = mode === "basic" ? basicValue : markdownValue;

    setSummaryText("수동으로 요약하거나, 게시를 다시 시도해주세요!");
    setIsSummaryPopupOpen(true);
    setLoadingSummary(true);

    try {
      const summary = await fetchSummary(content);
      setSummaryText(summary);
    } catch (err) {
      alert("요약 생성에 실패했습니다. 요약을 수동 입력해주세요!");
    } finally {
      setLoadingSummary(false);
    }
  };

  const handlePublish = async () => {
    const miss = getMissingFields();
    if (miss.length) return alert(`${miss.join(", ")}을(를) 입력해 주세요!`);

    const content = mode === "basic" ? basicValue : markdownValue;
    
    // 3) HTML 안에서 data URL 이미지 태그(<img src="data:…">)를 찾고, 각각 S3 업로드
    //    1. DOMParser로 HTML 문자열을 파싱
    //    2. <img> 태그들 중 src가 "data:…"로 시작하는 것만 골라서 순회
    //    3. 각 data URL을 Blob으로 변환 → presigned URL 요청 → S3 PUT 업로드 → S3 URL 획득
    //    4. 찾아둔 <img> 태그의 src 속성을 해당 S3 URL로 치환
    const parser = new DOMParser();
    const doc = parser.parseFromString(content, "text/html");
    const imgElements = Array.from(doc.querySelectorAll("img"));

    // 4) 각 <img src="data:...">에 대해서 S3 업로드 후 src 교체
    for (const imgEl of imgElements) {
      const src = imgEl.getAttribute("src") || "";
      if (src.startsWith("data:")) {
        // (b) 원본 파일명: imageNameMap에서 꺼내오기
        const originalFile = imageNameMap.current[src];
        console.log("원본 파일명:", originalFile.name);
        console.log("원본 파일 타입:", originalFile);

        try {
          // (c) presigned URL 요청 (백엔드)
          const token = localStorage.getItem("jwtToken");
          const presignedRes = await api.post(
            `/blog-service/s3/upload-url?fileName=${encodeURIComponent(originalFile.name)}`,
            null,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          const { presignedUrl, s3ObjectUrl } = presignedRes.data.data;
          console.log("presignedUrl:", presignedUrl);
          console.log("s3ObjectUrl:", s3ObjectUrl);

          // (d) S3에 실제 PUT 업로드
          await fetch(presignedUrl, {
            method: "PUT",
            body: originalFile,
            headers: { "Content-Type": originalFile.type },
          });

          // (e) 에디터 내 HTML에서 src를 S3 URL로 교체
          imgEl.setAttribute("src", s3ObjectUrl);
        } catch (uploadErr) {
          console.error("이미지 업로드 중 오류:", uploadErr);
          alert("이미지 업로드에 실패했습니다.");
        }
      }
    }

    //치환된 HTML 문자열을 다시 얻기
    const updatedHtml = doc.body.innerHTML;
    console.log("업데이트된 HTML:", updatedHtml);

    const tagNameList = tags
      .split(",")
      .map((tag) => tag.trim().replace(/^#/, ""))
      .filter((tag) => tag.length > 0);

    const payload = {
      parentPostId: null,
      draftPostId: null,
      title: title.trim(),
      content: updatedHtml,
      summary: summaryText.trim(),
      tagNameList,
      categoryCode: category ? Number(category) : null,
      postType: "POST",
    };

    console.log("게시글 데이터:", payload);

    try {
      const token = localStorage.getItem("jwtToken");
      const response = await api.post("/blog-service/posts", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const msg =
        response.data?.message ||
        `${response.data?.data || ""} 글이 생성되었습니다.`;
      alert(msg);

      // 입력값 초기화
      setTitle("");
      setCategory(null);
      setBasicValue("");
      setMarkdownValue("");
      setTags("");
      setMode("basic");
    } catch (err) {
      console.error(err);
      if (err.response?.data?.message) {
        alert(err.response.data.message);
      } else {
        alert("게시글 생성 중 오류가 발생했습니다.");
      }
    }
  };

  const handleCloseSummaryPopup = () => {
    setFadeOut(true);
    setTimeout(() => {
      setIsSummaryPopupOpen(false);
    }, 300);
  };

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
          body: JSON.stringify({ git_url: gitUrl }),
        });
        const result = await response.json();
        const tagArr = Array.isArray(result.data) ? result.data : [];
        if (tagArr.length > 0) {
          const tagString = tagArr.map((tag) => `#${tag}`).join(", ");
          setTags((prev) => (prev ? prev + ", " + tagString : tagString));
        }
      } catch (err) {
        alert("깃허브 태그 추출에 실패했습니다.");
      }
    }
  };

  // =============================================================================
  // 4) 최종 JSX 렌더링
  // =============================================================================
  return (
    <div className="write-editor">
      <div className="editor-top-bar">
        <Component18 />
      </div>

      <div className="editor-content">
        {/* 제목 입력 & 모드 선택 */}
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
            <option value="basic">기본모드</option>
            <option value="markdown">Markdown</option>
          </select>
        </div>

        {/* 카테고리 선택 & 태그 입력 */}
        <div className="editor-tag-category">
          <select
            value={category ?? ""}
            onChange={(e) => {
              console.log("선택된 카테고리 key:", e.target.value);
              setCategory(e.target.value || null);}}
            className="editor-category-select"
          >
            {Categories.map((c) => (
              <option key={c.key ?? "default"} value={c.key ?? ""}>
                {c.label}
              </option>
            ))}
          </select>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              width: "100%",
              gap: "8px",
            }}
          >
            {showGithubUrlInput ? (
              <input
                type="text"
                placeholder="깃허브 저장소 URL을 입력하세요"
                value={githubUrl}
                onChange={(e) => setGithubUrl(e

              )}
                onKeyDown={handleGithubUrlKeyDown}
                className="editor-github-url-input editor-github-url-input-animated"
              />
            ) : (
              <input
                type="text"
                placeholder="#태그를 입력하세요 (예: #JavaScript, #React)"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                className="editor-tag-input"
                ref={tagInputRef}
              />
            )}
            <button
              type="button"
              className="editor-github-tag-btn"
              onClick={() => setShowGithubUrlInput((v) => !v)}
            >
              {showGithubUrlInput ? "돌아가기" : "깃허브에서 태그 추출"}
            </button>
          </div>
        </div>

        {/* 에디터 영역 (Quill 또는 Markdown) */}
        <div className="editor-area">
          {mode === "basic" ? (
            <>
              <ReactQuill
                ref={reactQuillRef}
                value={basicValue}
                onChange={setBasicValue}
                theme="snow"
                modules={modules}
                formats={formats}
                placeholder="내용을 입력하세요..."
              />
              {/* 숨겨진 파일 입력창 (이미지 선택 시 onQuillImageSelect 실행) */}
              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                style={{ display: "none" }}
                onChange={onQuillImageSelect}
              />
            </>
          ) : (
            <MDEditor
              value={markdownValue}
              onChange={setMarkdownValue}
              height={500}
            />
          )}
        </div>

        {/* 버튼 그룹 (맞춤형 컴포넌트) */}
        <div className="editor-actions">
          {/* SpellCheckComponent가 className 프로퍼티를 함수로 받도록 수정해야 경고가 사라집니다. */}
          <SpellCheckComponent className={() => "spell-check-container"} />
          <div className="editor-button-group">
            <SaveDraftComponent onClick={handleSaveDraft} />
            <PostComponent onClick={handlePost} />
          </div>
        </div>
      </div>

      {/* 요약 팝업 */}
      {isSummaryPopupOpen && (
        <div
          className={`summary-popup-overlay${fadeOut ? " fade-out" : ""}`}
        >
          <div ref={popupRef} className="summary-popup-content">
            <div className="popup-header">
              <div className="popup-title">
                🫧 AlOG가 글을 요약했어요! 🫧
              </div>
              <CloseIcon
                onClick={handleCloseSummaryPopup}
                className="close-icon"
              />
            </div>
            {loadingSummary ? (
              <div style={{ padding: "40px 0", textAlign: "center" }}>
                <p style={{ fontSize: "1.1rem" }}>
                  요약 중… 잠시만 기다려 주세요
                </p>
              </div>
            ) : (
              <textarea
                ref={textAreaRef}
                value={summaryText}
                onChange={(e) => setSummaryText(e.target.value)}
                className="summary-textarea"
                style={{
                  height:
                    Math.min(80 + summaryText.split("\n").length * 20, 450) +
                    "px",
                  overflowY:
                    summaryText.split("\n").length > 10 ? "auto" : "hidden",
                }}
              />
            )}
            {!loadingSummary && (
              <div className="popup-buttons">
                <PublishComponent onClick={handlePublish} />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}