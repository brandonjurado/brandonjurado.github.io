import {test} from "node:test";
import assert from "node:assert/strict";
import {readFile, access} from "node:fs/promises";
import {createHash} from "node:crypto";
import {JSDOM} from "jsdom";
import sharp from "sharp";
import {transformWithEsbuild} from "vite";

const {code: portfolioCode} = await transformWithEsbuild(
  await readFile("src/content/portfolio.ts", "utf8"),
  "portfolio.ts",
  {loader: "ts", format: "esm"}
);
const {workExperiences, achievementSection, additionalProjects, educationInfo} =
  await import(
    `data:text/javascript;base64,${Buffer.from(portfolioCode).toString("base64")}`
  );
const html = await readFile("dist/index.html", "utf8");
const document = new JSDOM(html, {url: "https://bjurado.com/"}).window.document;
test("crawler gets substantive content, semantic headings and working anchors", () => {
  assert.equal(document.querySelectorAll("h1").length, 1);
  for (const id of [
    "skills",
    "systems",
    "education",
    "experience",
    "achievements",
    "additional-projects",
    "contact"
  ]) {
    assert.ok(document.getElementById(id)?.textContent.trim().length > 50, id);
  }
  assert.equal(document.getElementById("off-the-clock"), null);
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

test("current role opens; career descriptions, dates, and technologies remain complete", () => {
  const descriptions = [
    ...document.querySelectorAll(".experience-text-desc")
  ].map(node => node.textContent);
  assert.deepEqual(descriptions, [
    "At H-E-B Digital, I help build the event-driven notification platform behind curbside and order communications. My work centers on delivering near real-time, personalized alerts across the full order journey and scaling the platform to handle millions of promotional and transactional messages each day with the reliability those experiences require.",
    "Delivered billing and payments capabilities for T-Mobile for Business, shipping enterprise features while improving the health of core services through dependency remediation and major Java and Spring Boot upgrades. I also helped establish cleaner API development practices and built an invoicing solution for the Department of Education that integrated with legacy workflows and enabled a new revenue stream.",
    "At USAA, I built identity and access management capabilities that processed customer verification signals in real time. I contributed to login, registration, and password reset flows for USAA.com, integrated identity checks with credit agencies, and created internal tools that helped call center teams investigate and prevent suspected fraud.",
    "Played a hands-on role in modernizing the AA.com flight booking experience, helping move a core customer journey from a monolithic architecture to cloud-hosted microservices. That shift improved scalability, resilience, and performance for a platform serving millions of travelers.",
    "Researched frontend approaches for a new product by prototyping applications with frameworks like React and evaluating what best matched the business use case. Alongside that exploration, I built internal LAMP-stack tools used to track development work across the organization.",
    "Led full-stack development of a web-based nutrient tracking platform from concept through delivery. I owned the frontend, backend services, databases, Linux infrastructure, and hosting footprint, while also bringing UX considerations into the product and mentoring junior developers on MVC-based application design.",
    "Helped improve web application quality through a mix of exploratory testing, automated test development, debugging, and frontend support work. The role combined hands-on QA with practical engineering tasks so issues were identified early, corrected efficiently, and aligned with what the client actually needed."
  ]);
  const roles = [...document.querySelectorAll("#experience details")];
  assert.equal(roles.length, 7);
  assert.equal(roles[0].open, true);
  assert.ok(roles.slice(1).every(role => !role.open));
  const description = roles[0].querySelector(".experience-text-desc");
  assert.ok(
    description.compareDocumentPosition(
      roles[0].querySelector(".career-trace__technology-label")
    ) & 4,
    "current description precedes technology inventory"
  );
  for (const [index, expected] of workExperiences.experience.entries()) {
    const role = roles[index];
    const summary = role.querySelector("summary");
    assert.ok(summary.textContent.includes(expected.company), expected.company);
    assert.ok(summary.textContent.includes(expected.role), expected.role);
    assert.equal(
      summary.querySelector(".experience-text-date").textContent,
      expected.date
    );
    assert.deepEqual(
      [...role.querySelectorAll(".career-trace__technologies li")].map(
        item => item.textContent
      ),
      expected.descBullets,
      `${expected.company}: complete technology coverage`
    );
    assert.equal(
      document
        .getElementById(summary.getAttribute("aria-controls"))
        ?.textContent.includes(expected.desc),
      true,
      `${expected.company}: linked disclosure content`
    );
  }
});

test("earlier builds retain external links and education shows only credentials", () => {
  const featuredLinks = achievementSection.achievementsCards.flatMap(build =>
    build.footerLink.map(link => link.url)
  );
  const additionalLinks = additionalProjects.items.flatMap(project =>
    project.links.map(link => link.url)
  );
  const moreBuilds = document.getElementById("additional-projects");
  assert.equal(moreBuilds.tagName, "DETAILS");
  assert.ok(
    moreBuilds.querySelector("summary").textContent.includes("More builds")
  );
  for (const url of [...featuredLinks, ...additionalLinks]) {
    const link = document.querySelector(`#achievements a[href="${url}"]`);
    assert.ok(link?.textContent.trim(), `preserved external link: ${url}`);
  }
  assert.deepEqual(
    [...moreBuilds.querySelectorAll("a")].map(link => link.href).sort(),
    additionalLinks.toSorted()
  );
  const education = document.getElementById("education");
  for (const school of educationInfo.schools) {
    for (const value of [school.schoolName, school.subHeader, school.duration])
      assert.ok(education.textContent.includes(value), value);
    for (const activity of school.descBullets) {
      assert.equal(education.textContent.includes(activity), false, activity);
    }
  }
});

test("proof, capabilities, navigation, and illustrative systems remain available to crawlers", () => {
  assert.equal(document.querySelectorAll(".overview-proof li").length, 4);
  assert.equal(document.querySelectorAll(".capability").length, 4);
  assert.equal(document.querySelectorAll(".footer-wordmark").length, 0);
  assert.equal(document.querySelector('a[href="/resume.pdf"]'), null);
  assert.match(
    document.querySelector(".request-trace__description").textContent,
    /illustrative/
  );
  assert.equal(document.documentElement.dataset.theme, "dark");
  assert.deepEqual(
    [...document.querySelectorAll(".navigation a")].map(link => link.hash),
    ["#greeting", "#skills", "#systems", "#experience", "#contact"]
  );
  for (const link of document.querySelectorAll(".navigation a")) {
    assert.equal(link.getAttribute("role"), null);
    assert.notEqual(link.getAttribute("tabindex"), "-1");
  }
  assert.equal(
    document.querySelector(".navigation .rubber-segment__thumb"),
    null
  );
  assert.equal(
    document.querySelector(".navigation a[aria-current='location']")?.hash,
    "#greeting"
  );
  assert.equal(document.querySelector(".navigation [role='radiogroup']"), null);
  const tabs = [...document.querySelectorAll('[role="tab"]')];
  assert.deepEqual(
    tabs.map(tab => tab.textContent),
    ["Notifications", "Identity", "Billing", "Booking"]
  );
  for (const tab of tabs) {
    const panel = document.getElementById(tab.getAttribute("aria-controls"));
    assert.equal(panel.getAttribute("role"), "tabpanel");
    assert.equal(panel.getAttribute("aria-labelledby"), tab.id);
    assert.ok(panel.querySelector("h3").textContent.length > 20);
    const diagram = panel.querySelector("figure");
    assert.match(
      document.getElementById(diagram.getAttribute("aria-describedby"))
        .textContent,
      /illustrative/i
    );
    assert.doesNotMatch(panel.textContent, /\bTODO\b/);
  }
});

test("résumé stays unpublished until a redacted copy is supplied", async () => {
  await assert.rejects(access("dist/resume.pdf"), {code: "ENOENT"});
  assert.equal(document.querySelector("a[download]"), null);
});

test("current role dates agree with the authoritative résumé", () => {
  const dates = [...document.querySelectorAll(".experience-text-date")].map(
    node => node.textContent
  );
  assert.ok(dates.includes("July 2021 – July 2023"));
  assert.ok(dates.includes("May 2018 – July 2019"));
  assert.doesNotMatch(html, /Platform Infrastructure|nearly 40 hours/);
});
