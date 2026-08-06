import { expect, type ConsoleMessage, type Page } from "@playwright/test";
import { ConsoleMessageTypes } from "../constants/ConsoleMessageTypes";
import { NavigationRoutes } from "../constants/NavigationRoutes";
import { PageEvents } from "../constants/PageEvents";
import { openRoute } from "../utils/page";

export class ConsoleSteps {
  private readonly consoleErrors: string[] = [];

  public constructor(private readonly page: Page) {}

  public attachErrorCollector(): void {
    this.page.on(PageEvents.console, (message: ConsoleMessage) => {
      if (message.type() === ConsoleMessageTypes.error) {
        this.consoleErrors.push(message.text());
      }
    });
  }

  public async openHomePageAndWait(): Promise<void> {
    await openRoute(this.page, NavigationRoutes.routes.home, "networkidle");
  }

  public async openAboutPageAndWait(): Promise<void> {
    await openRoute(this.page, NavigationRoutes.routes.about, "domcontentloaded");
  }

  public expectNoErrors(): void {
    expect(
      this.consoleErrors,
      `Console errors detected:\n${this.consoleErrors.join("\n")}`
    ).toEqual([]);
  }

  public expectAnyError(): void {
    expect(this.consoleErrors.length).toBeGreaterThan(0);
  }
}
