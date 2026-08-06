import type { RuntimeEnvironmentName } from "../../constants/EnvironmentConstants";

export type TestUserRole = "ADMIN" | "VIEWER" | "EDITOR";

export interface TestUserCredentials {
  username: string;
  password: string;
}

function getOptionalEnvVar(name: string): string | null {
  const value = process.env[name]?.trim();
  return value ? value : null;
}

export function getUserCredentials(environment: RuntimeEnvironmentName, role: TestUserRole): TestUserCredentials {
  const prefix = `TEST_${environment.toUpperCase()}_${role}`;
  const sharedPrefix = `TEST_${role}`;

  const username =
    getOptionalEnvVar(`${prefix}_USERNAME`) ??
    getOptionalEnvVar(`${sharedPrefix}_USERNAME`) ??
    getOptionalEnvVar("TEST_USERNAME");
  const password =
    getOptionalEnvVar(`${prefix}_PASSWORD`) ??
    getOptionalEnvVar(`${sharedPrefix}_PASSWORD`) ??
    getOptionalEnvVar("TEST_PASSWORD");

  if (!username || !password) {
    throw new Error(
      `Missing credentials for ${environment}/${role}. Provide TEST_USERNAME and TEST_PASSWORD, or overrides ${sharedPrefix}_USERNAME/${sharedPrefix}_PASSWORD, or ${prefix}_USERNAME/${prefix}_PASSWORD.`
    );
  }

  return {
    username,
    password
  };
}