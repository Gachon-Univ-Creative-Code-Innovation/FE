// src/components/SearchModal/SearchModal.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/instance";
import CloseIcon from "../../icons/CloseIcon/CloseIcon";
import "./SearchModal.css";

const SearchModal = ({ onClose }) => {
  /* ------------------------ state ------------------------ */
  const [keyword, setKeyword] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sortBy, setSortBy] = useState(1);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const navigate = useNavigate();

  /* 추가: silent loading 상태 */
  const [silentLoading, setSilentLoading] = useState(false);

  /* ---------------------- API wrapper -------------------- */
  const searchPosts = (keyword, sort = 1, p = 0) =>
    api.get("/blog-service/posts/search", { params: { keyword, sortBy: sort, page: p } });

  /* ---------------------- handlers ----------------------- */
  const handleSearch = async () => {
    if (!silentLoading) setLoading(true);   // silent loading 시에는 로딩 표시 안 함
    try {
      const res = await searchPosts(keyword, sortBy, page);
      const data = res.data?.data ?? res.data;    // 두 가지 구조 모두 지원
      setResults(data.postList ?? []);
      setTotalPages(data.totalPages ?? 0);
    } catch (err) {
      console.error(err);
      alert("검색 중 오류가 발생했습니다.");
    } finally {
      if (!silentLoading) setLoading(false);
    }
  };

  /* page / sortBy 변경 시 자동 재검색  */
  useEffect(() => {
    if (keyword.trim()) handleSearch();
  }, [page, sortBy]);                             // keyword 제외

  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i);

  /* ------------------------- UI -------------------------- */
  return (
    <div className="summary-popup-overlay">
      <div className="summary-popup-content">

        {/* 헤더 */}
        <div className="popup-header">
          <div className="popup-title">🔍 글 검색하기</div>
          <CloseIcon onClick={onClose} className="search-modal-close-icon" />
        </div>

        {/* 검색 입력창 */}
        <div className="search-bar">
          <input
            className="search-input"
            placeholder="검색어를 입력하세요"
            value={keyword}
            onChange={e => setKeyword(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter") { setPage(0); handleSearch(); } }}
          />
          <button className="search-button" onClick={() => { setPage(0); handleSearch(); }}>
            검색
          </button>
        </div>

        {/* 정렬 탭 */}
        {results.length > 0 && (
          <div style={{ display: "flex", gap: 16, fontWeight: "bold", marginBottom: 12 }}>
            {[
              { label: "관련도순", val: 1 },
              { label: "최신순", val: 2 },
              { label: "인기순", val: 3 },
            ].map(t => (
              <span
                key={t.val}
                className={`sort-tab ${sortBy === t.val ? "active" : "default"}`}  // 추가: className 적용
                onClick={() => {
                  if (sortBy !== t.val) {
                    setSilentLoading(true);   // silent loading 시작
                    setSortBy(t.val);
                    setPage(0);
                    setTimeout(() => setSilentLoading(false), 150);  // silent 종료 (필요 시 딜레이 약간 조정)
                  }
                }}
              >
                {t.label}
              </span>
            ))}
          </div>
        )}

        {/* 결과 리스트 */}
        <div style={{ position: "relative" }}>
          {/*  추가: 검색 중일 때는 "검색 중..." 만 표시 */}
          {loading ? (
            <p className="loading-text">검색 중…</p>
          ) : results.length === 0 ? (
            <p className="no-results-text">검색 결과가 없습니다.</p>
          ) : (
            <ul className="results-list has-results">
              {results.map(post => (
                <li
                  key={post.postId}
                  className="result-item"
                  style={{ cursor: "pointer" }}
                  onClick={() => navigate(`/viewpost/${post.postId}`)}
                >
                  {post.title}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* 숫자 페이지네이션 (CommunityPostList 스타일로 변경) */}
        {results.length > 0 && (
          <div className="communitypost-pagination">
            <button
              className="communitypost-pagination-arrow"
              onClick={() => {
                setSilentLoading(true);
                setPage(0);
                setTimeout(() => setSilentLoading(false), 150);
              }}
              disabled={page === 0}
            >
              &#171;
            </button>
            <button
              className="communitypost-pagination-arrow"
              onClick={() => {
                setSilentLoading(true);
                setPage(page - 1);
                setTimeout(() => setSilentLoading(false), 150);
              }}
              disabled={page === 0}
            >
              &#60;
            </button>

            {pageNumbers.map(p => (
              <button
                key={p}
                className={`communitypost-pagination-btn${page === p ? " active" : ""}`}
                onClick={() => {
                  if (page !== p) {
                    setSilentLoading(true);
                    setPage(p);
                    setTimeout(() => setSilentLoading(false), 150);
                  }
                }}
                style={page === p ? { cursor: "default" } : {}}
              >
                {p + 1}
              </button>
            ))}

            <button
              className="communitypost-pagination-arrow"
              onClick={() => {
                setSilentLoading(true);
                setPage(page + 1);
                setTimeout(() => setSilentLoading(false), 150);
              }}
              disabled={page === totalPages - 1}
            >
              &#62;
            </button>
            <button
              className="communitypost-pagination-arrow"
              onClick={() => {
                setSilentLoading(true);
                setPage(totalPages - 1);
                setTimeout(() => setSilentLoading(false), 150);
              }}
              disabled={page === totalPages - 1}
            >
              &#187;
            </button>
          </div>
        )}

      </div>
    </div>
  );
};

export default SearchModal;
