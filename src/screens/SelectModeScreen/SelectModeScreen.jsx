import React from "react";
import "./SelectModeScreen.css";

export const SelectModeScreen = ({ onCancel, onDeleteAll }) => {
  return (
    <div className="select-mode-screen">
      <div className="select-mode-screen__container">
        <div className="select-mode-screen__title">Remove Everything?</div>

        <div className="select-mode-screen__description-wrapper">
          <p className="select-mode-screen__description">
            If you continue, everything will be removed.
            <br />
            This cannot be undone.
          </p>
        </div>

        <div className="select-mode-screen__button-group">
          <div className="select-mode-screen__button cancel" onClick={onCancel}>
            <div className="select-mode-screen__button-text">Cancel</div>
          </div>
          <div
            className="select-mode-screen__button delete"
            onClick={onDeleteAll}
          >
            <div className="select-mode-screen__button-text">Delete ALL</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SelectModeScreen;
