import { test } from "@playwright/test";
import { LinkSteps } from "../../steps/LinkSteps";

test.describe("TC2 - Link status validation", () => {
  test("all links from homepage should return 200 or 30x, and never 40x", async ({ page, request }) => {
    const linkSteps = new LinkSteps(page, request);
    await linkSteps.validateLinksOnRoute("login");
  });
});
