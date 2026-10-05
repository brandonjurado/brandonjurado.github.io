import {icons} from "./icons";
export type IconName = keyof typeof icons;
export default function Icon({
  name,
  className
}: {
  name: IconName;
  className?: string;
}) {
  const icon = icons[name];
  return (
    <svg
      className={className}
      viewBox={`0 0 ${icon.width} ${icon.height}`}
      fill="currentColor"
      width="1em"
      height="1em"
      aria-hidden="true"
      focusable="false"
    >
      {icon.paths.map((path, index) => (
        <path key={index} d={path} />
      ))}
    </svg>
  );
}
