import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Payload } from "src/auth/interfaces/payload.interface";
import { UserRole } from "src/schemas/user.schema";
import { ROLES_KEY } from "./roles.decorator";

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const classRoles = this.reflector.getAllAndOverride<UserRole[]>(ROLES_KEY, [
      context.getClass(),
    ]);

    const methodRoles = this.reflector.getAllAndOverride<UserRole[]>(
      ROLES_KEY,
      [context.getHandler()],
    );

    if (!classRoles && !methodRoles) {
      return true;
    }

    const roles = [...(classRoles || []), ...(methodRoles || [])];

    const request = context
      .switchToHttp()
      .getRequest<Request & { user: Payload }>();

    const user = request.user;

    const hasRole = roles.some((role) => user?.roles?.includes(role));

    if (!hasRole) {
      throw new UnauthorizedException("Acesso negado");
    }

    return true;
  }
}
