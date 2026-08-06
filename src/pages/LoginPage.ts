import { expect, type Locator, type Page } from "@playwright/test";
import { AuthStorage } from "../constants/AuthStorage";
import { NavigationRoutes } from "../constants/NavigationRoutes";
import { RegexPatterns } from "../constants/RegexPatterns";
import { expectPageUrl, getLocalStorageItem, openRoute } from "../utils/page";
import { BasePage } from "./BasePage";

export class LoginPage extends BasePage {
  private static readonly usernameInputSelector = "#username";
  private static readonly passwordInputSelector = "#password";
  private static readonly submitButtonSelector = "#loginForm input[type='submit']";

  public constructor(page: Page) {
    super(page);
  }

  public async goto(): Promise<void> {
    await openRoute(this.page, NavigationRoutes.routes.login, "domcontentloaded");
  }

  public async login(username: string, password: string): Promise<void> {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.submitButton.click();
  }

  public async expectLoggedIn(): Promise<void> {
    await expectPageUrl(this.page, RegexPatterns.accountPage);
    const isLoggedIn = await getLocalStorageItem(this.page, AuthStorage.keys.isLoggedIn);
    expect(isLoggedIn).toBe(AuthStorage.values.loggedIn);
  }

  private get usernameInput(): Locator {
    return this.page.locator(LoginPage.usernameInputSelector);
  }

  private get passwordInput(): Locator {
    return this.page.locator(LoginPage.passwordInputSelector);
  }

  private get submitButton(): Locator {
    return this.page.locator(LoginPage.submitButtonSelector);
  }
}
