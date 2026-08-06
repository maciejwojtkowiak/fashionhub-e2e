export const RUNTIME_ENVIRONMENTS = ["local", "staging", "production"] as const;
export type RuntimeEnvironmentName = (typeof RUNTIME_ENVIRONMENTS)[number];

export const TEST_DATA_ENVIRONMENTS = RUNTIME_ENVIRONMENTS;
export type TestDataEnvironment = RuntimeEnvironmentName;

export function resolveRuntimeEnvironmentName(value?: string): RuntimeEnvironmentName | null {
  const normalized = value?.trim().toLowerCase();
  if (!normalized) {
    return null;
  }

  return RUNTIME_ENVIRONMENTS.includes(normalized as RuntimeEnvironmentName)
    ? (normalized as RuntimeEnvironmentName)
    : null;
}