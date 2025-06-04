import React, { useState, useRef, useEffect } from "react";
import "./CommunityViewPost.css";
import Navbar2 from "../../components/Navbar2/Navbar2";
import FollowButton from "../../components/FollowButton/FollowButton";
import SendIcon from "../../icons/SendIcon/SendIcon";
import MatchingModal from "../../components/MatchingModal/MatchingModal";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../../api/local-instance";

const CommunityViewPost = () => {
  const navigate = useNavigate();
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

  // 글 데이터를 상태로 관리
  const [post, setPost] = useState({
    id: 1,
    title: "Title",
    author: "배고픈 송희",
    date: "2025.03.26",
    category: "공모전",
    tag: "#배고파",
    content: `집에 들어서자마자 은은하게 퍼지는 포근한 향기, 침대에 누울 때마다 느껴지는 산뜻한 상쾌함. 혹시 이런 감각을 경험해 보셨나요? 오늘은 일상의 작은 행복을 주는 숨겨진 아이템 '리넨워터(Linen Water)'를 소개하려 합니다.

리넨워터란 무엇일까요? 이름만 들으면 조금 생소할 수도 있지만, 쉽게 말해 리넨워터는 천연 에센셜 오일과 정제수 등을 섞어 만든 섬유 전용 향수라고 할 수 있습니다. 주로 침구류나 옷감에 뿌려서 사용하는 제품인데요, 일반적인 섬유유연제와는 다르게 끈적이지 않고 잔여물이 거의 없어 옷감이나 피부에 부담 없이 사용할 수 있는 게 큰 장점입니다.

리넨워터의 가장 큰 특징은 바로 그 은은한 향기입니다. 일반적인 향수나 섬유유연제보다 훨씬 가벼운 느낌으로, 자극적이지 않은 부드러운 향기가 오랫동안 지속됩니다. 또한, 향기뿐 아니라 탈취와 항균 효과까지 있어서 생활 속 다양한 상황에서 활용도가 높습니다.`,
  });

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

  // 수정된 데이터를 받아와서 글 정보 업데이트
  useEffect(() => {
    if (location.state?.updatedPost) {
      const updatedPost = location.state.updatedPost;
      setPost(prevPost => ({
        ...prevPost,
        title: updatedPost.title || prevPost.title,
        category: updatedPost.category || prevPost.category,
        content: updatedPost.content || prevPost.content,
        tag: updatedPost.tags || prevPost.tag, // tags -> tag 매핑
        id: updatedPost.id || prevPost.id
      }));
      // state 정리
      window.history.replaceState({}, document.title);
    } else if (location.state?.newPost) {
      // 새 글인 경우
      const newPost = location.state.newPost;
      setPost({
        id: newPost.id,
        title: newPost.title,
        author: newPost.author,
        date: new Date(newPost.createdAt).toISOString().slice(0, 10).replace(/-/g, '.'),
        category: newPost.category,
        tag: newPost.tags,
        content: newPost.content
      });
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

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
  const handleAddComment = () => {
    if (!commentValue.trim()) return;
    setComments([
      ...comments,
      {
        id: Date.now(),
        author: myName,
        text: commentValue,
        date: new Date().toISOString().slice(0, 10).replace(/-/g, '.'),
        replies: [],
      },
    ]);
    setCommentValue("");
  };

  // 답글 등록
  const handleAddReply = (commentId) => {
    if (!replyValue.trim()) return;
    setComments(comments.map(comment =>
      comment.id === commentId
        ? {
            ...comment,
            replies: [
              ...(comment.replies || []),
              {
                id: Date.now(),
                author: myName,
                text: replyValue,
                date: new Date().toISOString().slice(0, 10).replace(/-/g, '.'),
              },
            ],
          }
        : comment
    ));
    setReplyValue("");
    setReplyTo(null);
  };

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

  // 글 수정 버튼 클릭 - Write 페이지로 이동
  const handleEditPost = () => {
    navigate('/community/write', { 
      state: { 
        editMode: true,
        postData: {
          title: post.title,
          category: post.category,
          content: post.content,
          tags: post.tag,
          id: post.id
        }
      }
    });
    setOpenMenuId(null);
  };

  // 글 삭제 버튼 클릭
  const handleDeletePost = () => {
    if (window.confirm("정말로 이 글을 삭제하시겠습니까?")) {
      console.log("글 삭제하기");
      setOpenMenuId(null);
      // navigate('/community');
    }
  };

const handleMatchingClick = async () => {
    try {
        let tags = post.tag;
        if (Array.isArray(tags)) tags = tags.join(",");
        tags = encodeURIComponent(tags);
        const url = `http://localhost/api/matching-service/search-user`;
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


  const isMyPost = post.author === myName;

  return (
    <div className="view-post-bg">
      <Navbar2 />
      <div className="view-post-container" style={{ marginTop: "100px" }}>
        {/* 내용 외 정보 */}
        <div className="view-post-header">
          <div className="view-post-title-line" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h1 className="view-post-title">{post.title}</h1>
            {isMyPost && (
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
                      onClick={handleEditPost}
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
              <span>{post.author}</span>
              <span>{post.date}</span>
            </div>
            {!isMyPost && <FollowButton />}
          </div>
          <div className="view-post-tags-line">
            <span className="view-post-category">{post.category}</span>
            <span className="view-post-tags">{post.tag}</span>
          </div>
        </div>

        {/* 본문 카드 */}
        <div className="view-post-card">
          <div className="view-post-content">
            <div className="view-post-body">
              {renderContent(post.content)}
            </div>
            {/* 본인 글인 경우 매칭하기 버튼 */}
            {isMyPost && (
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
                  <div className="comment-profile"></div>
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
                            <div className="comment-profile"></div>
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
                            {reply.author === myName && (
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
                  {comment.author === myName && (
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