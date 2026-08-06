import { getUserCredentials } from "../credentials";

export default {
  admin: getUserCredentials("local", "ADMIN")
} as const;
