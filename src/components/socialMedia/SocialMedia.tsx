import {socialMediaLinks} from "../../content/portfolio";
export default function SocialMedia() {
  return (
    <div className="social-links">
      <a href={socialMediaLinks.linkedin}>LinkedIn</a>
      <a href={socialMediaLinks.github}>GitHub</a>
      <a href={`mailto:${socialMediaLinks.gmail}`}>Email Brandon</a>
    </div>
  );
}
