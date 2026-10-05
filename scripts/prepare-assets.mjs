import sharp from "sharp";
import {mkdir, readdir} from "node:fs/promises";
await mkdir("public/media", {recursive: true});
for (const name of (await readdir("src/assets/images")).filter(name =>
  name.endsWith(".webp")
)) {
  for (const width of [128, 256, 512]) {
    await sharp(`src/assets/images/${name}`)
      .resize({width, withoutEnlargement: true})
      .webp({quality: 80})
      .toFile(`public/media/${name.replace(".webp", "")}-${width}.webp`);
  }
}
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630"><rect width="1200" height="630" fill="#171c28"/><rect x="72" y="76" width="72" height="8" rx="4" fill="#d3b2f4"/><g fill="#f5f3fa" font-family="Helvetica,Arial,sans-serif"><text x="72" y="230" font-size="84" font-weight="700">Brandon Jurado</text><text x="76" y="307" font-size="36" fill="#d3b2f4">Senior Software Engineer</text><text x="76" y="408" font-size="30">Event-driven systems, built to last.</text><text x="76" y="467" font-size="24" fill="#c1c7d3">Java · Spring Boot · Kafka · AWS · Terraform</text><text x="76" y="556" font-size="24">bjurado.com</text></g></svg>`;
await sharp(Buffer.from(svg)).png().toFile("public/share-card.png");
