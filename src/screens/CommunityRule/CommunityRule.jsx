import React from "react";
import XButton from "../../icons/XButton/XButton";
import "./CommunityRule.css";

export const CommunityRule = ({ onClose }) => {
  return (
    <div className="communityrule-screen" data-model-id="2101:912">
      <header className="communityrule-header">
        <button
          className="communityrule-x-button"
          onClick={onClose}
          aria-label="close"
        >
          <XButton />
        </button>
      </header>

      <div className="communityrule-wrapper">
        <p className="communityrule-text">
          <span className="communityrule-bold">
            AIOG 커뮤니티는 모두가 존중받으며 자유롭게 소통할 수 있는
            공간입니다.
            <br />
            아래의 규칙을 꼭 지켜주시고, 건강한 커뮤니티 문화를 함께 만들어가
            주세요.
            <br />
          </span>

          <span className="communityrule-regular">
            <br />
          </span>

          <span className="communityrule-bold">
            1. 기본적인 예의를 지켜주세요
            <br />
          </span>
          <span className="communityrule-regular">
            욕설, 비하, 혐오 표현은 금지됩니다.
            <br />
            특정 개인이나 집단에 대한 공격적인 언행은 허용되지 않습니다.
            <br />
            <br />
          </span>

          <span className="communityrule-bold">
            2. 타인의 권리를 존중해주세요
            <br />
          </span>
          <span className="communityrule-regular">
            타인의 개인정보(이름, 연락처, 사진 등)를 동의 없이 공유하지 마세요.
            <br />
            타인의 콘텐츠를 무단으로 복제, 공유, 도용하는 행위는 금지됩니다.
            <br />
            <br />
          </span>

          <span className="communityrule-bold">
            3. 건전한 커뮤니티 문화를 유지해주세요
            <br />
          </span>
          <span className="communityrule-regular">
            스팸성 글, 도배성 댓글, 광고 목적의 게시물은 삭제될 수 있습니다.
            <br />
            주제와 관련 없는 내용의 반복적인 게시도 자제해 주세요.
            <br />
            <br />
          </span>

          <span className="communityrule-bold">
            4. 불법적인 행위는 엄격히 금지됩니다
            <br />
          </span>
          <span className="communityrule-regular">
            불법 소프트웨어 공유, 범죄 유도, 저작권 침해 등은 법적 책임이 따를
            수 있습니다.
            <br />
            <br />
          </span>

          <span className="communityrule-bold">
            5. 분쟁은 차분하게, 신고는 책임감 있게
            <br />
          </span>
          <span className="communityrule-regular">
            불편한 상황이 생기면 직접 대응보다는 신고 기능을 이용해 주세요.
            <br />
            거짓 신고는 제재 대상이 될 수 있습니다.
            <br />
            <br />
          </span>

          <span className="communityrule-bold">
            6. 규칙 위반 시
            <br />
          </span>
          <span className="communityrule-regular">
            경고 없이 콘텐츠가 삭제되거나 계정 이용이 제한될 수 있습니다.
            <br />
            반복 위반 시, 영구 이용 정지 조치가 이루어질 수 있습니다.
          </span>
        </p>
      </div>
    </div>
  );
};

export default CommunityRule;
