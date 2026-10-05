import {createRoot, hydrateRoot} from "react-dom/client";
import "./index.scss";
import App from "./App";
const container = document.getElementById("root");
if (!container) throw new Error("Missing root element");
const app = <App notFound={container.dataset.page === "404"} />;
if (container.dataset.prerendered === "true") hydrateRoot(container, app);
else createRoot(container).render(app);
