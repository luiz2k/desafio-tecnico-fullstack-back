import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import * as bcrypt from "bcrypt";
import { Model } from "mongoose";
import { User } from "src/schemas/user.schema";

@Injectable()
export class UserSeeder {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async seedUsers(): Promise<void> {
    const usersData = [
      {
        email: "admin@email.com",
        hashPassword: await bcrypt.hash("123456", 10),
        roles: ["admin"],
      },
      {
        email: "editor@email.com",
        hashPassword: await bcrypt.hash("123456", 10),
        roles: ["editor"],
      },
    ];

    for (const userData of usersData) {
      const userExists = await this.userModel.findOne({
        email: userData.email,
      });

      if (userExists) {
        break;
      }

      await this.userModel.create(userData);
    }
  }
}
