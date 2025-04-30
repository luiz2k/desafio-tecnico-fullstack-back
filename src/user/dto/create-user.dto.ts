import { UserRole } from "src/schemas/user.schema";
import { z } from "zod";

export const createUserSchema = z.object({
  email: z
    .string({
      required_error: "E-mail obrigatório",
      invalid_type_error: "O e-mail precisa ser uma string",
    })
    .email({ message: "Informe um e-mail válido" })
    .toLowerCase(),
  password: z
    .string({
      required_error: "Senha obrigatória",
      invalid_type_error: "A senha precisa ser uma string",
    })
    .min(6, { message: "Senha muito curta, mínimo 6 caracteres" }),
  roles: z
    .array(
      z.nativeEnum(UserRole, {
        required_error: "Papel do usuário é obrigatório",
        invalid_type_error: "Papel do usuário deve ser um valor válido",
      }),
      {
        required_error: "A lista de papéis é obrigatória",
        invalid_type_error: "A lista de papéis deve ser um array",
      },
    )
    .min(1, { message: "Atribua pelo menos um papel ao usuário" }),
});

export type CreateUserDto = z.infer<typeof createUserSchema>;
