import { Body, Controller, Post } from "@nestjs/common";
import { signInDto, SignInDto } from "./dto/sign-in.dto";
import { AuthService } from "./auth.service";
import { ZodValidationPipe } from "src/pipes/zod-validation.pipe";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("sign-in")
  signIn(@Body(new ZodValidationPipe(signInDto)) signInDto: SignInDto) {
    return this.authService.signIn(signInDto);
  }
}
