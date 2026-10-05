import {socialMediaLinks} from "../../content/portfolio";
import Icon, {type IconName} from "../icon/Icon";
import "./SocialMedia.scss";
const links: readonly {
  icon: IconName;
  label: string;
  href: string;
  className: string;
}[] = [
  {
    icon: "github",
    label: "GitHub",
    href: socialMediaLinks.github,
    className: "github"
  },
  {
    icon: "linkedin",
    label: "LinkedIn",
    href: socialMediaLinks.linkedin,
    className: "linkedin"
  },
  {
    icon: "email",
    label: "Email Brandon",
    href: `mailto:${socialMediaLinks.gmail}`,
    className: "google"
  }
];
export default function SocialMedia() {
  if (!socialMediaLinks.display) return null;
  return (
    <div className="social-media-div">
      {links.map(({icon, label, href, className}) => (
        <a
          key={icon}
          href={href}
          className={`icon-button ${className}`}
          aria-label={label}
          target={icon === "email" ? undefined : "_blank"}
          rel={icon === "email" ? undefined : "noopener noreferrer"}
        >
          <Icon name={icon} className="icon" />
        </a>
      ))}
    </div>
  );
}
