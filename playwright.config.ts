import "dotenv/config";
import { defineConfig, devices } from "@playwright/test";
import { resolveRuntimeEnvironment } from "./src/config/environment";
import { Logger } from "./src/utils/logger";

const runtime = resolveRuntimeEnvironment();

const requestedBrowsers = process.env.BROWSERS
  ?.split(",")
  .map((name) => name.trim().toLowerCase())
  .filter(Boolean);

const defaultBrowsers = ["chromium"];

const selectedBrowsers =
  requestedBrowsers && requestedBrowsers.length > 0
    ? requestedBrowsers
    : defaultBrowsers;

const uiTestMatch = "**/ui/**/*.spec.ts";

const browserDeviceByName = {
  chromium: "Desktop Chrome",
  firefox: "Desktop Firefox",
  webkit: "Desktop Safari"
} as const;

const browserProjects = selectedBrowsers
  .filter((name): name is keyof typeof browserDeviceByName => name in browserDeviceByName)
  .map((name) => ({
    name,
    testMatch: uiTestMatch,
    use: {
      ...devices[browserDeviceByName[name]],
      headless: true
    }
  }));

const apiProject = {
  name: "api",
  testMatch: "**/api/**/*.spec.ts",
  use: {
    baseURL: runtime.baseUrl
  }
};

const projects = [apiProject, ...browserProjects];

Logger.info("playwright.runtime", {
  baseUrl: runtime.baseUrl,
  selectedEnv: runtime.selectedEnv,
  source: runtime.source
});

Logger.info(
  "playwright.projects",
  projects.map((project) => project.name).join(", ")
);


export default defineConfig({
  testDir: "./src/tests",
  timeout: 45_000,
  fullyParallel: true,
  retries: process.env.CI ? 2 : 0,
  reporter: [
    ["list"],
    ["html", { outputFolder: "playwright-report", open: "never" }]
  ],
  use: {
    baseURL: runtime.baseUrl,
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: "retain-on-failure"
  },
  projects
});