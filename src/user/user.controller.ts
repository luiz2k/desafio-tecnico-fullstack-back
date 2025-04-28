import { Body, Controller, Post, UseGuards } from "@nestjs/common";
import { AuthGuard } from "src/auth/auth.guard";
import { ZodValidationPipe } from "src/pipes/zod-validation.pipe";
import { CreateUserDto, createUserSchema } from "./dto/create-user.dto";
import { UserService } from "./user.service";

@Controller("user")
@UseGuards(AuthGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  create(
    @Body(new ZodValidationPipe(createUserSchema)) createUserDto: CreateUserDto,
  ) {
    return this.userService.create(createUserDto);
  }
}
