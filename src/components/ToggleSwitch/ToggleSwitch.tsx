import {useEffect, useState} from "react";
import "./ToggleSwitch.scss";

export default function ToggleSwitch() {
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    setIsDark(document.documentElement.dataset.theme !== "light");
  }, []);

  function changeTheme() {
    const next = isDark ? "light" : "dark";
    setIsDark(!isDark);
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem("theme", next);
    } catch {
      /* Storage is optional. */
    }
  }

  return (
    <button
      type="button"
      className="theme-toggle"
      data-theme={isDark ? "dark" : "light"}
      onClick={changeTheme}
      aria-label={`Color theme: ${isDark ? "dark" : "light"}. Change theme`}
    >
      <span className="theme-track" aria-hidden="true">
        <span className="theme-thumb">{isDark ? "🌜" : "☀️"}</span>
      </span>
    </button>
  );
}
