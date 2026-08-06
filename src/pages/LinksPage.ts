import type { Page } from "@playwright/test";
import { BasePage } from "./BasePage";

export class LinksPage extends BasePage {
  private static readonly anchorWithHrefSelector = "a[href]";
  private static readonly hrefAttribute = "href";

  public constructor(page: Page) {
    super(page);
  }

  public async collectAnchorHrefs(): Promise<string[]> {
    return this.page.locator(LinksPage.anchorWithHrefSelector).evaluateAll(
      (anchors, hrefAttribute) =>
        anchors
          .map((anchor) => anchor.getAttribute(hrefAttribute))
          .filter((href): href is string => Boolean(href)),
      LinksPage.hrefAttribute
    );
  }
}
