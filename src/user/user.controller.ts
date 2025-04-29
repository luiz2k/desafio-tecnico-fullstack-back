import { Body, Controller, Post, UseGuards } from "@nestjs/common";
import { AuthGuard } from "src/auth/auth.guard";
import { Roles } from "src/auth/roles.decorator";
import { RolesGuard } from "src/auth/roles.guard";
import { ZodValidationPipe } from "src/pipes/zod-validation.pipe";
import { UserRole } from "src/schemas/user.schema";
import { CreateUserDto, createUserSchema } from "./dto/create-user.dto";
import { UserService } from "./user.service";

@UseGuards(RolesGuard)
@Roles(UserRole.ADMIN)
@UseGuards(AuthGuard)
@Controller("user")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  create(
    @Body(new ZodValidationPipe(createUserSchema)) createUserDto: CreateUserDto,
  ) {
    return this.userService.create(createUserDto);
  }
}
