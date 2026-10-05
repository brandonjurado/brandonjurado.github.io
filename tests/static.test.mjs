import {test} from "node:test";
import assert from "node:assert/strict";
import {readFile} from "node:fs/promises";
import {createHash} from "node:crypto";
import {JSDOM} from "jsdom";
import sharp from "sharp";
const html = await readFile("dist/index.html", "utf8");
const document = new JSDOM(html, {url: "https://bjurado.com/"}).window.document;
test("crawler gets substantive content, semantic headings and working anchors", () => {
  assert.equal(document.querySelectorAll("h1").length, 1);
  for (const id of [
    "skills",
    "education",
    "experience",
    "achievements",
    "additional-projects",
    "contact"
  ]) {
    assert.ok(document.getElementById(id)?.textContent.trim().length > 50, id);
  }
  assert.equal(
    document.querySelectorAll('a[href="mailto:hello@bjurado.com"]').length > 0,
    true
  );
  for (const a of document.querySelectorAll('a[href^="#"],a[href^="/#"]'))
    assert.ok(document.getElementById(a.hash.slice(1)), a.href);
  assert.doesNotMatch(html, /enable JavaScript to run|opacity:0[;"]|<!--app-/);
});
test("metadata is unique, canonical and present in head; schema is valid", () => {
  assert.equal(document.head.querySelectorAll("title").length, 1);
  assert.equal(
    document.head.querySelectorAll('meta[name="description"]').length,
    1
  );
  assert.equal(
    document.querySelector('link[rel="canonical"]').href,
    "https://bjurado.com/"
  );
  assert.equal(document.querySelector('meta[name="keywords"]'), null);
  assert.match(
    document.querySelector('meta[name="viewport"]').content,
    /viewport-fit=cover/
  );
  const schema = JSON.parse(
    document.querySelector('script[type="application/ld+json"]').textContent
  );
  assert.deepEqual(
    schema["@graph"].map(item => item["@type"]),
    ["Person", "WebSite"]
  );
  assert.equal(schema["@graph"][0].sameAs.length, 2);
});
test("share card has real 1200×630 pixels and complete metadata", async () => {
  const {width, height} = await sharp("dist/share-card.png").metadata();
  assert.equal(width, 1200);
  assert.equal(height, 630);
  assert.equal(
    document.querySelector('meta[property="og:image:width"]').content,
    "1200"
  );
  assert.ok(document.querySelector('meta[name="twitter:image:alt"]').content);
});
test("404 is separate and noindex; sitemap contains only real canonical routes", async () => {
  const missing = new JSDOM(await readFile("dist/404.html", "utf8")).window
    .document;
  assert.match(missing.title, /Page not found/);
  assert.equal(
    missing.querySelector('meta[name="robots"]').content,
    "noindex, follow"
  );
  assert.equal(missing.getElementById("root").dataset.page, "404");
  assert.doesNotMatch(await readFile("dist/sitemap.xml", "utf8"), /#/);
});
test("all inline scripts are authorized by exact CSP hashes", async () => {
  const headers = await readFile("dist/_headers", "utf8");
  assert.doesNotMatch(headers, /script-src[^;]*unsafe-/);
  for (const script of document.querySelectorAll("script:not([src])")) {
    const hash = createHash("sha256")
      .update(script.textContent)
      .digest("base64");
    assert.ok(headers.includes(`'sha256-${hash}'`));
  }
  assert.match(headers, /max-age=31536000, immutable/);
});

test("cache rules never combine an immutable asset policy with HTML revalidation", async () => {
  const headers = await readFile("dist/_headers", "utf8");
  const globalRule = headers.split("\n/", 1)[0];
  assert.doesNotMatch(globalRule, /Cache-Control/);
  assert.match(
    headers,
    /\/assets\/\*\n {2}Cache-Control: public, max-age=31536000, immutable/
  );
  assert.match(
    headers,
    /\/index.html\n {2}Cache-Control: public, max-age=0, must-revalidate/
  );
});
