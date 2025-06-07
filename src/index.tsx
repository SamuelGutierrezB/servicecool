import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import Parse from "parse";

// Configuración moderna de Parse (v3.0+)
Parse.initialize(
  process.env.REACT_APP_PARSE_APP_ID || "",
  process.env.REACT_APP_PARSE_JS_KEY || ""
);
Parse.serverURL =
  process.env.REACT_APP_PARSE_SERVER_URL || "https://parseapi.back4app.com/";

// Solución para instalaciones (nuevo método)
if (typeof window !== "undefined") {
  Parse.CoreManager.set("STORAGE", localStorage); // Configura localStorage directamente
}

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

reportWebVitals();
