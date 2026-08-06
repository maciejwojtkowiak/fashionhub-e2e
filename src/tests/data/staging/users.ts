import { getUserCredentials } from "../credentials";

export default {
  admin: getUserCredentials("staging", "ADMIN")
} as const;
