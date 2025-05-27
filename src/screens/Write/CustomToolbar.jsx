import React from "react";

const customFonts = [
  "roboto", 
  "open-sans", 
  "lora", 
  "merriweather", 
  "inter", 
  "montserrat", 
  "noto-sans", 
  "playfair-display", 
  "source-sans-pro", 
  "georgia"
];



export const CustomToolbar = () => (
  <div id="toolbar"> {/* 반드시 ID를 "toolbar"로 설정 */}
    <span className="ql-formats">
      <select className="ql-font">
        <option value="">기본 폰트</option>
        <option value="roboto">Roboto</option>
        <option value="open-sans">Open Sans</option>
        <option value="lora">Lora</option>
        <option value="merriweather">Merriweather</option>
        <option value="inter">Inter</option>
        <option value="montserrat">Montserrat</option>
        <option value="noto-sans">Noto Sans</option>
        <option value="playfair-display">Playfair Display</option>
        <option value="source-sans-pro">Source Sans Pro</option>
        <option value="georgia">Georgia</option>
      </select>

    </span>
    <span className="ql-formats">
      <select className="ql-header">
        <option value="1">Header 1</option>
        <option value="2">Header 2</option>
        <option value="3">Header 3</option>
        <option value="4">Header 4</option>
        <option value="5">Header 5</option>
        <option value="6">Header 6</option>
      </select>
    </span>
    <span className="ql-formats">
      <button className="ql-bold" />
      <button className="ql-italic" />
      <button className="ql-underline" />
      <button className="ql-strike" />
      <button className="ql-blockquote" />
    </span>
    <span className="ql-formats">
      <button className="ql-link" />
      <button className="ql-image" />
      <button className="ql-video" />
    </span>
    <span className="ql-formats">
      <button className="ql-clean" />
    </span>
    
  </div>
);

export default CustomToolbar;
