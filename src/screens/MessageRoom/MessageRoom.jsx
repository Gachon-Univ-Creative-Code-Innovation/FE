import React, { useState } from "react";
import { useParams } from "react-router-dom";
import GoBackIcon from "../../icons/GoBackIcon/GoBackIcon";
import MessageExit from "../../icons/MessageExit/MessageExit";
import MessageInput from "../../components/MessageInputBox/MessageInputBox";
import CommunityRule from "../CommunityRule/CommunityRule";
import MessageRoomExit from "../MessageRoomExit/MessageRoomExit";
import PageTransitionWrapper from "../../components/PageTransitionWrapper/PageTransitionWrapper";
import "./MessageRoom.css";

export const MessageRoom = () => {
  const { id } = useParams();

  const [showRulePopup, setShowRulePopup] = useState(false);
  const [closingRule, setClosingRule] = useState(false);

  const [showExitPopup, setShowExitPopup] = useState(false);
  const [closingExit, setClosingExit] = useState(false);

  const openRulePopup = () => {
    setShowRulePopup(true);
    setClosingRule(false);
  };
  const closeRulePopup = () => {
    setClosingRule(true);
    setTimeout(() => setShowRulePopup(false), 250);
  };

  const openExitPopup = () => {
    setShowExitPopup(true);
    setClosingExit(false);
  };
  const closeExitPopup = () => {
    setClosingExit(true);
    setTimeout(() => setShowExitPopup(false), 250);
  };

  return (
    <PageTransitionWrapper>
      <div className="messageroom-screen">
        <div className="messageroom-view">
          <div className="messageroom-header">
            <div className="messageroom-back-wrapper">
              <GoBackIcon className="messageroom-back-icon" />
            </div>
            <div className="messageroom-username">쪼꼬 (ID: {id})</div>
            <div className="messageroom-link-wrapper">
              <MessageExit
                className="messageroom-link-icon"
                onClick={openExitPopup}
                style={{ cursor: "pointer" }}
              />
            </div>
          </div>

          <div className="messageroom-notice">
            <p className="messageroom-notice-text">
              서로가 존중받는 커뮤니티를 위해 이용규칙을 함께 지켜주세요.
              <br />
              규칙 위반 시 서비스 이용이 제한될 수 있어요.
            </p>
            <p
              className="messageroom-rule-link"
              onClick={openRulePopup}
              style={{ cursor: "pointer" }}
            >
              👉 커뮤니티 이용규칙 자세히 보기
            </p>
          </div>

          <div className="messageroom-chat">
            <div className="messageroom-date">
              <div className="messageroom-date-text">2025. 03. 07</div>
            </div>

            {[
              { time: "15:06", sender: "쪼꼬", message: "내일 머행?" },
              { time: "15:07", sender: "쪼꼬", message: "나랑 카페갈래?" },
              { time: "15:10", sender: "me", message: "응!!!!!" },
              { time: "16:07", sender: "쪼꼬", message: "나 잠와" },
              {
                time: "16:10",
                sender: "me",
                message: "언니는 왜 맨날 잠만 자",
              },
              {
                time: "16:47",
                sender: "쪼꼬",
                message: "맛있는거 먹으러 갈래?",
              },
            ].map((chat, idx) =>
              chat.sender === "me" ? (
                <div className="messageroom-my-message" key={idx}>
                  <div className="messageroom-time-right">{chat.time}</div>
                  <div className="messageroom-bubble-my">{chat.message}</div>
                </div>
              ) : (
                <div className="messageroom-other-message" key={idx}>
                  <div className="messageroom-profile">
                    <img src="/img/ellipse-12-12.png" alt="profile" />
                  </div>
                  <div className="messageroom-info">
                    <div className="messageroom-nickname">{chat.sender}</div>
                    <div className="messageroom-bubble-other">
                      {chat.message}
                    </div>
                  </div>
                  <div className="messageroom-time-left">{chat.time}</div>
                </div>
              )
            )}
          </div>

          <div className="messageroom-input-wrapper">
            <MessageInput className="messageroom-input-icon" />
          </div>
        </div>

        {showRulePopup && (
          <div className="messageroom-modal-overlay" onClick={closeRulePopup}>
            <div
              className={`messageroom-modal-content ${
                closingRule ? "fade-out" : "fade-in"
              }`}
              onClick={(e) => e.stopPropagation()}
            >
              <CommunityRule onClose={closeRulePopup} />
            </div>
          </div>
        )}

        {showExitPopup && (
          <div className="exitpopup-overlay" onClick={closeExitPopup}>
            <div
              className={`exitpopup-content ${
                closingExit ? "fade-out" : "fade-in"
              }`}
              onClick={(e) => e.stopPropagation()}
            >
              <MessageRoomExit onClose={closeExitPopup} />
            </div>
          </div>
        )}
      </div>
    </PageTransitionWrapper>
  );
};

export default MessageRoom;
