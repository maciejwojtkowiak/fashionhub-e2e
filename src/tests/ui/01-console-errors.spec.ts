import { test } from "@playwright/test";
import { ConsoleSteps } from "../../steps/ConsoleSteps";

test.describe("TC1 - Console errors", () => {
  test("homepage should not log console errors", async ({ page }) => {
    const consoleSteps = new ConsoleSteps(page);
    consoleSteps.attachErrorCollector();
    await consoleSteps.openHomePageAndWait();
    consoleSteps.expectNoErrors();
  });

  test("about page can be used to validate error capture mechanism", async ({ page }) => {
    const consoleSteps = new ConsoleSteps(page);
    consoleSteps.attachErrorCollector();
    await consoleSteps.openAboutPageAndWait();
    consoleSteps.expectAnyError();
  });
});
