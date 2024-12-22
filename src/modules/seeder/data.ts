import config from "common/config";
import { Role } from "common/constants/Role";
import { AuthsDocument } from "modules/auth/schemas/auths.schema";

export const accountAdmin = {
  phone: config.accountAdmin.phone,
  password: config.accountAdmin.password,
  name: "ADMIN",
  role: Role.ADMIN,
}

export const accountSuperAdmin = {
  phone: config.accountSuperAdmin.phone,
  password: config.accountSuperAdmin.password,
  name: "SUPER_ADMIN",
  role: Role.SUPER_ADMIN,
}