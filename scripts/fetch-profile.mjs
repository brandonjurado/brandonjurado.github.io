import {mkdir, writeFile} from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import {fileURLToPath} from "node:url";
import "dotenv/config";

const ERRORS = {
  missingUsername:
    "GitHub profile sync is enabled, but GITHUB_USERNAME is missing.",
  missingToken: "GitHub profile sync is enabled, but GITHUB_TOKEN is missing.",
  requestFailed:
    "The GitHub GraphQL request failed. Verify the token and repository secrets."
};

const query = `
{
  user(login: "%GITHUB_USERNAME%") {
    name
    bio
    avatarUrl
    location
    pinnedItems(first: 6, types: [REPOSITORY]) {
      totalCount
      edges {
        node {
          ... on Repository {
            name
            description
            forkCount
            stargazers {
              totalCount
            }
            url
            id
            diskUsage
            primaryLanguage {
              name
              color
            }
          }
        }
      }
    }
  }
}
`;

const currentFile = fileURLToPath(import.meta.url);
const currentDir = path.dirname(currentFile);
const rootDir = path.resolve(currentDir, "..");
const outputFile = path.join(rootDir, "public", "profile.json");

const githubUsername = process.env.GITHUB_USERNAME;
const githubToken =
  process.env.GITHUB_TOKEN || process.env.REACT_APP_GITHUB_TOKEN;
const shouldFetchGithubProfile = process.env.USE_GITHUB_DATA === "true";

if (!shouldFetchGithubProfile) {
  console.log(
    "Skipping GitHub profile sync because USE_GITHUB_DATA is not true."
  );
  process.exit(0);
}

if (!githubUsername) {
  throw new Error(ERRORS.missingUsername);
}

if (!githubToken) {
  throw new Error(ERRORS.missingToken);
}

const requestBody = JSON.stringify({
  query: query.replace("%GITHUB_USERNAME%", githubUsername)
});

console.log(`Fetching profile data for ${githubUsername}`);

const response = await fetch("https://api.github.com/graphql", {
  method: "POST",
  headers: {
    Authorization: `Bearer ${githubToken}`,
    "Content-Type": "application/json",
    "User-Agent": "brandonjurado.github.io"
  },
  body: requestBody
});

if (!response.ok) {
  throw new Error(`${ERRORS.requestFailed} Received ${response.status}.`);
}

const payload = await response.json();

if (payload.errors?.length) {
  throw new Error(
    payload.errors.map(error => error.message).join("; ") ||
      ERRORS.requestFailed
  );
}

await mkdir(path.dirname(outputFile), {recursive: true});
await writeFile(outputFile, JSON.stringify(payload, null, 2));

console.log(`Saved profile data to ${outputFile}`);
