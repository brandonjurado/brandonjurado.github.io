import {readFile, writeFile, rm} from "node:fs/promises";
import {render} from "../.prerender/entry-server.mjs";

const template = await readFile("dist/index.html", "utf8");
if (!template.includes("<!--app-html-->"))
  throw new Error("Missing prerender outlet");
const html = template
  .replace('<div id="root">', '<div id="root" data-prerendered="true">')
  .replace("<!--app-html-->", render());
for (const content of [
  'id="experience"',
  'id="skills"',
  'id="contact"',
  "H-E-B",
  "Tarleton"
]) {
  if (!html.includes(content))
    throw new Error(`Missing static content: ${content}`);
}
await writeFile("dist/index.html", html);
await rm(".prerender", {recursive: true, force: true});
