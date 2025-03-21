import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./styles/styles.css"
import "./styles/reset.css";
import { loadAuthFromSession } from "./services/authService";

loadAuthFromSession();

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
