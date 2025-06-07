import React, { useState, useRef, useEffect } from "react";
import { useParams } from "react-router-dom";
import "./CommunityViewPost.css";
import Navbar2 from "../../components/Navbar2/Navbar2";
import FollowButton from "../../components/FollowButton/FollowButton";
import SendIcon from "../../icons/SendIcon/SendIcon";
import MatchingModal from "../../components/MatchingModal/MatchingModal";
import { useNavigate, useLocation } from "react-router-dom";
import { MatchingCategories } from "../../constants/categories";
import api from "../../api/instance"



function getLabelByKey(key) {
  const category = MatchingCategories.find((c) => c.key === key);
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
      isDeleted : c.isDeleted,
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



const CommunityViewPost = () => {
  const navigate = useNavigate();
  const { postId } = useParams();
  const location = useLocation();
  
  const [replyTo, setReplyTo] = useState(null);
  const [replyValue, setReplyValue] = useState("");
  const [openMenuId, setOpenMenuId] = useState(null);
  const [commentValue, setCommentValue] = useState("");
  const [comments, setComments] = useState([
    {
      id: 1,
      author: "배고픈 송희",
      text: "유익한 글 감사합니다!",
      date: "2025.03.29",
      replies: [],
    },
  ]);
  const [editCommentId, setEditCommentId] = useState(null);
  const [editCommentValue, setEditCommentValue] = useState("");
  const [editReplyId, setEditReplyId] = useState(null);
  const [editReplyValue, setEditReplyValue] = useState("");
  const menuRef = useRef(null);
  const editCommentInputRef = useRef(null);
  const editReplyInputRef = useRef(null);
  const [isMatchingModalOpen, setIsMatchingModalOpen] = useState(false);
  const [matchedIds, setMatchedIds] = useState([]);

  const myName = "배고픈 송희";
  const myUserId = Number(localStorage.getItem("userId"));
  


  // 글 데이터를 상태로 관리
  const [post, setPost] = useState(null);
  const [loadingPost, setLoadingPost] = useState(true);


  // HTML 컨텐츠를 안전하게 렌더링하는 함수 (이미지 포함)
  const renderContent = (content) => {
    if (!content) return null;
    
    // ReactQuill의 HTML 컨텐츠를 그대로 렌더링
    // 보안을 위해 dangerouslySetInnerHTML 사용 시 주의필요
    return (
      <div 
        className="post-content-html"
        dangerouslySetInnerHTML={{ __html: content }}
        style={{ 
          lineHeight: '1.6',
          wordBreak: 'break-word'
        }}
      />
    );
  };

  // // 수정된 데이터를 받아와서 글 정보 업데이트
  // useEffect(() => {
  //   if (location.state?.updatedPost) {
  //     const updatedPost = location.state.updatedPost;
  //     setPost(prevPost => ({
  //       ...prevPost,
  //       title: updatedPost.title || prevPost.title,
  //       category: updatedPost.category || prevPost.category,
  //       content: updatedPost.content || prevPost.content,
  //       tag: updatedPost.tags || prevPost.tag, // tags -> tag 매핑
  //       id: updatedPost.id || prevPost.id
  //     }));
  //     // state 정리
  //     window.history.replaceState({}, document.title);
  //   } else if (location.state?.newPost) {
  //     // 새 글인 경우
  //     const newPost = location.state.newPost;
  //     setPost({
  //       id: newPost.id,
  //       title: newPost.title,
  //       author: newPost.author,
  //       date: new Date(newPost.createdAt).toISOString().slice(0, 10).replace(/-/g, '.'),
  //       category: newPost.category,
  //       tag: newPost.tags,
  //       content: newPost.content
  //     });
  //     window.history.replaceState({}, document.title);
  //   }
  // }, [location.state]);

  // 게시글 상세 조회
  useEffect(() => {
    const fetchPostDetail = async () => {
      try {
        console.log("postid", postId)
        const token = localStorage.getItem("jwtToken");
        const res = await api.get(`/blog-service/posts/${postId}`,{
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = res.data.data;
        console.log("data ", data)
        setPost({
          id: data.postId,
          title: data.title,
          author: data.authorNickname,
          authorId: data.authorId,
          profileUrl: data.profileUrl,
          date: new Date(data.createdAt).toISOString().slice(0, 10).replace(/-/g, "."),
          category: data.categoryCode, // categoryName이 아니라면 추후 매핑 필요
          tag: data.tagNameList,
          content: data.content,
        });

      } catch (err) {
        console.error("게시글 상세 조회 실패", err);
        navigate("/community");
      } finally {
        setLoadingPost(false);
      }
    };

    fetchPostDetail();
  }, [postId]);


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
    if (!commentValue.trim()) return;
    try {
      const token = localStorage.getItem("jwtToken");
      const payload = {
        postId: Number(postId),       // 현재 보고 있는 글의 ID
        parentCommentId: null,        // 루트 댓글이므로 null
        content: commentValue.trim(), // 입력된 댓글 내용
      };

      await api.post(
        "/blog-service/comments",
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setCommentValue("");
      fetchComments();
    } catch (e) {
      console.error("댓글 등록 실패", e);
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

      await api.post(
        "/blog-service/comments",
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setReplyValue("");
      setReplyTo(null);
      fetchComments();
    } catch (e) {
      console.error("답글 등록 실패", e);
    }
  };

  //댓글 조회
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

  // 댓글 조회
  useEffect(() => {
    fetchComments();
  }, [postId]);

  // 댓글 삭제
  const handleDeleteComment = async(commentId) => {
    try {
      const token = localStorage.getItem("jwtToken");

      await api.delete(`/blog-service/comments/${commentId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setOpenMenuId(null);
      fetchComments();
    } catch (e) {
      console.error("댓글 삭제 실패", e);
    }
  };

  // 답글 삭제
  const handleDeleteReply = async(commentId, replyId) => {
    try {
      const token = localStorage.getItem("jwtToken");

      await api.delete(`/blog-service/comments/${replyId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOpenMenuId(null);
      fetchComments();
    } catch (e) {
      console.error("답글 삭제 실패", e);
    }
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
  const handleSaveEditComment = async(commentId) => {
    if (!editCommentValue.trim()) return;

    try {
      const token = localStorage.getItem("jwtToken");

      await api.patch(
        `/blog-service/comments/${commentId}`,
        { content: editCommentValue },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setEditCommentId(null);
      setEditCommentValue("");
      fetchComments();
    } catch (e) {
      console.error("댓글 수정 실패", e);
    }
  };

  // 답글 수정 저장
  const handleSaveEditReply = async(commentId, replyId) => {
    if (!editReplyValue.trim()) return;
    try {
      const token = localStorage.getItem("jwtToken");

      await api.patch(
        `/blog-service/comments/${replyId}`,
        { content: editReplyValue },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setEditReplyId(null);
      setEditReplyValue("");
      fetchComments();
    } catch (e) {
      console.error("답글 수정 실패", e);
    }
  };

  // 글 수정 버튼 클릭 - Write 페이지로 이동
  // const handleEditPost = () => {
  //   console.log("navigate state:", { editMode: true, post });

  //   navigate('/community/write', { 
  //     state: { 
  //       editMode: true,
  //       postData: {
  //         title: post.title,
  //         category: post.category,
  //         content: post.content,
  //         tags: post.tag,
  //         id: post.id
  //       }
  //     }
  //   });
  //   setOpenMenuId(null);
  // };

  // 글 삭제 버튼 클릭
  const handleDeletePost = async() => {
    if (window.confirm("정말로 이 글을 삭제하시겠습니까?")) {
      console.log("글 삭제하기");
      setOpenMenuId(null);

      // 게시글 삭제 API 호출 함수
    try {
      const token = localStorage.getItem("jwtToken");
      await api.delete(`/blog-service/posts/${postId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("글이 정상적으로 삭제되었습니다.");
      navigate("/community");
    } catch (err) {
      console.error("삭제 실패:", err);
      const msg = err.response?.data?.message;
      alert(msg || "삭제 중 오류가 발생했습니다.");
    }}
  };

const handleMatchingClick = async () => {
    try {
        let tags = post.tag;
        if (Array.isArray(tags)) tags = tags.join(",");
        tags = encodeURIComponent(tags);
        const url = `http://localhost/api/matching-service/search-user`;
        // const url = `http://a6b22e375302341608e5cefe10095821-1897121300.ap-northeast-2.elb.amazonaws.com:8000/api/matching-service/search-user`;
        const res = await api.get(url, {
          params: { tags, topK: 5, topKperTag: 5 },
          headers: { 'accept': 'application/json' }
        });
        const data = res.data;
        if (data.status === 200 && Array.isArray(data.data)) {
          const ids = data.data.map(u => u.userID);
          setMatchedIds(ids); // ids 저장
        } else {
          setMatchedIds([]);
          alert('유저 검색 실패');
        }
      } catch (e) {
        setMatchedIds([]);
        alert('매칭 요청 실패');
      }
    setIsMatchingModalOpen(true);
};



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
if (!post) {
  return (
    <div className="view-post-bg">
      <Navbar2 />
      <div className="viewpost-notfound">게시글을 찾을 수 없습니다.</div>
    </div>
  );
}


  return (
    <div className="view-post-bg">
      <Navbar2 />
      <div className="view-post-container" style={{ marginTop: "100px" }}>
        {/* 내용 외 정보 */}
        <div className="view-post-header">
          <div className="view-post-title-line" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h1 className="view-post-title">{post.title}</h1>
            {post.authorId == myUserId && (
              <div className="comment-menu-wrapper">
                <div
                  className="comment-menu"
                  onClick={() => setOpenMenuId(openMenuId === 'post' ? null : 'post')}
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                    <circle cx="3" cy="8" r="1.5"/>
                    <circle cx="8" cy="8" r="1.5"/>
                    <circle cx="13" cy="8" r="1.5"/>
                  </svg>
                </div>
                {openMenuId === 'post' && (
                  <div className="comment-menu-popup" ref={menuRef}>
                    <button 
                      className="comment-menu-item"
                      // onClick={handleEditPost}
                      onClick={() => {
                        navigate(`/community/write/${postId}`);
                      }}
                    >
                      수정하기
                    </button>
                    <button 
                      className="comment-menu-item"
                      onClick={handleDeletePost}
                    >
                      삭제하기
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
          <div className="view-post-meta-line">
            <div className="view-post-meta">
              <div className="post-profile-wrapper">
                {post.profileUrl && (
                  <img src={post.profileUrl} alt="post" className="post-profile-img" />
                )}
              </div>
              <div className="view-post-meta-text">{post.author}</div>
              <div className="view-post-meta-text">{post.date}</div>
            </div>
            {post.authorId !== myUserId  && <FollowButton />}
          </div>
          <div className="view-post-tags-line">
            <span className="view-post-category">{getLabelByKey(post.category)}</span>
            {post.tag && post.tag.length > 0 && (
              <span className="view-post-tags">
                {post.tag.map((tag) => `#${tag}`).join(" ")}
              </span>
            )}
          </div>
        </div>

        {/* 본문 카드 */}
        <div className="view-post-card">
          <div className="view-post-content">
            <div className="view-post-body">
              {renderContent(post.content)}
            </div>
            {/* 본인 글인 경우 매칭하기 버튼 */}
            {post.authorId === myUserId  && (
              <div className="matching-button-wrapper">
                <button className="matching-button" onClick={handleMatchingClick}>
                  🔗 USER 매칭 ✨
                </button>
              </div>
            )}
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
                      {!comment.isDeleted && (<span
                        className="reply-btn"
                        style={{ cursor: "pointer", color: "#6c6c8a", marginLeft: 8 }}
                        onClick={() => setReplyTo(replyTo === comment.id ? null : comment.id)}
                      >
                        reply
                      </span>)}
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
                                <img src={reply.authorProfileUrl} alt="comment" className="comment-profile-img" />
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
                            {reply.authorId === myUserId && (
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
                  {comment.authorId === myUserId && (
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
      {isMatchingModalOpen && (
        <MatchingModal 
          isOpen={isMatchingModalOpen} 
          onClose={() => setIsMatchingModalOpen(false)} 
          matchedIds={matchedIds}
        />
      )}
    </div>
  );
};

export default CommunityViewPost;