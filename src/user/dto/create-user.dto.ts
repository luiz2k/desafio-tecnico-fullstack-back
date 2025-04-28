import { UserRole } from "src/schemas/user.schema";
import { z } from "zod";

export const createUserSchema = z.object({
  email: z.string().email({ message: "E-mail inválido" }).toLowerCase(),
  password: z
    .string()
    .min(6, { message: "Senha muito curta, mínimo 6 caracteres" }),
  role: z.nativeEnum(UserRole, { message: "Papel inválido" }),
});

export type CreateUserDto = z.infer<typeof createUserSchema>;
