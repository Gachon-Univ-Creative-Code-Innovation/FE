import React, { useState, useEffect, useMemo, useRef } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "./CommunityWrite.css";
import Component18 from "../../icons/GoBackIcon/GoBackIcon";
import { SaveDraftComponent } from "../../components/SaveDraftComponent/SaveDraftComponent";
import { PostComponent } from "../../components/PostComponent/PostComponent";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { MatchingCategories } from "../../constants/categories";
import api from "../../api/local-instance"


export default function CommunityWrite() {
  const location = useLocation();
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
              // .map((tag) => `#${tag}`)
              // .join(" ")                
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
      // isEditMode,
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
      .split(",")
      .map((tag) => tag.trim().replace(/^#/, ""))
      .filter((tag) => tag.length > 0);

    const payload = {
      parentPostId: null,
      draftPostId: null,
      title: title.trim(),
      content: updatedHtml,
      summary: null,
      tagNameList: tags,
      categoryCode: category ? Number(category) : null,
      postType: "MATCHING",
    };
    console.log("payload, ", payload);
    

    const token = localStorage.getItem("jwtToken");
    let response;
    if (isEditMode) {
      // 수정 모드인 경우
      // const updatedPostData = {
      //   id: postData?.id,
      //   title,
      //   category,
      //   content,
      //   tags,
      //   updatedAt: new Date().toISOString()
      // };
      
      try {
        // 실제 서비스에서는 여기서 API 호출
        // await updatePost(updatedPostData);

        response = await api.patch(`/blog-service/posts/${postId}`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
        
        console.log("글 수정 완료:", updatedPostData);
        alert("글이 수정되었습니다!");
        
        // 임시 저장된 초안 삭제
        localStorage.removeItem('communityDraft');
        
        // 수정된 데이터를 ViewPost에 전달하면서 이동
        // 동적 라우팅을 위해 postId 사용
        navigate(`/community/viewpost/id:${postData?.id || 1}`, {
          state: {
            updatedPost: updatedPostData,
            isUpdated: true // 업데이트 플래그 추가
          }
        });
      } catch (error) {
        console.error("글 수정 실패:", error);
        alert("글 수정에 실패했습니다. 다시 시도해주세요.");
      }
    } else {

      try {
        response = await api.post(`/blog-service/posts`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
        
        const msg = response.data?.data; // 예: "503 글이 정상적으로 생성되었습니다."
        const newPostId = msg?.split(" ")[0];
        console.log("새 글 작성 완료:", newPostId);
        alert("게시되었습니다!");
        
        // 임시 저장된 초안 삭제
        localStorage.removeItem('communityDraft');
        
        // 새로 작성된 글로 이동
        navigate(`/community/viewpost/${newPostId}`)
      } catch (error) {
        console.error("글 작성 실패:", error);
        console.error(error.response?.data);

        console.error(error.response?.data?.message);
        alert("글 작성에 실패했습니다. 다시 시도해주세요.");
      }
    }
  };


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
            onChange={(e) => {
              console.log("선택된 카테고리 key:", e.target.value);
              setCategory(e.target.value || null);}}
            className="community-editor-category-select"
          >
            {MatchingCategories.map(c => (
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
            ref={reactQuillRef}
            value={content}
            onChange={setContent}
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
    </div>
  );
}