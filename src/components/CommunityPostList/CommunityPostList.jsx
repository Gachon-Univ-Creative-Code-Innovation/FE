import React, { useState, useEffect } from "react";
import CommentIcon from "../../icons/CommentIcon/CommentIcon";
import "./CommunityPostList.css";
import { useNavigate } from "react-router-dom";
import api from "../../api/local-instance"
import { MatchingCategories } from "../../constants/categories";


const ITEMS_PER_PAGE = 15;

export const CommunityPostList = ({sortBy, category}) => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const ITEMS_PER_PAGE = 15;
  const POST_TYPE = "MATCHING";
  


  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const token = localStorage.getItem("jwtToken");
        let url = "";
        const params = {page:page}

        if(category == "전체"){
            url = `/blog-service/posts/all`
            params.postType = POST_TYPE;
        } 
        else {
          // find()로 해당 label을 가진 객체를 찾는다
          const found = MatchingCategories.find((cat) => cat.label === category);
          const key = found ? found.key : null;
          url = `/blog-service/posts/matching/category/${key}`

        }
        
        const res = await api.get(
          url, {
            headers: { Authorization: `Bearer ${token}` },
            params,
          }
        );
        const data = res.data.data;
        console.log("data ", data)
        setPosts(data.postList);
        setTotalPages(data.totalPages);
      } catch (error) {
        console.error("게시글 목록 조회 실패:", error);
      }
    };

    fetchPosts();
  }, [category, page]);

  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage <= totalPages-1) {
      setPage(newPage);
      console.log("page", newPage, page)
    }
  };

  return (
    <div className="communitypost-list">
      <div className="communitypost-frame-2">
        {posts.map((post) => (
          <div 
            className="communitypost-frame-3" 
            key={post.postId}
            style={{ cursor: "pointer" }}
            onClick={() => navigate(`/community/viewpost/${post.postId}`)} // ← 여기가 핵심
          >
            <div className="communitypost-thumbnail-wrapper">
              {post.thumbnail && (
                <img src={post.thumbnail} alt="post" className="communitypost-thumbnail-img" />
              )}
            </div>
            <div className="communitypost-frame-4">
              <p className="communitypost-text-5">{post.title}</p>
              <div className="communitypost-frame-5">
                <div className="communitypost-text-3">
                  {post.createdAt?.split("T")[0] || "날짜 없음"}
                </div>
                <div className="communitypost-comment">
                  <CommentIcon className="communitypost-comment-icon" />
                  <div className="communitypost-text-4">{post.commentCount}</div>
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
          disabled={page === totalPages-1}
        >
          &#62;
        </button>
        <button
          className="communitypost-pagination-arrow"
          onClick={() => handlePageChange(totalPages - 1)}
          disabled={page === totalPages-1}
        >
          &#187;
        </button>
      </div>
    </div>
  );
};

export default CommunityPostList;
