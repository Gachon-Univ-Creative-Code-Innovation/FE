// src/components/CommunityPostList/CommunityPostList.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CommentIcon from "../../icons/CommentIcon/CommentIcon";
import api from "../../api/instance";
import { MatchingCategories } from "../../constants/categories";
import "./CommunityPostList.css";

const ITEMS_PER_PAGE = 15;
const POST_TYPE = "MATCHING";

// 날짜를 "YYYY.MM.DD" 형식으로 포맷팅하는 헬퍼
const formatDate = (isoString) => {
  if (!isoString) return "날짜 없음";
  return isoString.split("T")[0].replace(/-/g, ".");
};

export const CommunityPostList = ({ sortBy, categoryId }) => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        let url = "";
        if (categoryId === null || categoryId === undefined) {
          url = `/blog-service/posts/all?page=${page}&postType=MATCHING`;
        } else {
          url = `/blog-service/posts/matching/category/${categoryId}?page=${page}`;
        }
        const res = await api.get(url);
        const data = res.data.data;
        setPosts(data.postList);
        setTotalPages(data.totalPages);
      } catch (error) {
        console.error("게시글 목록 조회 실패:", error);
      }
    };
    fetchPosts();
  }, [categoryId, page]);

  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < totalPages) {
      setPage(newPage);
    }
  };

  return (
    <div className="communitypost-list">
      <div className="communitypost-frame-2">
        {posts.map((post) => (
          <div
            key={post.postId}
            className="communitypost-frame-3"
            style={{ cursor: "pointer" }}
            onClick={() => navigate(`/community/viewpost/${post.postId}`)}
          >
            <div className="communitypost-thumbnail-wrapper">
              <img
                src={post.thumbnail || "/img/basic_photo.png"}
                alt="post"
                className="communitypost-thumbnail-img"
                onError={(e) => {
                  e.currentTarget.src = "/img/basic_photo.png";
                }}
              />
            </div>
            <div className="communitypost-frame-4">
              <p className="communitypost-text-5">{post.title}</p>
              <div className="communitypost-frame-5">
                <div className="communitypost-text-3">
                  {formatDate(post.createdAt)}
                </div>
                <div className="communitypost-comment">
                  <CommentIcon className="communitypost-comment-icon" />
                  <div className="communitypost-text-4">
                    {post.commentCount}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="communitypost-pagination">
        <button
          className="communitypost-pagination-arrow"
          onClick={() => handlePageChange(0)}
          disabled={page === 0}
        >
          &#171;
        </button>
        <button
          className="communitypost-pagination-arrow"
          onClick={() => handlePageChange(page - 1)}
          disabled={page === 0}
        >
          &#60;
        </button>

        {Array.from({ length: totalPages }).map((_, i) => (
          <button
            key={i}
            className={`communitypost-pagination-btn${
              page === i ? " active" : ""
            }`}
            onClick={() => handlePageChange(i)}
            style={page === i ? { cursor: "default" } : {}}
          >
            {i + 1}
          </button>
        ))}

        <button
          className="communitypost-pagination-arrow"
          onClick={() => handlePageChange(page + 1)}
          disabled={page === totalPages - 1}
        >
          &#62;
        </button>
        <button
          className="communitypost-pagination-arrow"
          onClick={() => handlePageChange(totalPages - 1)}
          disabled={page === totalPages - 1}
        >
          &#187;
        </button>
      </div>
    </div>
  );
};

export default CommunityPostList;
