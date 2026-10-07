import {site} from "../../content/site";
import {navigation} from "../../content/sections";
import {useAmbientMotion} from "../../motion/useAmbientMotion";
import "./Header.scss";
export default function Header() {
  const {ref, motion} = useAmbientMotion();
  return (
    <header ref={ref} className="header" data-motion={motion}>
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <a className="header-brand" href="#greeting">
        <span className="header-brand__bracket" aria-hidden="true">
          &lt;
        </span>
        <span className="header-brand__signature">{site.name}</span>
        <span className="header-brand__bracket" aria-hidden="true">
          /&gt;
        </span>
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
