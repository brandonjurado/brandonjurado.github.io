module.exports = {
  ci: {
    collect: {
      url: ["http://127.0.0.1:4173/"],
      startServerCommand: "bun run preview",
      startServerReadyPattern: "Production preview ready",
      numberOfRuns: 3,
      settings: {
        onlyCategories: [
          "performance",
          "accessibility",
          "best-practices",
          "seo"
        ],
        formFactor: "mobile",
        throttlingMethod: "simulate",
        throttling: {
          rttMs: 150,
          throughputKbps: 1638.4,
          cpuSlowdownMultiplier: 4
        },
        chromeFlags: "--headless --no-sandbox"
      }
    },
    assert: {
      assertions: {
        "categories:performance": [
          "error",
          {minScore: 0.95, aggregationMethod: "median"}
        ],
        "categories:accessibility": [
          "error",
          {minScore: 0.95, aggregationMethod: "median"}
        ],
        "categories:best-practices": [
          "error",
          {minScore: 0.95, aggregationMethod: "median"}
        ],
        "categories:seo": [
          "error",
          {minScore: 0.95, aggregationMethod: "median"}
        ],
        "largest-contentful-paint": [
          "error",
          {maxNumericValue: 2499, aggregationMethod: "median"}
        ],
        "cumulative-layout-shift": [
          "error",
          {maxNumericValue: 0.099, aggregationMethod: "median"}
        ],
        "total-blocking-time": [
          "error",
          {maxNumericValue: 199, aggregationMethod: "median"}
        ]
      }
    },
    upload: {target: "filesystem", outputDir: "reports/lighthouse"}
  }
};
