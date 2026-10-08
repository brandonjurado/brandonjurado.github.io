import {
  ASCII_ART,
  EMAIL,
  EMAIL_COPIED,
  EMAIL_COPY_FAILED,
  EMAIL_STYLE,
  GREETING,
  GREETING_STYLE,
  HELP,
  STACK,
  WHOAMI
} from "./content/console-easter-egg";

type BrandonApi = Readonly<{
  help: () => void;
  whoami: () => void;
  stack: () => void;
  email: () => void;
}>;

declare global {
  interface Window {
    readonly brandon?: BrandonApi;
  }
}

let greeted = false;
const escapePercent = (value: string) => value.replace(/%/g, "%%");

export function printConsoleGreeting(): void {
  if (!import.meta.env.PROD || typeof window === "undefined" || greeted) return;
  greeted = true;

  const greeting = escapePercent(GREETING)
    .replace("\n", "%c\n")
    .replace(EMAIL, `%c${EMAIL}%c`);

  console.log(
    `${escapePercent(ASCII_ART)}\n\n%c${greeting}`,
    GREETING_STYLE,
    "",
    EMAIL_STYLE,
    ""
  );
}

export function installBrandonApi(): void {
  if (
    !import.meta.env.PROD ||
    typeof window === "undefined" ||
    Object.prototype.hasOwnProperty.call(window, "brandon")
  ) {
    return;
  }

  Object.defineProperty(window, "brandon", {
    value: Object.freeze({
      help() {
        console.log(escapePercent(HELP));
      },
      whoami() {
        console.log(escapePercent(WHOAMI));
      },
      stack() {
        console.log(escapePercent(STACK));
      },
      email() {
        void (async () => {
          let message = EMAIL_COPIED;
          try {
            await navigator.clipboard.writeText(EMAIL);
          } catch {
            message = EMAIL_COPY_FAILED;
          }
          console.log(escapePercent(message));
        })();
      }
    } satisfies BrandonApi),
    enumerable: false
  });
}
