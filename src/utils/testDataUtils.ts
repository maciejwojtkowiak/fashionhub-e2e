import {
  TEST_DATA_ENVIRONMENTS,
  resolveRuntimeEnvironmentName,
  type TestDataEnvironment
} from "../constants/EnvironmentConstants";

export type TestEnvironment = TestDataEnvironment;

export class TestDataUtils {
  public static resolveEnvironment(): TestEnvironment {
    const rawEnvironment = process.env.ENV ?? process.env.TARGET_ENV;
    const resolvedEnvironment = resolveRuntimeEnvironmentName(rawEnvironment);

    if (resolvedEnvironment) {
      return resolvedEnvironment;
    }

    throw new Error(
      `Invalid or missing test environment. Provide ENV or TARGET_ENV as one of: ${TEST_DATA_ENVIRONMENTS.join(", ")}. Current ENV=${process.env.ENV ?? "undefined"}, TARGET_ENV=${process.env.TARGET_ENV ?? "undefined"}`
    );
  }

  public static async getTestData<T>(name: string): Promise<T> {
    const environment = TestDataUtils.resolveEnvironment();
    const module = await import(`../tests/data/${environment}/${name}`);
    return ((module.default as { default?: T })?.default ?? module.default) as T;
  }
}

export async function getTestData<T>(name: string): Promise<T> {
  return TestDataUtils.getTestData<T>(name);
}

