import {readFile, writeFile, mkdir} from "node:fs/promises";
import {gzipSync} from "node:zlib";
const manifest = JSON.parse(await readFile("dist/.vite/manifest.json", "utf8"));
const seen = new Set();
function visit(key) {
  if (seen.has(key)) return;
  seen.add(key);
  for (const dependency of manifest[key].imports || []) visit(dependency);
}
for (const [key, chunk] of Object.entries(manifest))
  if (chunk.isEntry) visit(key);
const chunks = await Promise.all(
  Object.entries(manifest)
    .filter(([, chunk]) => chunk.file.endsWith(".js"))
    .map(async ([key, chunk]) => ({
      file: chunk.file,
      initial: seen.has(key),
      gzipBytes: gzipSync(await readFile(`dist/${chunk.file}`)).length
    }))
);
const initialBytes = chunks
  .filter(chunk => chunk.initial)
  .reduce((sum, chunk) => sum + chunk.gzipBytes, 0);
const report = {budgetBytes: 100_000, initialBytes, chunks};
await mkdir("reports", {recursive: true});
await writeFile("reports/bundle.json", JSON.stringify(report, null, 2) + "\n");
console.log(JSON.stringify(report, null, 2));
if (initialBytes >= report.budgetBytes)
  throw new Error(
    `Initial JS ${initialBytes} bytes exceeds the <100 KB gzip budget`
  );
