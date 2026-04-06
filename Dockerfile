# This file is the main docker file configurations

# Official Bun runtime as a parent image
FROM oven/bun:1.0.0-alpine

# Set the working directory to ./app
WORKDIR /app

# Install app dependencies
# Copy only the files needed for dependency resolution first.
COPY package.json bun.lockb ./

RUN apk add --no-cache git

# Install any needed packages
RUN bun install --frozen-lockfile

# Bundle app source
COPY . /app

# Build the static site
RUN bun run build

# Preview the built site inside the container
EXPOSE 4173
CMD ["bun", "run", "preview", "--host", "0.0.0.0", "--port", "4173"]
