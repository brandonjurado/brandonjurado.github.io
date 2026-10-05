import {useEffect, useState} from "react";
import "./ToggleSwitch.scss";
type Theme = "system" | "light" | "dark";
export default function ToggleSwitch() {
  const [theme, setTheme] = useState<Theme>("system");
  useEffect(() => {
    const saved = document.documentElement.dataset.theme;
    if (saved === "dark" || saved === "light") setTheme(saved);
  }, []);
  function changeTheme() {
    const next =
      theme === "system" ? "light" : theme === "light" ? "dark" : "system";
    setTheme(next);
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
      data-theme={theme}
      onClick={changeTheme}
      aria-label={`Color theme: ${theme}. Change theme`}
    >
      <span className="theme-track" aria-hidden="true">
        <span className="theme-thumb">{theme === "dark" ? "🌜" : "☀️"}</span>
      </span>
    </button>
  );
}
