import {readFile, writeFile, rm} from "node:fs/promises";
import {createHash} from "node:crypto";
import {render} from "../.prerender/entry-server.mjs";
const template = await readFile("dist/index.html", "utf8");
if (!template.includes("<!--app-html-->"))
  throw new Error("Missing prerender outlet");
const scriptHashes = new Set();
for (const notFound of [false, true]) {
  const tags = [];
  const body = render(notFound).replace(
    /<title>[\s\S]*?<\/title>|<meta\s[^>]*\/>|<link\s[^>]*\/>/g,
    tag => {
      tags.push(tag);
      return "";
    }
  );
  const html = template
    .replace(
      '<div id="root">',
      `<div id="root" data-prerendered="true" data-page="${notFound ? "404" : "home"}">`
    )
    .replace("<!--app-head-->", tags.join("\n"))
    .replace("<!--app-html-->", body);
  if (!notFound)
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
  for (const match of html.matchAll(
    /<script(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/g
  ))
    scriptHashes.add(
      `'sha256-${createHash("sha256").update(match[1]).digest("base64")}'`
    );
  await writeFile(notFound ? "dist/404.html" : "dist/index.html", html);
}
const headers = `/*
  ${process.env.CONTEXT === "deploy-preview" ? "X-Robots-Tag: noindex\n  " : ""}Cache-Control: public, max-age=0, must-revalidate
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=()
  Strict-Transport-Security: max-age=31536000
  Content-Security-Policy: default-src 'self'; script-src 'self' ${[...scriptHashes].join(" ")}; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; connect-src 'self'; object-src 'none'; base-uri 'self'; frame-ancestors 'none'; form-action 'self'; upgrade-insecure-requests
/assets/*
  Cache-Control: public, max-age=31536000, immutable
`;
await writeFile("dist/_headers", headers);
await rm(".prerender", {recursive: true, force: true});
