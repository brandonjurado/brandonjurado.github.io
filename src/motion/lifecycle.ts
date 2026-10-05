export interface MotionHandle {
  init(): void;
  pause(): void;
  destroy(): void;
}
type Connection = {saveData?: boolean};
export function motionAllowed(): boolean {
  const connection = (navigator as Navigator & {connection?: Connection})
    .connection;
  return (
    !connection?.saveData &&
    !matchMedia(
      "(prefers-reduced-motion: reduce), (prefers-reduced-data: reduce)"
    ).matches
  );
}
