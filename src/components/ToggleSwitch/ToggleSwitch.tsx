import {useEffect, useState} from "react";
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
      className="theme-toggle"
      onClick={changeTheme}
      aria-label={`Color theme: ${theme}. Change theme`}
    >
      Theme: {theme}
    </button>
  );
}
