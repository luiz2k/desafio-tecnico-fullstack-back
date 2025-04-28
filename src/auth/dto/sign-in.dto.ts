import { z } from "zod";

export const signInDto = z.object({
  email: z.string().email({ message: "E-mail inválido" }).toLowerCase(),
  password: z
    .string()
    .min(6, { message: "Senha muito curta, mínimo 6 caracteres" }),
});

export type SignInDto = z.infer<typeof signInDto>;
