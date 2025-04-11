import React from "react";
import Component30 from "../../components/Component30/Component30";
import Component31 from "../../components/Component31/Component31";
import PropertySelectedWrapper from "../../components/PropertySelectedWrapper/PropertySelectedWrapper";
import Component18 from "../../icons//Component20/Component20";
import InterfaceTrashFull from "../../icons/InterfaceTrashFull/InterfaceTrashFull";
import "./Notice.css";

export const Notice = () => {
  return (
    <div className="notice">
      <div className="div-6">
        <div className="post-list-4">
          <div className="frame-63">
            <div className="frame-64">
              <PropertySelectedWrapper
                className="component-62"
                property1="selected"
              />
              <Component30 className="component-62" property1="default" />
              <Component31 className="component-62" property1="default" />
            </div>

            <InterfaceTrashFull className="interface-trash-full" />
          </div>

          <div className="post-list-5">
            <div className="frame-65">
              <div className="comment-9">
                <div className="text-wrapper-75">Notice 1</div>
              </div>

              <div className="text-wrapper-76">2025.03.23</div>
            </div>

            <div className="frame-65">
              <div className="comment-9">
                <div className="text-wrapper-75">Notice 2</div>
              </div>

              <div className="text-wrapper-76">2025.03.23</div>
            </div>

            <div className="frame-65">
              <div className="comment-9">
                <div className="text-wrapper-75">Notice 3</div>
              </div>

              <div className="text-wrapper-76">2025.03.23</div>
            </div>

            <div className="frame-65">
              <div className="comment-9">
                <div className="text-wrapper-75">Notice 4</div>
              </div>

              <div className="text-wrapper-76">2025.03.23</div>
            </div>

            <div className="frame-65">
              <div className="comment-9">
                <div className="text-wrapper-75">Notice 5</div>
              </div>

              <div className="text-wrapper-76">2025.03.23</div>
            </div>

            <div className="frame-65">
              <div className="comment-9">
                <div className="text-wrapper-77">Notice 6</div>
              </div>

              <div className="text-wrapper-78">2025.03.23</div>
            </div>

            <div className="frame-65">
              <div className="comment-9">
                <div className="text-wrapper-77">Notice 7</div>
              </div>

              <div className="text-wrapper-78">2025.03.23</div>
            </div>
          </div>
        </div>

        <div className="frame-66">
          <div className="component-wrapper">
            <Component18 className="component-63" />
          </div>

          <img
            className="alog-logo-6"
            alt="Alog logo"
            src="/img/alog-logo.png"
          />

          <div className="frame-67">
            <img className="icon-5" alt="Icon" src="/img/icon.svg" />

            <img
              className="rectangle-15"
              alt="Rectangle"
              src="/img/rectangle-13.svg"
            />

            <div className="interface-trash-full">
              <img className="group-18" alt="Group" src="/img/group.png" />

              <div className="group-19">
                <div className="group-20">
                  <img
                    className="group-21"
                    alt="Group"
                    src="/img/group-1.png"
                  />

                  <img
                    className="group-22"
                    alt="Group"
                    src="/img/group-11.png"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Notice;
