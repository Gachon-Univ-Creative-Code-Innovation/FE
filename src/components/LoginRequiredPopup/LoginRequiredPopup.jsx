import { motion } from "framer-motion";
import "./LoginRequiredPopup.css";

const MDiv = motion.div;

const LoginRequiredPopup = ({ onClose }) => {
  return (
    <MDiv
      className="login-required-popup"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <MDiv
        className="login-required-popup__container"
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ duration: 0.25 }}
      >
        <div className="login-required-popup__title">Login Required</div>

        <div className="login-required-popup__description-wrapper">
          <p className="login-required-popup__description">
            You need to be logged in to use this feature.
            <br />
            Please log in and try again.
          </p>
        </div>

        <div className="login-required-popup__button-group">
          <div className="login-required-popup__button" onClick={onClose}>
            <div className="login-required-popup__button-text">OK</div>
          </div>
        </div>
      </MDiv>
    </MDiv>
  );
};

export default LoginRequiredPopup;
