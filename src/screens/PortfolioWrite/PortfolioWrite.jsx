import React, { useState, useRef, useEffect } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "./PortfolioWrite.css";
import Component18 from "../../icons/GoBackIcon/GoBackIcon";
import CloseIcon from "../../icons/CloseIcon/CloseIcon";
import { SaveDraftComponent } from "../../components/SaveDraftComponent/SaveDraftComponent";
import { PostComponent } from "../../components/PostComponent/PostComponent";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../../api/local-instance";

// ReactQuill 모듈 설정
const modules = {
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
      ["clean"]
    ],
    handlers: {
      image: function () {
        const input = document.createElement('input');
        input.setAttribute('type', 'file');
        input.setAttribute('accept', 'image/*');
        input.click();
        input.onchange = async () => {
          const file = input.files[0];
          if (!file) return;
          let titleValue = 'string';
          // title input이 비어있으면 temp로 대체
          if (!document.querySelector('.title-input')?.value.trim()) {
            titleValue = 'temp';
          } else {
            titleValue = document.querySelector('.title-input').value.trim();
          }
          const formData = new FormData();
          formData.append('title', titleValue);
          formData.append('image', file);
          try {
            // axios 사용
            const response = await api.post('http://localhost:8080/api/portfolio/upload-image', formData, {
              headers: { 'Content-Type': 'multipart/form-data' }
            });
            const result = response.data;
            if (result.status === 200 && result.data && result.data.image_url) {
              const quill = this.quill;
              const range = quill.getSelection(true);
              quill.insertEmbed(range.index, 'image', result.data.image_url);
              quill.setSelection(range.index + 1);
            } else {
              alert(result.message || '이미지 업로드 실패');
            }
          } catch (err) {
            alert('이미지 업로드 중 오류 발생');
          }
        };
      }
    }
  },
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
  const [isRepoLoading, setIsRepoLoading] = useState(false); // 진행 바 상태

  const inputRef = useRef(null);
  const popupRef = useRef(null);
  const quillRef = useRef(null); // ReactQuill ref 추가
  const navigate = useNavigate();
  const location = useLocation();
  const editMode = location.state?.editMode || false;
  const portfolioData = location.state?.portfolioData || {};

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

  // 수정 모드일 때 기존 데이터로 초기화
  useEffect(() => {
    if (editMode && portfolioData) {
      setTitle(portfolioData.title || "");
      setBasicValue(portfolioData.content || "");
      setTags(portfolioData.tags || "");
    }
  }, [editMode, portfolioData]);

  const getMissingFields = () => {
    const miss = [];
    if (!title.trim()) miss.push("제목");
    if (!basicValue.trim()) miss.push("내용");
    return miss;
  };

  const handleSaveDraft = async () => {
    const miss = getMissingFields();
    if (miss.length) return alert(`${miss.join(", ")}을(를) 입력해 주세요!`);

    let imageUrl = '';
    try {
      const imgTagMatch = basicValue.match(/<img[^>]*src=["']([^"']+)["'][^>]*>/i);
      if (imgTagMatch && imgTagMatch[1]) {
        imageUrl = imgTagMatch[1];
      } else {
        const mdImgMatch = basicValue.match(/!\[[^\]]*\]\(([^)]+)\)/);
        if (mdImgMatch && mdImgMatch[1]) {
          imageUrl = mdImgMatch[1];
        }
      }
    } catch (e) {
      imageUrl = '';
    }

    try {
      const params = {
        title: title,
        content: basicValue,
        is_public: "false",
        isTemp: "false",
        image: imageUrl
      };
      const response = await api.post('http://localhost:8080/api/portfolio/save', null, { params, headers: { 'accept': 'application/json' } });
      const result = response.data;
      if (result.status === 200) {
        alert("임시 저장되었습니다!");
        navigate("/portfolio");
      } else {
        alert(result.message || "임시 저장 실패");
      }
    } catch (err) {
      alert("요청 중 오류가 발생했습니다.");
    }
  };

  const handlePost = async () => {
    const miss = getMissingFields();
    if (miss.length) return alert(`${miss.join(", ")}을(를) 입력해 주세요!`);

    let imageUrl = '';
    try {
      const imgTagMatch = basicValue.match(/<img[^>]*src=["']([^"']+)["'][^>]*>/i);
      if (imgTagMatch && imgTagMatch[1]) {
        imageUrl = imgTagMatch[1];
      } else {
        const mdImgMatch = basicValue.match(/!\[[^\]]*\]\(([^)]+)\)/);
        if (mdImgMatch && mdImgMatch[1]) {
          imageUrl = mdImgMatch[1];
        }
      }
    } catch (e) {
      imageUrl = '';
    }

    try {
      if (editMode && portfolioData.id) {
        // 수정(UPDATE) 모드: PUT 요청
        const params = {
          portfolioID: portfolioData.id,
          title: title,
          content: basicValue,
          isPublic: "true",
          isTemp: "true"
        };
        const response = await api.put('http://localhost:8080/api/portfolio/update', null, { params, headers: { 'accept': 'application/json' } });
        const result = response.data;
        if (result.status === 200) {
          alert("수정되었습니다!");
          navigate("/portfolio");
        } else {
          alert(result.message || "수정 실패");
        }
      } else {
        // 신규 작성(POST) 모드: 기존 로직
        const params = {
          title: title,
          content: basicValue,
          is_public: "true",
          isTemp: "true",
          image: imageUrl
        };
        const response = await api.post('http://localhost:8080/api/portfolio/save', null, { params, headers: { 'accept': 'application/json' } });
        const result = response.data;
        if (result.status === 200) {
          alert("게시되었습니다!");
          navigate("/portfolio");
        } else {
          alert(result.message || "게시 실패");
        }
      }
    } catch (err) {
      alert("요청 중 오류가 발생했습니다.");
    }
  };

  const handleAIHelper = () => {
    setIsRepoPopupOpen(true);
  };

  const handleCloseRepoPopup = () => {
    setFadeOut(true);
    setTimeout(() => {
      setIsRepoPopupOpen(false);
      setRepoUrl("");
    }, 300);
  };

  const handleCreateFromRepo = async () => {
    if (!repoUrl.trim()) {
      alert("레포지토리 주소를 입력해 주세요!");
      return;
    }
    setIsRepoLoading(true);
    const start = Date.now();
    let result = null;
    let error = null;
    try {
      const url = `http://localhost:8080/api/portfolio/make`;
      const response = await api.get(url, { params: { gitURL: repoUrl.trim() }, headers: { 'accept': 'application/json' } });
      result = response.data;
    } catch (err) {
      error = err;
    }
    // 7초가 될 때까지 대기
    const elapsed = Date.now() - start;
    const minDuration = 7000;
    if (elapsed < minDuration) {
      await new Promise(res => setTimeout(res, minDuration - elapsed));
    }
    if (error) {
      alert('레포지토리 분석 중 오류가 발생했습니다.');
    } else if (result && result.status === 200 && result.data) {
      const { text, image } = result.data;
      if (quillRef.current) {
        const editor = quillRef.current.getEditor();
        const cursorPosition = editor.getLength();
        if (image) {
          editor.insertEmbed(cursorPosition, 'image', image);
        }
        if (text) {
          editor.insertText(editor.getLength(), `\n${text}\n`);
        }
      }
    } else {
      alert((result && result.message) || '레포지토리 분석에 실패했습니다.');
    }
    setIsRepoLoading(false); // 진행 바 종료
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
            ref={quillRef} // ref 연결
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
            {isRepoLoading ? (
              <div className="repo-progress-bar-container">
                <div className="repo-progress-bar">
                  <div className="repo-progress-bar-inner" />
                </div>
                <div className="repo-progress-text">레포지토리 분석 중...</div>
              </div>
            ) : (
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
            )}
          </div>
        </div>
      )}
    </div>
  );
}