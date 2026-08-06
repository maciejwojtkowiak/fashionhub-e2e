import { getUserCredentials } from "../credentials";

export default {
  admin: getUserCredentials("production", "ADMIN")
} as const;
