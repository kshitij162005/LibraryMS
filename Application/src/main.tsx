import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

// Set dark mode by default
if (localStorage.getItem("theme") !== "light") {
  document.documentElement.classList.add("dark");
} else {
  document.documentElement.classList.remove("dark");
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);