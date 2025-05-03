import { ConflictException, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import * as bcrypt from "bcrypt";
import { Model } from "mongoose";
import { User } from "src/schemas/user.schema";
import { CreateUserDto } from "./dto/create-user.dto";

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async create(createUserDto: CreateUserDto) {
    const userExists = await this.userModel.findOne({
      email: createUserDto.email,
    });

    if (userExists) {
      throw new ConflictException("Usuário já cadastrado");
    }

    const hash = await bcrypt.hash(createUserDto.password, 10);

    const { _id } = await this.userModel.create({
      email: createUserDto.email,
      hashPassword: hash,
      roles: createUserDto.roles,
    });

    return await this.userModel.findOne({ _id });
  }

  async findAll() {
    return await this.userModel.find();
  }
}
