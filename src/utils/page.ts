import { expect, type Page } from "@playwright/test";

type GotoWaitUntil = "domcontentloaded" | "load" | "networkidle" | "commit";

export async function openRoute(page: Page, route: string, waitUntil: GotoWaitUntil): Promise<void> {
  await page.goto(route, { waitUntil });
}

export async function expectPageUrl(page: Page, expected: RegExp | string): Promise<void> {
  await expect(page).toHaveURL(expected);
}

export async function getLocalStorageItem(page: Page, key: string): Promise<string | null> {
  return page.evaluate((storageKey) => localStorage.getItem(storageKey), key);
}
