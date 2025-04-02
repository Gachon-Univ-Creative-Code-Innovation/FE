import React from "react";
import { Link } from "react-router-dom";
import Checked from "../Checked/Checked";
import "./Loginstyle.css";

export const Login = () => {
  return (
    <div className="login">
      <div className="div-3">
        <div className="overlap-13">
          <button className="login-button">
            <div className="LOGIN">LOGIN</div>
          </button>
        </div>

        <div className="overlap-14">
          <div className="menu">
            <div className="overlap-group-6">
              <div className="sign-up">
                <div className="text-wrapper-37">Sign up</div>
              </div>

              <div className="forgot-username">
                <div className="text-wrapper-37">Forgot username?</div>
              </div>

              <div className="forgot-password">
                <div className="text-wrapper-37">Forgot password?</div>
              </div>
            </div>
          </div>
        </div>

        <div className="overlap-15">
          <div className="overlap-16">
            <div className="id">
              <div className="text-wrapper-38">id</div>
            </div>

            <div className="password">
              <div className="text-wrapper-38">password</div>
            </div>

            <Checked className="component" color="#D9D9D9" />
          </div>

          <div className="text-wrapper-39">Keep me logged in</div>
        </div>

        <div className="overlap-17">
          <Link to="/MainPageLoginBefore">
            <img className="vector" alt="Vector" src="/img/vector-2.svg" />
          </Link>
        </div>
        <div className="overlap-18">
          <img
            className="kakaotalk-sharing"
            alt="Kakaotalk sharing"
            src="/img/kakaotalk-sharing-btn-medium-ov-1.png"
          />

          <img
            className="web-light-rd-na"
            alt="Web light rd na"
            src="/img/web-light-rd-na-2x-1.png"
          />
        </div>
      </div>
    </div>
  );
};

export default Login;
