import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

import "./css/global.css";
import "./css/variables.css";
import "./css/animations.css";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);