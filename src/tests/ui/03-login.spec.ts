import { test } from "@playwright/test";
import { LoginSteps } from "../../steps/LoginSteps";
import { getTestData } from "../../utils/testDataUtils";

type UsersTestData = {
  admin: {
    username: string;
    password: string;
  };
};

test.describe("TC3 - Login flow", () => {
  test("user should be able to login with demo credentials", async ({ page }) => {
    const users = await getTestData<UsersTestData>("users");
    const loginSteps = new LoginSteps(page);
    await loginSteps.loginAsUser(users.admin.username, users.admin.password);
  });
});
