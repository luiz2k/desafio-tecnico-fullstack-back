import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Request,
  UseGuards,
} from "@nestjs/common";
import { AuthGuard } from "src/auth/auth.guard";
import { Payload } from "src/auth/interfaces/payload.interface";
import { Roles } from "src/auth/roles.decorator";
import { RolesGuard } from "src/auth/roles.guard";
import { ZodValidationPipe } from "src/pipes/zod-validation.pipe";
import { UserRole } from "src/schemas/user.schema";
import { objectIdSchema } from "src/validations/object-id.validation";
import { CreateUserDto, createUserSchema } from "./dto/create-user.dto";
import { UserService } from "./user.service";

@UseGuards(RolesGuard)
@Roles(UserRole.ADMIN)
@UseGuards(AuthGuard)
@Controller("user")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async create(
    @Body(new ZodValidationPipe(createUserSchema)) createUserDto: CreateUserDto,
  ) {
    const newUser = await this.userService.create(createUserDto);

    return {
      message: "Usuário cadastrado com sucesso",
      data: newUser,
    };
  }

  @Roles(UserRole.EDITOR)
  @Get()
  async findAll() {
    const users = await this.userService.findAll();

    return {
      message: "Busca de usuários realizada com sucesso",
      data: users,
    };
  }

  @Delete(":id")
  async delete(
    @Param("id", new ZodValidationPipe(objectIdSchema)) id: string,
    @Request() req: Request & { user: Payload },
  ) {
    const userId = req.user.sub;

    console.log(userId);

    const userDeleted = await this.userService.delete(id, userId);

    return {
      message: "Usuário excluídos com sucesso",
      data: userDeleted,
    };
  }
}
