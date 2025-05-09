import React from "react";
import XButton from "../../icons/XButton/XButton";
import DownloadIcon from "../../icons/DownloadIcon/DownloadIcon";
import RegenerateIcon from "../../icons/RegenerateIcon/RegenerateIcon";
import "./ShowReadme.css";

export const Readme = ({ onClose, image, url }) => {
  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = image;
    link.download = "readme-preview.png";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="readmepopup-container">
      <div className="readmepopup-header">
        <div className="readmepopup-title">{url}</div>
        <div className="readmepopup-actions">
          <div className="readmepopup-action-group">
            <RegenerateIcon
              size={20}
              color="white"
              className="readmepopup-icon"
            />
            <div className="readmepopup-label">Regenerate</div>
          </div>
          <div className="readmepopup-action-group" onClick={handleDownload}>
            <DownloadIcon
              size={20}
              color="white"
              className="readmepopup-icon"
            />
            <div className="readmepopup-label">Download</div>
          </div>
          <XButton
            className="readmepopup-x-button"
            color="white"
            onClick={onClose}
          />
        </div>
      </div>
      <div className="readmepopup-preview">
        <img
          src={image}
          alt="README Preview"
          className="readmepopup-preview-image"
        />
      </div>
    </div>
  );
};

export default Readme;
