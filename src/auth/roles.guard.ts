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
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles) {
      return true;
    }

    const request = context
      .switchToHttp()
      .getRequest<Request & { user: Payload }>();

    const user = request.user;

    const hasRole = requiredRoles.some((role: UserRole) =>
      user?.roles?.includes(role),
    );

    if (!hasRole) {
      throw new UnauthorizedException("Acesso negado");
    }

    return true;
  }
}
