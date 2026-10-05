import {renderToString} from "react-dom/server";
import App from "./App";
export function render(notFound = false) {
  return renderToString(<App notFound={notFound} />);
}
