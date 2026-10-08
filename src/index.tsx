import {createRoot, hydrateRoot} from "react-dom/client";
import "./index.scss";
import App from "./App";
const container = document.getElementById("root");
if (!container) throw new Error("Missing root element");
const app = <App notFound={container.dataset.page === "404"} />;
if (container.dataset.prerendered === "true") hydrateRoot(container, app);
else createRoot(container).render(app);

if (import.meta.env.PROD && typeof window !== "undefined") {
  const scheduleConsoleGreeting = () => {
    const load = () => {
      void import("./console-easter-egg")
        .then(({printConsoleGreeting, installBrandonApi}) => {
          printConsoleGreeting();
          installBrandonApi();
        })
        .catch(() => {
          // A missing optional console chunk must not affect the page.
        });
    };
    if (typeof window.requestIdleCallback === "function")
      window.requestIdleCallback(load);
    else window.setTimeout(load, 0);
  };
  if (document.readyState === "complete") scheduleConsoleGreeting();
  else window.addEventListener("load", scheduleConsoleGreeting, {once: true});
}
