import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { App } from "./App";
import "./index.css";
import "normalize.css";

createRoot(document.getElementById("app")).render(
  <StrictMode>
    <App />
  </StrictMode>
);
