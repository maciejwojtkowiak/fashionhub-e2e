import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  RUNTIME_ENVIRONMENTS,
  resolveRuntimeEnvironmentName,
  type RuntimeEnvironmentName
} from "../constants/EnvironmentConstants";

export type EnvName = RuntimeEnvironmentName;

interface EnvironmentFile {
  baseUrl: string;
}

export interface RuntimeEnvironment {
  baseUrl: string;
  selectedEnv: EnvName;
  source: "target-env-file";
}

const currentFilePath = fileURLToPath(import.meta.url);
const currentDirectory = path.dirname(currentFilePath);
const environmentsDirectory = path.resolve(currentDirectory, "../../config/environments");

function readJsonFile<T>(filePath: string): T | null {
  if (!fs.existsSync(filePath)) {
    return null;
  }

  const content = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(content) as T;
}

function readEnvironmentFile(envName: EnvName): EnvironmentFile | null {
  const envFilePath = path.join(environmentsDirectory, `${envName}.json`);
  return readJsonFile<EnvironmentFile>(envFilePath);
}

export function resolveRuntimeEnvironment(): RuntimeEnvironment {
  const targetEnvRaw = process.env.TARGET_ENV;
  const resolvedEnv = resolveRuntimeEnvironmentName(targetEnvRaw);

  if (!resolvedEnv) {
    throw new Error(
      `TARGET_ENV must be one of: ${RUNTIME_ENVIRONMENTS.join(", ")}. Current value: ${targetEnvRaw ?? "undefined"}`
    );
  }

  const envConfig = readEnvironmentFile(resolvedEnv);
  if (!envConfig?.baseUrl) {
    throw new Error(
      `Missing or invalid environment file for TARGET_ENV=${targetEnvRaw ?? "undefined"}. Expected file: config/environments/${resolvedEnv}.json`
    );
  }

  return {
    baseUrl: envConfig.baseUrl,
    selectedEnv: resolvedEnv,
    source: "target-env-file"
  };
}
