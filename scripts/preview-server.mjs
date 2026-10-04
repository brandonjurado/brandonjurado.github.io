// Production artifact preview with the generated headers and real 404 semantics.
import {createServer} from "node:http";
import {readFile, stat} from "node:fs/promises";
import {resolve, extname, sep} from "node:path";
import {gzipSync} from "node:zlib";
const root = resolve("dist");
const rules = [];
for (const line of (await readFile(resolve(root, "_headers"), "utf8")).split(
  "\n"
)) {
  if (line.startsWith("/")) rules.push({path: line.trim(), headers: {}});
  else if (line.trim()) {
    const index = line.indexOf(":");
    rules.at(-1).headers[line.slice(0, index).trim()] = line
      .slice(index + 1)
      .trim();
  }
}
const types = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
  ".png": "image/png",
  ".woff2": "font/woff2",
  ".xml": "application/xml",
  ".txt": "text/plain",
  ".ico": "image/x-icon"
};
const server = createServer(async (request, response) => {
  try {
    const path = decodeURIComponent(
      new URL(request.url, "http://localhost").pathname
    );
    let file = resolve(root, `.${path === "/" ? "/index.html" : path}`);
    if (!file.startsWith(root + sep) || path.includes("/.")) {
      response.writeHead(404);
      response.end();
      return;
    }
    let status = 200;
    if (!(await stat(file).catch(() => null))?.isFile()) {
      file = resolve(root, "404.html");
      status = 404;
    }
    const headers = {"Cache-Control": "public, max-age=0, must-revalidate"};
    for (const rule of rules) {
      const matches = rule.path.endsWith("*")
        ? path.startsWith(rule.path.slice(0, -1))
        : path === rule.path;
      if (matches && (status === 200 || rule.path === "/*"))
        Object.assign(headers, rule.headers);
    }
    headers["Content-Type"] =
      types[extname(file)] || "application/octet-stream";
    let body = await readFile(file);
    if (/gzip/.test(request.headers["accept-encoding"] || "")) {
      body = gzipSync(body);
      headers["Content-Encoding"] = "gzip";
      headers.Vary = "Accept-Encoding";
    }
    headers["Content-Length"] = body.length;
    response.writeHead(status, headers);
    response.end(request.method === "HEAD" ? undefined : body);
  } catch {
    response.writeHead(400);
    response.end("Bad request");
  }
});
server.listen(
  Number(process.env.PORT || 4173),
  process.env.HOST || "127.0.0.1",
  () =>
    console.log(
      `Production preview ready at http://127.0.0.1:${process.env.PORT || 4173}`
    )
);
