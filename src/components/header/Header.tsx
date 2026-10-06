import {site} from "../../content/site";
import {navigation} from "../../content/sections";
import "./Header.scss";
export default function Header() {
  return (
    <header className="header">
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <a className="header-brand" href="#greeting">
        {site.name}
      </a>
      <nav aria-label="Primary" className="navigation">
        {navigation.map(link => (
          <a key={link.href} href={link.href}>
            {link.label}
          </a>
        ))}
      </nav>
      <a className="availability" href="#contact">
        <span className="status-dot" aria-hidden="true" />
        {site.availabilityLabel}
      </a>
    </header>
  );
}
