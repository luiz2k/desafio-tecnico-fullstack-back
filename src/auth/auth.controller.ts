import { Body, Controller, Post } from "@nestjs/common";
import { signInDto, SignInDto } from "./dto/sign-in.dto";
import { AuthService } from "./auth.service";
import { ZodValidationPipe } from "src/pipes/zod-validation.pipe";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("sign-in")
  async signIn(@Body(new ZodValidationPipe(signInDto)) signInDto: SignInDto) {
    const token = await this.authService.signIn(signInDto);

    return {
      message: "Autenticado com sucesso",
      data: token,
    };
  }
}
