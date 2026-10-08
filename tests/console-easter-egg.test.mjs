import {test} from "node:test";
import assert from "node:assert/strict";
import {readFile} from "node:fs/promises";
import {runInNewContext} from "node:vm";
import {build} from "esbuild";
import {transformWithEsbuild} from "vite";

const {code} = await transformWithEsbuild(
  await readFile("src/content/console-easter-egg.ts", "utf8"),
  "console-easter-egg.ts",
  {loader: "ts", format: "esm"}
);
const content = await import(
  `data:text/javascript;base64,${Buffer.from(code).toString("base64")}`
);
const bundles = new Map();
async function runtime({production = true, browser = true, clipboard} = {}) {
  if (!bundles.has(production)) {
    const result = await build({
      entryPoints: ["src/console-easter-egg.ts"],
      bundle: true,
      write: false,
      format: "cjs",
      platform: "browser",
      define: {"import.meta.env.PROD": String(production)}
    });
    bundles.set(production, result.outputFiles[0].text);
  }
  const logs = [];
  const window = {};
  const context = {
    console: {log: (...args) => logs.push(args)},
    navigator: {clipboard},
    ...(browser ? {window} : {})
  };
  const evaluate = () => {
    const module = {exports: {}};
    runInNewContext(bundles.get(production), {
      ...context,
      module,
      exports: module.exports
    });
    return module.exports;
  };
  return {exports: evaluate(), evaluate, window, logs};
}

test("console assets match the approved copy byte for byte", () => {
  assert.deepEqual(
    {...content},
    {
      ASCII_ART: `  trace_id  c0ffeebada555ca1ab1e0ddba11cafe0
  status    200 OK
  ----------------------------------------------
  you           |##############################|  <- root span
    gateway     |.############################.|
      auth      |..####........................|
      service   |.......##################.....|
        db      |..........##########..........|`,
      GREETING: `You found the part of this site that isn't in the sitemap.

Most visitors never open the console. The ones who do are usually
people I'd like to work with: curious, a little suspicious, reading
the logs when nobody asked them to.

Every trace has a root span. In this one, it's you.

If you build things, break things, or just like talking shop about
reliable systems, say hello:

  hello@bjurado.com

(type brandon.help() for more)`,
      HELP: `brandon.help()

  whoami()   who's behind this site
  stack()    what I work with
  email()    copy my email address`,
      WHOAMI: `Brandon Jurado
Senior software engineer, Austin TX. Backend, mostly Java.`,
      STACK: `Java, Kotlin, TypeScript
Spring Boot, Kafka, MySQL, DynamoDB
AWS, Terraform, Docker, Kubernetes, Datadog`,
      EMAIL: "hello@bjurado.com",
      EMAIL_COPIED: "Copied hello@bjurado.com to your clipboard.",
      EMAIL_COPY_FAILED:
        "Couldn't reach the clipboard from here. Copy it by hand: hello@bjurado.com",
      GREETING_STYLE: "color: #4F86E8; font-size: 16px; font-weight: bold;",
      EMAIL_STYLE: "color: #4F86E8; font-weight: bold;"
    }
  );
  for (const line of content.ASCII_ART.split("\n"))
    assert.ok(line.length <= 64, `ASCII width: ${line.length}`);
});

test("production greeting is one styled console entry, printed once", async () => {
  const {exports, logs} = await runtime();
  assert.equal(exports.printConsoleGreeting(), undefined);
  assert.equal(exports.printConsoleGreeting(), undefined);
  assert.equal(logs.length, 1);
  const [format, ...styles] = logs[0];
  assert.equal(
    format.replaceAll("%c", ""),
    `${content.ASCII_ART}\n\n${content.GREETING}`
  );
  assert.equal(format.split(content.EMAIL).length - 1, 1);
  const segments = format.split("%c");
  assert.equal(segments.length, 5);
  assert.equal(segments[0], `${content.ASCII_ART}\n\n`);
  assert.equal(segments[1], content.GREETING.split("\n")[0]);
  assert.equal(segments[3], content.EMAIL);
  assert.deepEqual(styles, [
    content.GREETING_STYLE,
    "",
    content.EMAIL_STYLE,
    ""
  ]);
});

test("SSR, development, and test builds are silent and install no API", async () => {
  for (const options of [
    {production: true, browser: false},
    {production: false},
    {production: false, browser: false}
  ]) {
    const {exports, window, logs} = await runtime(options);
    assert.equal(exports.printConsoleGreeting(), undefined);
    assert.equal(exports.installBrandonApi(), undefined);
    assert.deepEqual(logs, []);
    assert.equal(Object.hasOwn(window, "brandon"), false);
  }
});

test("API is plain, frozen, hidden, and installed once across fresh module evaluation", async () => {
  const {exports, evaluate, window, logs} = await runtime();
  assert.equal(exports.installBrandonApi(), undefined);
  const api = window.brandon;
  assert.equal(Object.isFrozen(api), true);
  assert.equal(Object.getPrototypeOf(api).constructor.name, "Object");
  assert.deepEqual(Object.keys(api), ["help", "whoami", "stack", "email"]);
  const descriptor = Object.getOwnPropertyDescriptor(window, "brandon");
  assert.equal(descriptor.enumerable, false);
  assert.equal(descriptor.writable, false);
  assert.equal(descriptor.configurable, false);
  assert.deepEqual(Object.keys(window), []);
  assert.equal(exports.installBrandonApi(), undefined);
  assert.equal(evaluate().installBrandonApi(), undefined);
  assert.equal(window.brandon, api);
  assert.deepEqual(logs, []);
  for (const [command, expected] of [
    ["help", content.HELP],
    ["whoami", content.WHOAMI],
    ["stack", content.STACK]
  ]) {
    assert.equal(api[command](), undefined);
    assert.deepEqual(logs.splice(0), [[expected]]);
  }
});

test("email returns undefined before awaiting clipboard success", async () => {
  let resolve;
  const pending = new Promise(done => {
    resolve = done;
  });
  const copied = [];
  const {exports, window, logs} = await runtime({
    clipboard: {
      writeText: value => {
        copied.push(value);
        return pending;
      }
    }
  });
  exports.installBrandonApi();
  assert.equal(window.brandon.email(), undefined);
  assert.deepEqual(copied, [content.EMAIL]);
  assert.deepEqual(logs, []);
  resolve();
  await new Promise(setImmediate);
  assert.deepEqual(logs, [[content.EMAIL_COPIED]]);
});

for (const [name, clipboard] of [
  [
    "rejected",
    {writeText: () => Promise.reject(new Error("Document is not focused"))}
  ],
  ["missing", undefined]
]) {
  test(`email safely prints fallback when clipboard is ${name}`, async () => {
    const {exports, window, logs} = await runtime({clipboard});
    exports.installBrandonApi();
    assert.equal(window.brandon.email(), undefined);
    await new Promise(setImmediate);
    assert.deepEqual(logs, [[content.EMAIL_COPY_FAILED]]);
  });
}
