import { z } from "zod";

export const createInfluencerSchema = z.object({
  name: z
    .string({
      required_error: "Nome obrigatório",
      invalid_type_error: "O nome precisa ser uma string",
    })
    .min(3, { message: "Nome muito curto, mínimo 3 caracteres" })
    .max(64, {
      message: "Nome muito longo, máximo 64 caracteres",
    }),
  social_network: z
    .string({
      required_error: "Rede social obrigatória",
      invalid_type_error: "A rede social precisa ser uma string",
    })
    .min(3, { message: "Rede social muito curta, mínimo 3 caracteres" })
    .max(64, {
      message: "Rede social muito longa, máximo 64 caracteres",
    })
    .regex(
      /^[a-zA-Z0-9_.]+$/,
      "A rede social pode conter apenas letras, números, pontos e underlines — sem espaços ou caracteres especiais.",
    ),
  followers: z.coerce
    .number({
      required_error: "Seguidores obrigatórios",
      invalid_type_error: "Os seguidores precisam ser do tipo number",
    })
    .min(1, {
      message: "A quantidade de seguidores precisa ser maior que zero",
    })
    .max(999999999, {
      message:
        "A quantidade de seguidores precisa ser menor ou igual a 999999999",
    }),
});

export type CreateInfluencerDto = z.infer<typeof createInfluencerSchema>;
