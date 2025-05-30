import React, { useState, useRef, useEffect } from "react";
import "./ViewPost.css";
import Navbar2 from "../../components/Navbar2/Navbar2";
import FollowButton from "../../components/FollowButton/FollowButton";
import SendIcon from "../../icons/SendIcon/SendIcon";

const ViewPost = () => {
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

  // 예시: 본인 닉네임(실제 서비스에서는 로그인 유저 정보 사용)
  const myName = "배고픈 송희";

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

  const post = {
    title: "Title",
    author: "Author",
    date: "2025.03.26",
    category: "일상",
    tag: "#React",
    content: `집에 들어서자마자 은은하게 퍼지는 포근한 향기, 침대에 누울 때마다 느껴지는 산뜻한 상쾌함. 혹시 이런 감각을 경험해 보셨나요? 오늘은 일상의 작은 행복을 주는 숨겨진 아이템 '리넨워터(Linen Water)'를 소개하려 합니다.

리넨워터란 무엇일까요? 이름만 들으면 조금 생소할 수도 있지만, 쉽게 말해 리넨워터는 천연 에센셜 오일과 정제수 등을 섞어 만든 섬유 전용 향수라고 할 수 있습니다. 주로 침구류나 옷감에 뿌려서 사용하는 제품인데요, 일반적인 섬유유연제와는 다르게 끈적이지 않고 잔여물이 거의 없어 옷감이나 피부에 부담 없이 사용할 수 있는 게 큰 장점입니다.

리넨워터의 가장 큰 특징은 바로 그 은은한 향기입니다. 일반적인 향수나 섬유유연제보다 훨씬 가벼운 느낌으로, 자극적이지 않은 부드러운 향기가 오랫동안 지속됩니다. 또한, 향기뿐 아니라 탈취와 항균 효과까지 있어서 생활 속 다양한 상황에서 활용도가 높습니다.

리넨워터는 어떻게 사용할까요? 가장 기본적인 방법은 세탁 후 건조하기 직전이나 건조한 후 섬유 위에 직접 뿌리는 것입니다. 침대 시트나 베개커버, 커튼, 담요 등 생활 섬유 제품에 뿌려주면 오래도록 상쾌한 향을 유지할 수 있습니다. 또한, 다림질할 때 물 대신 살짝 뿌려주면 주름 제거와 동시에 좋은 향기까지 얻을 수 있습니다.

리넨워터의 다양한 활용법을 좀 더 자세히 살펴볼까요? 우선 침실에서의 사용이 가장 대표적입니다. 매일 사용하는 침구류에 뿌리면 잠자리에 들 때마다 기분 좋은 향기와 함께 깊고 편안한 수면을 도와줍니다. 특히, 라벤더 향의 리넨워터는 숙면에 도움이 되어 불면증을 겪는 분들에게도 추천할 만합니다.

거실이나 욕실에서도 유용하게 사용할 수 있습니다. 커튼이나 카펫, 소파 커버 등에 뿌리면 집 전체가 은은하고 고급스러운 향기로 가득 차게 됩니다. 또한 욕실의 타월이나 목욕 가운에도 사용하면, 매일 샤워 후 기분 좋은 향기를 느낄 수 있습니다. 특히 욕실에서는 탈취 효과도 뛰어나 습기나 냄새 관리에 효과적입니다.

외출 전 옷이나 스카프, 모자에도 살짝 뿌려주면 하루 종일 산뜻한 향기를 유지할 수 있습니다. 특히 땀이 많은 여름철이나 외부 활동이 잦은 날, 가벼운 리넨워터를 뿌린 옷은 상쾌함을 유지하는 데 큰 도움이 됩니다. 자극적이지 않아서 향수 대신 사용할 수도 있으며, 자연스럽고 편안한 분위기를 만들어줍니다.

리넨워터를 고를 때는 제품의 성분을 꼭 확인해 보세요. 인공 향료보다는 천연 에센셜 오일이 들어간 제품이 피부나 옷감에도 자극이 적고 건강에도 더 좋습니다. 블랑101, 아로마티카, 록시땅 등 다양한 브랜드에서 좋은 품질의 리넨워터를 만나볼 수 있습니다. 향의 종류도 다양해서 라벤더, 유칼립투스, 로즈, 자스민 등 본인의 취향에 맞게 선택할 수 있습니다.

리넨워터를 직접 만들어 보는 것도 좋은 방법입니다. 정제수 200ml에 라벤더나 유칼립투스 같은 에센셜 오일을 5~10방울 섞고, 약간의 식물성 알콜을 넣어주면 간단히 완성됩니다. 이렇게 직접 만든 리넨워터는 나만의 특별한 향으로 개성을 표현할 수 있고, 경제적인 장점도 있습니다. 또한 선물용으로 예쁜 병에 담아 주변 사람들에게 나누어 주면 센스 있는 선물이 됩니다.

리넨워터 사용 시 주의할 점도 있습니다. 너무 많이 뿌리면 향기가 과할 수 있으므로 적당량만 사용하는 것이 좋습니다. 또한 흰색이나 밝은 색의 옷감에 사용하기 전에 색이 변하지 않는지 작은 부분에 미리 테스트하는 것이 좋습니다.

리넨워터 하나로 일상에 작지만 확실한 행복을 더해보세요. 오늘부터 섬유유연제 대신 리넨워터를 사용해본다면, 이전과는 확실히 달라진 산뜻한 하루를 느낄 수 있을 것입니다.

향기로운 일상을 만드는 마법, 지금 바로 시작해보세요!`,
  };

  return (
    <div className="view-post-bg">
      <Navbar2 />
      <div className="view-post-container" style={{ marginTop: "100px" }}>
        {/* 내용 외 정보 */}
      <div className="view-post-header">
        <h1 className="view-post-title">{post.title}</h1>
        <div className="view-post-meta-line">
            <div className="view-post-meta">
              <span>{post.author}</span>
              <span>{post.date}</span>
            </div>
            <FollowButton />
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
              {post.content.split('\n').map((line, idx) => (
                <React.Fragment key={idx}>
                  {line}
                  <br />
                </React.Fragment>
              ))}
            </div>
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
                            {/* 답글 메뉴 (본인이 작성한 답글인 경우만) */}
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
                  {/* 댓글 메뉴 (본인이 작성한 댓글인 경우만) */}
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
    </div>
  );
};

export default ViewPost;