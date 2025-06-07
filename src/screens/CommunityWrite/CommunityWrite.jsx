import React, { useState, useEffect, useMemo, useRef } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "./CommunityWrite.css";
import Component18 from "../../icons/GoBackIcon/GoBackIcon";

import { PostComponent } from "../../components/PostComponent/PostComponent";
import { useNavigate, useParams } from "react-router-dom";
import { MatchingCategories } from "../../constants/categories";
import api from "../../api/instance";
import PostSuccessPopup from "../../components/PostSuccessPopup/PostSuccessPopup";
import { AnimatePresence } from "framer-motion";


export default function CommunityWrite() {
  const { postId } = useParams();    // URL에 :postId가 없으면 undefined
  const navigate = useNavigate();
  
  // // 수정 모드 여부와 기존 데이터 확인
  // const isEditMode = location.state?.editMode || false;
  // const postData = location.state?.postData || null;
  const [isEditMode, setisEditMode] = useState(false);


  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState(null);
  const [tags, setTags] = useState("");
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [newPostData, setNewPostData] = useState(null);

  //이미지
  const reactQuillRef = useRef(null);
  const fileInputRef = useRef(null);
  



  // 컴포넌트가 마운트될 때 기존 데이터로 초기화
  useEffect(() => {
    if(postId){
      setisEditMode(true);
      const fetchPostForEdit = async () => {
        try {
          const token = localStorage.getItem("jwtToken");
          const res = await api.get(`/blog-service/posts/${postId}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          const data = res.data.data;

          // 가져온 post 데이터를 폼 필드에 채우기
          setTitle(data.title);
          setCategory(data.categoryCode);
          setTags(
            data.tagNameList
              .map((tag) => `#${tag}`)
              .join(" ")                
          );
          setContent(data.content);


        } catch (err) {
          console.error("수정할 게시글 로딩 실패:", err.data);
          alert("게시글을 불러오는 중 오류가 발생했습니다.");
          navigate(-1); // 뒤로 가기
        }
      };
      fetchPostForEdit();
    }
    
},[]);

  const getMissingFields = () => {
    const miss = [];
    if (!title.trim()) miss.push("제목");
    if (!category) miss.push("카테고리");
    if (!content.trim()) miss.push("내용");
    return miss;
  };

  const handlePost = async () => {
    const miss = getMissingFields();
    if (miss.length) return alert(`${miss.join(", ")}을(를) 입력해 주세요!`);
    
    
    const parser = new DOMParser();
    const doc = parser.parseFromString(content, "text/html");
    const imgElements = Array.from(doc.querySelectorAll("img"));

    for (const imgEl of imgElements) {
      const src = imgEl.getAttribute("src") || "";
      if (src.startsWith("data:")) {
        const originalFile = imageNameMap.current[src];
        try {
          const token = localStorage.getItem("jwtToken");
          const presignedRes = await api.post(
            `/blog-service/s3/upload-url?fileName=${encodeURIComponent(originalFile.name)}`,
            null,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          const { presignedUrl, s3ObjectUrl } = presignedRes.data.data;

          await fetch(presignedUrl, {
            method: "PUT",
            body: originalFile,
            headers: { "Content-Type": originalFile.type },
          });

          imgEl.setAttribute("src", s3ObjectUrl);
        } catch (uploadErr) {
          console.error("이미지 업로드 실패:", uploadErr);
          alert("이미지 업로드 실패");
          return;
        }
      } else if (src.startsWith("https")) {
        const afterSlash = src.split("/post/")[1] || "";
        const encodedFileName = afterSlash.split("?")[0];
        const decodedFileName = decodeURIComponent(encodedFileName);
        imgEl.setAttribute("src", `post/${decodedFileName}`);
      }
    }

    const updatedHtml = doc.body.innerHTML;
    const tagNameList = tags
      .split(" ")
      .map((tag) => tag.trim().replace(/^#/, ""))
      .filter((tag) => tag.length > 0);

    console.log("tags", tags)
    console.log("tagNameList", tagNameList)

    const payload = {
      parentPostId: null,
      draftPostId: null,
      title: title.trim(),
      content: updatedHtml,
      summary: null,
      tagNameList: tagNameList,
      categoryCode: category ? Number(category) : null,
      postType: "MATCHING",
    };
    console.log("payload, ", payload);
    

    const token = localStorage.getItem("jwtToken");
    let response;
    if (isEditMode) {
      // 수정 모드인 경우
      try {
        response = await api.patch(`/blog-service/posts/${postId}`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
        
        // 임시 저장된 초안 삭제
        localStorage.removeItem('communityDraft');
        
        // 팝업 데이터 설정 후 팝업 표시
        const updatedPostData = { id: postId };
        setNewPostData(updatedPostData);
        setShowSuccessPopup(true);
      } catch (error) {
        console.error("글 수정 실패:", error);
        console.error(error.response?.data);
        alert("글 수정에 실패했습니다. 다시 시도해주세요.");
      }
    } else {

      try {
        response = await api.post(`/blog-service/posts`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
        
        const msg = response.data?.data; // 예: "503 글이 정상적으로 생성되었습니다."
        const newPostId = msg?.split(" ")[0];
        
        // 임시 저장된 초안 삭제
        localStorage.removeItem('communityDraft');
        
        // 팝업 데이터 설정 후 팝업 표시
        const newPostData = { id: newPostId };
        setNewPostData(newPostData);
        setShowSuccessPopup(true);
      } catch (error) {
        console.error("글 작성 실패:", error);
        console.error(error.response?.data);

        console.error(error.response?.data?.message);
        alert("글 작성에 실패했습니다. 다시 시도해주세요.");
      }
    }
  };

  const handlePopupConfirm = () => {
    setShowSuccessPopup(false);
    
    if (isEditMode) {
      // 수정된 데이터를 ViewPost에 전달하면서 이동
      navigate(`/community/viewpost/${postId}`);
    } else {
      // 새로 작성된 글로 이동
      navigate(`/community/viewpost/${newPostData?.id}`);
    }
  };

  // =============================================================================
  // 1) Quill 이미지 업로드 핸들러 함수들 (modules 선언보다 위에 위치)
  // =============================================================================
  // **이미지 data URL ↔ 원본 파일명 매핑을 보관할 Map**
  const imageNameMap = useRef({});

  // (a) 툴바의 "이미지" 버튼을 클릭하면, 숨겨둔 file input 열기
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


  // ReactQuill 모듈 설정
  const modules = useMemo(() => {
    return {
      toolbar: {
        container : [
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
            }
          }
        }
      },
      clipboard: {
        matchVisual: false
      }};
  }, []);

  const formats = useMemo(() =>{
    return [
    "header", "font",
    "bold", "italic", "underline", "strike",
    "blockquote", "code-block",
    "color", "background",
    "script", "list", "bullet", "indent",
    "align",
    "link", "image", "video"
  ]}, []);

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
        alert("임시 저장된 초안을 불러왔습니다.");
      }
    }
  };

  useEffect(() => {
    loadDraft();
  }, []);


  return (
    <div className="community-write">
      
      <div className="header">
        <Component18 className="goback-icon" onClick={() => navigate(-1)} />
        <h1>{isEditMode ? "글 수정" : "글쓰기"}</h1>
      </div>

      <div className="form-section">
        <div className="form-row">
          <label className="label">제목</label>
          <input
            type="text"
            className="title-input"
            placeholder="제목을 입력하세요"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div className="form-row">
          <label className="label">카테고리</label>
          <select
            className="category-select"
            value={category || ""}
            onChange={(e) => setCategory(e.target.value ? Number(e.target.value) : null)}
          >
            <option value="">카테고리를 선택하세요</option>
            {MatchingCategories.map((cat) => (
              <option key={cat.categoryCode} value={cat.categoryCode}>
                {cat.categoryName}
              </option>
            ))}
          </select>
        </div>

        <div className="form-row">
          <label className="label">태그</label>
          <input
            type="text"
            className="tags-input"
            placeholder="#태그1 #태그2 #태그3"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
          />
        </div>
      </div>

      <div className="editor-section">
        <label className="label">내용</label>
        <div className="quill-container">
          <ReactQuill
            theme="snow"
            value={content}
            onChange={setContent}
            ref={reactQuillRef}
            modules={modules}
            formats={formats}
            placeholder="내용을 입력하세요..."
          />
        </div>
      </div>

      {/* 숨겨진 파일 input (이미지 업로드용) */}
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        style={{ display: "none" }}
        onChange={onQuillImageSelect}
      />

      <div className="button-section">
        <PostComponent 
          text={isEditMode ? "수정" : "게시"}
          onClick={handlePost}
        />
      </div>

      <AnimatePresence>
        {showSuccessPopup && newPostData && (
          <PostSuccessPopup
            title={isEditMode ? "글 수정 완료!" : "게시 완료!"}
            message={
              isEditMode 
                ? "글이 성공적으로 수정되었습니다."
                : "글이 성공적으로 게시되었습니다."
            }
            confirmText="확인"
            onConfirm={handlePopupConfirm}
          />
        )}
      </AnimatePresence>
    </div>
  );
}