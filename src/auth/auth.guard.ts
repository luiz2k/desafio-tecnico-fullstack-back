import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Request } from "express";
import { Payload } from "./interfaces/payload.interface";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { User } from "src/schemas/user.schema";

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    @InjectModel(User.name) private userModel: Model<User>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();

    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException("Algo de errado com o token de acesso");
    }

    try {
      const payload: Payload = await this.jwtService.verifyAsync(token);

      const user = await this.userModel.findById(payload.sub);

      if (!user) {
        throw new UnauthorizedException("Algo de errado com o token de acesso");
      }

      request["user"] = payload;
    } catch {
      throw new UnauthorizedException("Algo de errado com o token de acesso");
    }

    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(" ") ?? [];

    return type === "Bearer" ? token : undefined;
  }
}
