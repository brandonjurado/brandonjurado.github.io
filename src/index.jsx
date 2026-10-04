import React from "react";
import {createRoot, hydrateRoot} from "react-dom/client";
import "./index.css";
import App from "./App";

const container = document.getElementById("root");
if (container.dataset.prerendered === "true") {
  hydrateRoot(container, <App />);
} else {
  createRoot(container).render(<App />);
}
