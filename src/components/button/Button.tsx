import "./Button.scss";
type Props = {text: string; className?: string; href: string; newTab?: boolean};
export default function Button({text, className, href, newTab}: Props) {
  return (
    <div className={className}>
      <a
        className="main-button"
        href={href}
        target={newTab ? "_blank" : undefined}
        rel={newTab ? "noopener noreferrer" : undefined}
      >
        {text}
      </a>
    </div>
  );
}
