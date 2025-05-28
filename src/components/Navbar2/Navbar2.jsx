import React, { useEffect, useState } from "react";
import GoBackIcon from "../../icons/GoBackIcon/GoBackIcon";
import AlogLogo from "../../icons/AlogLogo/AlogLogo";
import { useNavigate } from "react-router-dom";
import "./Navbar2.css";

const Navbar2 = () => {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const scrollContainer =
      document.querySelector(".generate-README-screen") || window;

    const handleScroll = () => {
      const scrollTop =
        scrollContainer === window ? window.scrollY : scrollContainer.scrollTop;
      setScrolled(scrollTop > 0);
    };

    scrollContainer.addEventListener("scroll", handleScroll);
    return () => scrollContainer.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className={`navbar2 ${scrolled ? "navbar2--scrolled" : ""}`}>
      <div className="navbar2-frame">
        <div className="navbar2-left">
          <GoBackIcon />
        </div>
        <div
          className="navbar2-center"
          onClick={() => navigate("/MainPageAfter")}
        >
          <AlogLogo className="navbar2-logo" width={200} height={80} />
        </div>
        <div className="navbar2-right" />
      </div>
    </div>
  );
};

export default Navbar2;
