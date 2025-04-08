import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import Component22 from "../../components/Component22/Component22";
import Component23 from "../../components/Component23/Component23";
import "./SelectModestyle.css";

const MotionDiv = motion.div;

const SelectMode = ({ isOpen, onClose }) => {
  const handleOverlayClick = (e) => {
    if (e.target.classList.contains("modal-overlay")) {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="modal-overlay" onClick={handleOverlayClick}>
          <MotionDiv
            className="modal-content"
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.3 }}
          >
            <button className="modal-close" onClick={onClose}>
              ✖
            </button>

            <div className="select-mode-wrapper">
              <div className="div-6">
                <p className="choose-your-role">
                  <span className="span">
                    Choose your role.
                    <br />
                  </span>
                  <span className="text-wrapper-62">
                    <br />
                  </span>
                  <span className="span">
                    User
                    <br />
                  </span>
                  <span className="text-wrapper-62">
                    Read, write, and follow posts from other users.
                    <br />
                    <br />
                  </span>
                  <span className="span">
                    Headhunter
                    <br />
                  </span>
                  <span className="text-wrapper-62">
                    Discover talented individuals and explore their work.
                  </span>
                </p>

                <div className="frame-47">
                  <Component22
                    className="component-22-instance"
                    property1="frame-38"
                    to="/signu95up"
                  />
                  <Component23
                    className="component-23-instance"
                    property1="frame-38"
                    to="/signu95up"
                  />
                </div>
              </div>
            </div>
          </MotionDiv>
        </div>
      )}
    </AnimatePresence>
  );
};

export default SelectMode;
