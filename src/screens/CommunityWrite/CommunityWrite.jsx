import React, { useState, useEffect } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "./CommunityWrite.css";
import Component18 from "../../icons/GoBackIcon/GoBackIcon";
import { SaveDraftComponent } from "../../components/SaveDraftComponent/SaveDraftComponent";
import { PostComponent } from "../../components/PostComponent/PostComponent";
import { useLocation, useNavigate } from "react-router-dom";
import PostSuccessPopup from "../../components/PostSuccessPopup/PostSuccessPopup";
import { AnimatePresence } from "framer-motion";

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
  const location = useLocation();
  const navigate = useNavigate();
  
  // 수정 모드 여부와 기존 데이터 확인
  const isEditMode = location.state?.editMode || false;
  const postData = location.state?.postData || null;

  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState(null);
  const [tags, setTags] = useState("");
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [newPostData, setNewPostData] = useState(null);

  // 컴포넌트가 마운트될 때 기존 데이터로 초기화
  useEffect(() => {
    if (isEditMode && postData) {
      setTitle(postData.title || "");
      setCategory(postData.category || null);
      setContent(postData.content || "");
      setTags(postData.tags || "");
    }
  }, [isEditMode, postData]);

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
    
    // 임시 저장 로직 (localStorage 또는 서버 API 호출)
    const draftData = {
      title,
      category,
      content,
      tags,
      savedAt: new Date().toISOString(),
      isEditMode,
      originalId: postData?.id
    };
    
    // localStorage에 임시 저장 (실제로는 서버 API 사용 권장)
    localStorage.setItem('communityDraft', JSON.stringify(draftData));
    
    if (isEditMode) {
      alert("수정 내용이 임시 저장되었습니다!");
    } else {
      alert("임시 저장되었습니다!");
    }
  };

  const handlePost = async () => {
    const miss = getMissingFields();
    if (miss.length) return alert(`${miss.join(", ")}을(를) 입력해 주세요!`);
    
    if (isEditMode) {
      // 수정 모드인 경우
      const updatedPostData = {
        id: postData?.id,
        title,
        category,
        content,
        tags,
        updatedAt: new Date().toISOString()
      };
      
      try {
        // 실제 서비스에서는 여기서 API 호출
        // await updatePost(updatedPostData);
        
        console.log("글 수정 완료:", updatedPostData);
        
        // 임시 저장된 초안 삭제
        localStorage.removeItem('communityDraft');
        
        // 팝업 데이터 설정 후 팝업 표시
        setNewPostData(updatedPostData);
        setShowSuccessPopup(true);
      } catch (error) {
        console.error("글 수정 실패:", error);
        alert("글 수정에 실패했습니다. 다시 시도해주세요.");
      }
    } else {
      // 새 글 작성인 경우
      const newPostData = {
        id: Date.now(), // 실제로는 서버에서 생성된 ID 사용
        title,
        category,
        content,
        tags,
        author: "배고픈 송희", // 실제로는 로그인한 사용자 정보
        createdAt: new Date().toISOString()
      };
      
      try {
        // 실제 서비스에서는 여기서 API 호출
        // const response = await createPost(newPostData);
        
        console.log("새 글 작성 완료:", newPostData);
        
        // 임시 저장된 초안 삭제
        localStorage.removeItem('communityDraft');
        
        // 팝업 데이터 설정 후 팝업 표시
        setNewPostData(newPostData);
        setShowSuccessPopup(true);
      } catch (error) {
        console.error("글 작성 실패:", error);
        alert("글 작성에 실패했습니다. 다시 시도해주세요.");
      }
    }
  };

  const handlePopupConfirm = () => {
    setShowSuccessPopup(false);
    
    if (isEditMode) {
      // 수정된 데이터를 ViewPost에 전달하면서 이동
      navigate(`/community/viewpost/id:${postData?.id || 1}`, {
        state: {
          updatedPost: newPostData,
          isUpdated: true // 업데이트 플래그 추가
        }
      });
    } else {
      // 새로 작성된 글로 이동
      navigate(`/community/viewpost`, {
        state: {
          newPost: newPostData,
          isNew: true
        }
      });
    }
  };

  // 임시 저장된 초안 불러오기
  const loadDraft = () => {
    const savedDraft = localStorage.getItem('communityDraft');
    if (savedDraft && !isEditMode) { // 새 글 작성 시에만 초안 불러오기 제안
      const draftData = JSON.parse(savedDraft);
      if (window.confirm("임시 저장된 초안이 있습니다. 불러오시겠습니까?")) {
        setTitle(draftData.title || "");
        setCategory(draftData.category || null);
        setContent(draftData.content || "");
        setTags(draftData.tags || "");
      }
    }
  };

  // 컴포넌트 마운트 시 초안 확인
  useEffect(() => {
    loadDraft();
  }, []);

  return (
    <div className="community-write-editor">
      <div className="community-editor-top-bar">
        <Component18 />
        {/* 수정 모드임을 표시 */}
        {isEditMode && (
          <div style={{ 
            marginLeft: '20px', 
            color: '#667eea', 
            fontWeight: '600',
            fontSize: '1.1rem'
          }}>
            글 수정하기
          </div>
        )}
      </div>

      <div className="community-editor-content">
        <div className="community-editor-title-row">
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
          <input
            type="text"
            placeholder="#태그를 입력하세요 (#JavaScript #React ...)"
            value={tags}
            onChange={e => setTags(e.target.value)}
            className="community-editor-tags-input"
          />
          <div className="community-editor-button-group">
            <SaveDraftComponent onClick={handleSaveDraft} />
            <PostComponent 
              onClick={handlePost}
              text={isEditMode ? "수정하기" : "게시하기"} // 버튼 텍스트 동적 변경
            />
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showSuccessPopup && (
          <PostSuccessPopup
            message={isEditMode ? "글이 수정되었습니다!" : "게시되었습니다!"}
            onConfirm={handlePopupConfirm}
          />
        )}
      </AnimatePresence>
    </div>
  );
}