import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

export type UserDocument = HydratedDocument<User>;

export enum UserRole {
  ADMIN = "admin",
  EDITOR = "editor",
}

@Schema()
export class User {
  @Prop({ required: true, unique: true, lowercase: true })
  email: string;

  @Prop({ required: true, select: false })
  hashPassword: string;

  @Prop({ required: true, type: [String], enum: UserRole })
  roles: UserRole[];
}

export const UserSchema = SchemaFactory.createForClass(User);
