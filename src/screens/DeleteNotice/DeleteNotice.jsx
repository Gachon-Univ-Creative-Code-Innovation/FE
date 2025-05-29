import React from "react";
import "./DeleteNotice.css";

export const DeleteNotice = ({ onCancel, onDeleteAll }) => {
  return (
    <div className="select-mode-screen">
      <div className="select-mode-screen__container">
        <div className="select-mode-screen__title">모두 삭제하시겠습니까?</div>

        <div className="select-mode-screen__description-wrapper">
          <p className="select-mode-screen__description">
            계속 진행하면 모든 항목이 삭제됩니다.
            <br />이 작업은 되돌릴 수 없습니다.
          </p>
        </div>

        <div className="select-mode-screen__button-group">
          <div className="select-mode-screen__button cancel" onClick={onCancel}>
            <div className="select-mode-screen__button-text">취소</div>
          </div>
          <div
            className="select-mode-screen__button delete"
            onClick={onDeleteAll}
          >
            <div className="select-mode-screen__button-text">전체 삭제</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteNotice;
