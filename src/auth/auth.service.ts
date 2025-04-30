import { Injectable, NotFoundException } from "@nestjs/common";
import { SignInDto } from "./dto/sign-in.dto";
import { InjectModel } from "@nestjs/mongoose";
import { User } from "src/schemas/user.schema";
import { Model } from "mongoose";
import * as bcrypt from "bcrypt";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private readonly jwtService: JwtService,
  ) {}

  async signIn(signInDto: SignInDto) {
    const userExists = await this.userModel
      .findOne({
        email: signInDto.email,
      })
      .select("+hashPassword");

    if (!userExists) {
      throw new NotFoundException("E-mail ou senha incorretos");
    }

    const passwordMatch = await bcrypt.compare(
      signInDto.password,
      userExists.hashPassword,
    );

    if (!passwordMatch) {
      throw new NotFoundException("E-mail ou senha incorretos");
    }

    const payload = {
      sub: userExists._id,
      email: userExists.email,
      roles: userExists.roles,
    };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
