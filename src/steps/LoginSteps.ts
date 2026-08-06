import type { Page } from "@playwright/test";
import { LoginPage } from "../pages/LoginPage";

export class LoginSteps {
  private readonly loginPage: LoginPage;

  public constructor(page: Page) {
    this.loginPage = new LoginPage(page);
  }

  public async loginAsUser(username: string, password: string): Promise<void> {
    await this.loginPage.goto();
    await this.loginPage.login(username, password);
    await this.loginPage.expectLoggedIn();
  }
}
