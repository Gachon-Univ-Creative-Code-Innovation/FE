import React, { useState } from "react";
import XButton from "../../icons/XButton/XButton";
import DownloadIcon from "../../icons/DownloadIcon/DownloadIcon";
import RegenerateIcon from "../../icons/RegenerateIcon/RegenerateIcon";
import ReactMarkdown from "react-markdown";
import api from "../../api/local-instance";
import "./ShowReadme.css";

export const Readme = ({ onClose, markdown, url, onRegenerate }) => {
  const [regenerating, setRegenerating] = useState(false);

  const handleDownload = () => {
    const blob = new Blob([markdown], { type: "text/markdown" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "README.md";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleRegenerate = async () => {
    if (!url) return;
    setRegenerating(true);
    try {
      const apiUrl = `http://localhost:8000/api/github-service/readme`;
      // const apiUrl = `http://a6b22e375302341608e5cefe10095821-1897121300.ap-northeast-2.elb.amazonaws.com:8000/api/github-service/readme`;
      const response = await api.post(apiUrl, { git_url: url }, {
          headers: {
            Accept: "application/json",
          },
        }
      );
      if (response.data.status !== 200 || !response.data.data)
        throw new Error("README 정보를 불러오지 못했습니다.");
      const downloadUrl = response.data.data;
      if (!downloadUrl) throw new Error("README 다운로드 URL이 없습니다.");
      const mdResp = await fetch(downloadUrl);
      if (!mdResp.ok) throw new Error("README 파일을 불러오지 못했습니다.");
      const newMarkdown = await mdResp.text();
      if (onRegenerate) onRegenerate(newMarkdown);
    } catch (e) {
      alert("README를 다시 불러오지 못했습니다.\n" + (e.message || e));
    } finally {
      setRegenerating(false);
    }
  };

  return (
    <div className="readmepopup-container">
      <div className="readmepopup-header">
        <div className="readmepopup-title">{url}</div>
        <div className="readmepopup-actions">
          <div className="readmepopup-action-group" onClick={handleRegenerate} style={{ opacity: regenerating ? 0.5 : 1, pointerEvents: regenerating ? 'none' : 'auto' }}>
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
        <div className="readmepopup-markdown-viewer">
          <ReactMarkdown>{markdown}</ReactMarkdown>
        </div>
      </div>
    </div>
  );
};

export default Readme;
