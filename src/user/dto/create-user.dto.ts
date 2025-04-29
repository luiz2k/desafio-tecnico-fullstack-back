import { UserRole } from "src/schemas/user.schema";
import { z } from "zod";

export const createUserSchema = z.object({
  email: z.string().email({ message: "E-mail inválido" }).toLowerCase(),
  password: z
    .string()
    .min(6, { message: "Senha muito curta, mínimo 6 caracteres" }),
  roles: z
    .array(z.nativeEnum(UserRole, { message: "Papel inválido" }), {
      message: "Esperado um array de papeis",
    })
    .min(1, { message: "Pelo menos um papel deve ser atribuído" }),
});

export type CreateUserDto = z.infer<typeof createUserSchema>;
