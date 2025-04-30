import React from "react";
import ReactDOM from "react-dom/client"; // For React 18+
import App from "./App"; // Your main App component
import "./index.css"; // Global styles (if you have any)

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
