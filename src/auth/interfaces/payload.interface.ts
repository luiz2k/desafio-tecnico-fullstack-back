import { UserRole } from "src/schemas/user.schema";

export interface Payload {
  sub: string;
  email: string;
  roles: UserRole[];
  iat: number;
  exp: number;
}
