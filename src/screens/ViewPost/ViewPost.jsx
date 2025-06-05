import React, { useState, useRef, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./ViewPost.css";
import Navbar2 from "../../components/Navbar2/Navbar2";
import FollowButton from "../../components/FollowButton/FollowButton";
import SendIcon from "../../icons/SendIcon/SendIcon";
import dompurify from "dompurify";
import { Categories } from "../../constants/categories";
import api from "../../api/local-instance"; 
import realApi from "../../api/instance"; 

function getLabelByKey(key) {
  const category = Categories.find((c) => c.key === key);
  return category ? category.label : "";
}

/**
 * 백엔드에서 내려준 flat list를 nested structure({ replies: [] })로 바꿔준다.
 * @param {Array<Object>} flatComments
 *   └ 백엔드 GetComment DTO 배열. 각 항목에 commentId, parentCommentId, authorNickname, content, createTime 등이 있음.
 * @returns {Array<Object>} nestedComments
 */
function buildNestedComments(flatComments) {
  // 1) 모든 댓글을 id → 새로운 객체(프론트용)로 매핑
  const map = {};
  flatComments.forEach((c) => {
    map[c.commentId] = {
      id: c.commentId,
      author: c.authorNickname,
      text: c.content,
      authorId: c.authorId, // 댓글 작성자의 ID
      authorProfileUrl: c.authorProfileUrl, // 댓글 작성자의 프로필 이미지 URL
      // createTime(예: "2025-06-03T05:00:00")을 "2025.06.03" 형태로 포맷
      date: c.createTime.slice(0, 10).replace(/-/g, "."),
      replies: []
    };
  });

  // 2) parentCommentId가 있으면, 해당 parent의 replies 배열에 push
  //    없으면 최상위(root) 댓글 목록에 추가
  const nested = [];
  flatComments.forEach((c) => {
    const node = map[c.commentId];
    if (c.parentCommentId) {
      const parentNode = map[c.parentCommentId];
      if (parentNode) {
        parentNode.replies.push(node);
      }
      // 만약 parentNode가 없다면 (비정상 케이스) 그냥 무시해도 됩니다.
    } else {
      nested.push(node);
    }
  });

  return nested;
}

const ViewPost = () => {
  const { postId } = useParams();
  const navigate = useNavigate();
  
  // 스크립트를 활용하여 javascript와 HTML로 악성 코드를 웹 브라우저에 심어, 사용자 접속시 그 악성코드가 실행되는 것을 XSS, 보안을 위해 sanitize 추가
  const sanitizer = dompurify.sanitize;

  // --- 게시글 상세 데이터를 담을 상태 ---
  const [postData, setPostData] = useState(null);
  const [loadingPost, setLoadingPost] = useState(true);

  // --- 댓글/답글 로직 ---
  const [replyTo, setReplyTo] = useState(null);
  const [replyValue, setReplyValue] = useState("");
  const [openMenuId, setOpenMenuId] = useState(null);
  const [commentValue, setCommentValue] = useState("");
  const [comments, setComments] = useState(null);
  const [editCommentId, setEditCommentId] = useState(null);
  const [editCommentValue, setEditCommentValue] = useState("");
  const [editReplyId, setEditReplyId] = useState(null);
  const [editReplyValue, setEditReplyValue] = useState("");
  const menuRef = useRef(null);
  const editCommentInputRef = useRef(null);
  const editReplyInputRef = useRef(null);

  // 현재 로그인한 사용자의 ID
  const myUserId = Number(localStorage.getItem("userId"));
  
  // 바깥 클릭 시 메뉴 닫기
  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpenMenuId(null);
      }
    }
    if (openMenuId !== null) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [openMenuId]);

  // 댓글 수정 모드 외부 클릭 시 취소
  useEffect(() => {
    if (editCommentId === null) return;
    function handleClickOutside(e) {
      if (editCommentInputRef.current && !editCommentInputRef.current.contains(e.target)) {
        setEditCommentId(null);
        setEditCommentValue("");
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [editCommentId]);

  // 답글 수정 모드 외부 클릭 시 취소
  useEffect(() => {
    if (editReplyId === null) return;
    function handleClickOutside(e) {
      if (editReplyInputRef.current && !editReplyInputRef.current.contains(e.target)) {
        setEditReplyId(null);
        setEditReplyValue("");
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [editReplyId]);

  // 댓글 등록
  const handleAddComment = async() => {
    try {
      const token = localStorage.getItem("jwtToken");
      const payload = {
        postId: Number(postId),       // 현재 보고 있는 글의 ID
        parentCommentId: null,        // 루트 댓글이므로 null
        content: commentValue.trim(), // 입력된 댓글 내용
      };
  
      // 댓글 생성 API 호출
      const response = await api.post(
        "/blog-service/comments",
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );
  
      setCommentValue("");


      // 생성 후 전체 댓글을 다시 로드해서 가장 최신 상태를 반영
      const res2 = await api.get(
        `/blog-service/comments/${postId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const nested = buildNestedComments(res2.data.data.commentList);
      setComments(nested);

    } catch (err) {
      console.error("댓글 생성 실패:", err);
      const errMsg = err.response?.data?.message || "댓글 생성 중 오류가 발생했습니다.";
      alert(errMsg);
    }
  };

  // 답글 등록
  const handleAddReply = async(commentId) => {
    if (!replyValue.trim()) return;

    try {
      const token = localStorage.getItem("jwtToken");
      const payload = {
        postId: Number(postId),             // 현재 보고 있는 게시글 ID
        parentCommentId: commentId,         // 답글을 다는 부모 댓글 ID
        content: replyValue.trim(),         // 입력된 답글 내용
      };
  
      // 1) 답글 생성 API 호출
      await api.post(
        "/blog-service/comments",
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );
  
      setReplyValue("");
      setReplyTo(null);
  
      // 2) 생성 후 전체 댓글을 다시 조회해서, 최신 상태의 중첩 구조를 반영
      const res = await api.get(
        `/blog-service/comments/${postId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const flatList = res.data.data.commentList;
      const nested = buildNestedComments(flatList);
      setComments(nested);
  
    } catch (err) {
      console.error("답글 생성 실패:", err.response?.data ?? err);
      alert(err.response?.data?.message || "답글 생성 중 오류가 발생했습니다.");
    }
  };

  // 댓글 조회
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const token = localStorage.getItem("jwtToken");
        // “postId별 댓글 조회” API 호출
        const res = await api.get(
          `/blog-service/comments/${postId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const flatList = res.data.data.commentList;
        console.log("댓글 데이터:", flatList);
        const nested = buildNestedComments(flatList);
        setComments(nested);
      } catch (err) {
        console.error("댓글 조회 실패:", err);
      }
    };

    fetchComments();
  }, [postId]);

  // 댓글 삭제
  const handleDeleteComment = (commentId) => {
    setComments(comments.filter(comment => comment.id !== commentId));
    setOpenMenuId(null);
  };

  // 답글 삭제
  const handleDeleteReply = (commentId, replyId) => {
    setComments(comments.map(comment =>
      comment.id === commentId
        ? {
            ...comment,
            replies: comment.replies.filter(reply => reply.id !== replyId)
          }
        : comment
    ));
    setOpenMenuId(null);
  };

  // 댓글 수정 모드 진입
  const handleEditComment = (commentId) => {
    const comment = comments.find(c => c.id === commentId);
    setEditCommentId(commentId);
    setEditCommentValue(comment.text);
    setOpenMenuId(null);
  };

  // 답글 수정 모드 진입
  const handleEditReply = (commentId, replyId) => {
    const comment = comments.find(c => c.id === commentId);
    const reply = comment.replies.find(r => r.id === replyId);
    setEditReplyId(replyId);
    setEditReplyValue(reply.text);
    setOpenMenuId(null);
  };

  // 댓글 수정 저장
  const handleSaveEditComment = (commentId) => {
    if (!editCommentValue.trim()) return;
    setComments(comments.map(comment =>
      comment.id === commentId
        ? { ...comment, text: editCommentValue }
        : comment
    ));
    setEditCommentId(null);
    setEditCommentValue("");
  };

  // 답글 수정 저장
  const handleSaveEditReply = (commentId, replyId) => {
    if (!editReplyValue.trim()) return;
    setComments(comments.map(comment =>
      comment.id === commentId
        ? {
            ...comment,
            replies: comment.replies.map(reply =>
              reply.id === replyId
                ? { ...reply, text: editReplyValue }
                : reply
            )
          }
        : comment
    ));
    setEditReplyId(null);
    setEditReplyValue("");
  };

  // ---  게시글 상세 API 호출  ---
  useEffect(() => {
    const fetchPostDetail = async () => {
      try {
        const token = localStorage.getItem("jwtToken");
        const res = await api.get(`/blog-service/posts/${postId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPostData(res.data.data);
        console.log("상세 포스트 데이터:", res.data.data);

        // 댓글 데이터 조회
        const resComment = await api.get(`/blog-service/comments/${postId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        

      } catch (err) {
        console.error("상세 포스트 불러오기 실패:", err);
        alert("게시글을 불러오는 데 실패했습니다.");
        navigate(-1);
      } finally {
        setLoadingPost(false);
      }
    };

    fetchPostDetail();
  }, [postId]);
  

  // --- 포스트 조회 로딩 중일 때 처리 ---
  if (loadingPost) {
    return (
      <div className="view-post-bg">
        <Navbar2 />
        <div className="viewpost-loading">로딩 중...</div>
      </div>
    );
  }

  // --- 게시글이 없을 때 처리 ---
  if (!postData) {
    return (
      <div className="view-post-bg">
        <Navbar2 />
        <div className="viewpost-notfound">게시글을 찾을 수 없습니다.</div>
      </div>
    );
  }

  // 날짜 포맷팅: "2025-06-01T12:34:56" → "2025.06.01"
  const datePart = postData.createdAt.split("T")[0].replace(/-/g, ".");
  const formattedDate = datePart;


  // 게시글 삭제 API 호출 함수
  const handleDeletePost = async () => {
    try {
      const token = localStorage.getItem("jwtToken");
      await api.delete(`/blog-service/posts/${postId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("글이 정상적으로 삭제되었습니다.");
      navigate("/MainPageAfter");
    } catch (err) {
      console.error("삭제 실패:", err);
      const msg = err.response?.data?.message;
      alert(msg || "삭제 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="view-post-bg">
      <Navbar2 />
      <div className="view-post-container" style={{ marginTop: "100px" }}>
        {/* 내용 외 정보 */}
      <div className="view-post-header">
        <h1 className="view-post-title">{postData.title}</h1>
          <div className="view-post-meta-line">
            <div className="view-post-meta">
              <div className="post-profile-wrapper">
                {postData.profileUrl && (
                  <img src={postData.profileUrl} alt="post" className="post-profile-img" />
                )}
              </div>
              <div className="view-post-meta-text">{postData.authorNickname}</div>
              <div className="view-post-meta-text">{formattedDate}</div>
            </div>
            <FollowButton />
          </div>
          <div className="view-post-tags-line">
            <span className="view-post-category">{getLabelByKey(postData.categoryCode)}</span>
            {postData.tagNameList && postData.tagNameList.length > 0 && (
              <span className="view-post-tags">
                {postData.tagNameList.map((tag) => `#${tag}`).join(", ")}
              </span>
            )}
          
            {/* 포스트 메뉴 (본인이 작성한 포스트인 경우만) */}
            {postData.authorId == myUserId && (
              <div className="view-post-menu-wrapper">
                <div
                  className="view-post-menu"
                  onClick={() => setOpenMenuId(openMenuId === `reply-${postData.postId}` ? null : `reply-${postData.postId}`)}
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                    <circle cx="3" cy="8" r="1.5"/>
                    <circle cx="8" cy="8" r="1.5"/>
                    <circle cx="13" cy="8" r="1.5"/>
                  </svg>
                </div>
                {openMenuId === `reply-${postData.postId}` && (
                  <div className="view-post-menu-popup" ref={menuRef}>
                    <button 
                      className="view-post-menu-item"
                      onClick={() => {
                        navigate(`/write/${postId}`);
                      }}                    
                      >
                      수정하기
                    </button>
                    <button 
                      className="view-post-menu-item"
                      onClick={() => {
                        // ① 사용자 확인 대화상자 표시
                        if (window.confirm("정말 이 글을 삭제하시겠습니까?")) {
                          // ② 확인했다면 실제 삭제 API 호출
                          handleDeletePost();
                        }
                      }}
                    >
                      삭제하기
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* 본문 카드 */}
        <div className="view-post-card">
          <div className="view-post-content">
            <div 
              className="view-post-body"
              dangerouslySetInnerHTML={{ __html: sanitizer(String(postData.content)) }}
            />
          </div>

          {/* 댓글 섹션 */}
          <div className="view-post-comments-section">
            {/* 댓글 입력 */}
            <div className="comment-input-wrapper">
          <input
            type="text"
            placeholder="댓글 작성"
                className="comment-input"
                value={commentValue}
                onChange={e => setCommentValue(e.target.value)}
                onKeyDown={e => { if (e.key === "Enter") handleAddComment(); }}
          />
              <button className="comment-send-btn" onClick={handleAddComment}>
                <SendIcon />
          </button>
        </div>

        {/* 댓글 목록 */}
            <div className="comment-list">
              {comments.map((comment) => (
                <div key={comment.id} className="comment-item">
                  <div className="comment-profile-wrapper">
                    {comment.authorProfileUrl && (
                      <img src={comment.authorProfileUrl} alt="comment" className="comment-profile-img" />
                    )}
                  </div>
                  <div className="comment-content-block">
                    <div className="comment-author">{comment.author}</div>
                    {editCommentId === comment.id ? (
                      <div className="comment-edit-wrapper" ref={editCommentInputRef}>
                        <input
                          className="comment-input"
                          value={editCommentValue}
                          onChange={e => setEditCommentValue(e.target.value)}
                          onKeyDown={e => { if (e.key === "Enter") handleSaveEditComment(comment.id); }}
                          autoFocus
                        />
                        <button className="comment-save-btn-inside" onClick={() => handleSaveEditComment(comment.id)}>
                          저장
                        </button>
                      </div>
                    ) : (
                      <div className="comment-text">{comment.text}</div>
                    )}
                    <div className="comment-meta">
                      <span>{comment.date}</span>
                      <span
                        className="reply-btn"
                        style={{ cursor: "pointer", color: "#6c6c8a", marginLeft: 8 }}
                        onClick={() => setReplyTo(replyTo === comment.id ? null : comment.id)}
                      >
                        reply
                      </span>
                    </div>
                    {/* 답글 입력창 */}
                    {replyTo === comment.id && (
                      <div className="comment-reply-input-wrapper">
                        <input
                          type="text"
                          placeholder="답글 작성"
                          className="comment-input"
                          value={replyValue}
                          onChange={e => setReplyValue(e.target.value)}
                          onKeyDown={e => { if (e.key === "Enter") handleAddReply(comment.id); }}
                        />
                        <button className="comment-send-btn" onClick={() => handleAddReply(comment.id)}>
                          <SendIcon />
                        </button>
                      </div>
                    )}
                    {/* 답글 목록 */}
                    {comment.replies && comment.replies.length > 0 && (
                      <div className="comment-replies-list">
                        {comment.replies.map(reply => (
                          <div key={reply.id} className="comment-reply-item">
                            <div className="comment-profile-wrapper">
                              {reply.authorProfileUrl && (
                                <img src={reply.authorProfileUrl} alt="reply" className="comment-profile-img" />
                              )}
                            </div>
                            <div className="reply-content">
                              <div className="comment-author">{reply.author}</div>
                              {editReplyId === reply.id ? (
                                <div className="comment-edit-wrapper" ref={editReplyInputRef}>
                                  <input
                                    className="comment-input"
                                    value={editReplyValue}
                                    onChange={e => setEditReplyValue(e.target.value)}
                                    onKeyDown={e => { if (e.key === "Enter") handleSaveEditReply(comment.id, reply.id); }}
                                    autoFocus
                                  />
                                  <button className="comment-save-btn-inside" onClick={() => handleSaveEditReply(comment.id, reply.id)}>
                                    저장
                                  </button>
                                </div>
                              ) : (
                                <div className="comment-text">{reply.text}</div>
                              )}
                              <div className="comment-meta">
                                <span>{reply.date}</span>
                              </div>
                            </div>
                            {/* 답글 메뉴 (본인이 작성한 답글인 경우만) */}
                            {reply.authorId == myUserId && (
                              <div className="comment-menu-wrapper">
                                <div
                                  className="comment-menu"
                                  onClick={() => setOpenMenuId(openMenuId === `reply-${reply.id}` ? null : `reply-${reply.id}`)}
                                >
                                  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                                    <circle cx="3" cy="8" r="1.5"/>
                                    <circle cx="8" cy="8" r="1.5"/>
                                    <circle cx="13" cy="8" r="1.5"/>
                                  </svg>
                                </div>
                                {openMenuId === `reply-${reply.id}` && (
                                  <div className="comment-menu-popup" ref={menuRef}>
                                    <button 
                                      className="comment-menu-item"
                                      onClick={() => handleEditReply(comment.id, reply.id)}
                                    >
                                      수정하기
                                    </button>
                                    <button 
                                      className="comment-menu-item"
                                      onClick={() => handleDeleteReply(comment.id, reply.id)}
                                    >
                                      삭제하기
                                    </button>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  {/* 댓글 메뉴 (본인이 작성한 댓글인 경우만) */}
                  {comment.authorId == myUserId && (
                    <div className="comment-menu-wrapper">
                      <div
                        className="comment-menu"
                        onClick={() => setOpenMenuId(openMenuId === comment.id ? null : comment.id)}
                      >
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                          <circle cx="3" cy="8" r="1.5"/>
                          <circle cx="8" cy="8" r="1.5"/>
                          <circle cx="13" cy="8" r="1.5"/>
                        </svg>
                      </div>
                      {openMenuId === comment.id && (
                        <div className="comment-menu-popup" ref={menuRef}>
                          <button 
                            className="comment-menu-item"
                            onClick={() => handleEditComment(comment.id)}
                          >
                            수정하기
                          </button>
                          <button 
                            className="comment-menu-item"
                            onClick={() => handleDeleteComment(comment.id)}
                          >
                            삭제하기
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewPost;