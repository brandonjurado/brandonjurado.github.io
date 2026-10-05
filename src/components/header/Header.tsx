import {useRef, useState} from "react";
import {flushSync} from "react-dom";
import ToggleSwitch from "../ToggleSwitch/ToggleSwitch";
import "./Header.scss";
const links = [
  ["Skills", "skills"],
  ["Education", "education"],
  ["Experience", "experience"],
  ["Projects", "additional-projects"],
  ["Achievements", "achievements"],
  ["Contact", "contact"]
] as const;
export default function Header() {
  const menuButton = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);
  return (
    <header className="header">
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <a className="logo" href="/">
        <span className="grey-color" aria-hidden="true">
          &lt;
        </span>
        <span className="logo-name">Brandon Jurado</span>
        <span className="grey-color" aria-hidden="true">
          /&gt;
        </span>
      </a>
      <button
        ref={menuButton}
        type="button"
        aria-label="Menu"
        className="nav-toggle"
        aria-expanded={open}
        aria-controls="primary-nav"
        onClick={() => setOpen(!open)}
      >
        <span className="navicon" aria-hidden="true" />
      </button>
      <nav
        id="primary-nav"
        aria-label="Primary"
        className={open ? "navigation is-open" : "navigation"}
        onKeyDown={event => {
          if (event.key === "Escape") {
            setOpen(false);
            menuButton.current?.focus();
          }
        }}
      >
        {links.map(([label, id]) => (
          <a
            key={id}
            href={`#${id}`}
            onClick={() => flushSync(() => setOpen(false))}
          >
            {label}
          </a>
        ))}
        <ToggleSwitch />
      </nav>
    </header>
  );
}
