import { expect, type APIRequestContext, type Page } from "@playwright/test";
import { NavigationRoutes, type AppRouteName } from "../constants/NavigationRoutes";
import { HttpStatusBounds } from "../constants/HttpStatusBounds";
import { LinksPage } from "../pages/LinksPage";
import { toCheckableHttpLinks } from "../utils/links";
import { openRoute } from "../utils/page";

export class LinkSteps {
  private readonly linksPage: LinksPage;

  public constructor(
    private readonly page: Page,
    private readonly request: APIRequestContext
  ) {
    this.linksPage = new LinksPage(page);
  }

  public async validateLinksOnRoute(routeName: AppRouteName): Promise<void> {
    await openRoute(this.page, NavigationRoutes.routes[routeName], "domcontentloaded");

    const linksToCheck = await this.collectCheckableLinksFromCurrentPage();
    const failures = await this.collectLinkStatusFailures(linksToCheck);

    expect(linksToCheck.length, "No links found on page.").toBeGreaterThan(0);
    expect(failures, `Unexpected status codes:\n${failures.join("\n")}`).toEqual([]);
  }

  private async collectCheckableLinksFromCurrentPage(): Promise<string[]> {
    const hrefs = await this.linksPage.collectAnchorHrefs();

    return toCheckableHttpLinks(hrefs, this.page.url());
  }

  private async collectLinkStatusFailures(links: string[]): Promise<string[]> {
    const failures: string[] = [];

    for (const link of links) {
      const response = await this.request.get(link, {
        failOnStatusCode: false,
        maxRedirects: 0
      });

      const status = response.status();
      if (!this.isAcceptedStatus(status)) {
        failures.push(`${status} -> ${link}`);
      }
    }

    return failures;
  }

  private isAcceptedStatus(status: number): boolean {
    const isSuccessOrRedirect =
      (status >= HttpStatusBounds.successMin && status < HttpStatusBounds.successMaxExclusive) ||
      (status >= HttpStatusBounds.redirectMin && status < HttpStatusBounds.redirectMaxExclusive);
    const isClientError =
      status >= HttpStatusBounds.clientErrorMin && status < HttpStatusBounds.clientErrorMaxExclusive;

    return isSuccessOrRedirect && !isClientError;
  }
}
