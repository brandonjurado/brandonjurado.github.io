FROM oven/bun:1.3.6 AS bun
FROM node:22-bookworm-slim
COPY --from=bun /usr/local/bin/bun /usr/local/bin/bun
WORKDIR /app
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile
COPY . .
RUN bun run build
ENV HOST=0.0.0.0
EXPOSE 4173
CMD ["bun", "run", "preview"]
