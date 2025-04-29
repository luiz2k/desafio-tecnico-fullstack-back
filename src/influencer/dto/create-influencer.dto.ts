import { z } from "zod";

export const createInfluencerSchema = z.object({
  name: z.string({
    required_error: "Nome obrigatório",
    invalid_type_error: "O nome precisa ser uma string",
  }),
  social_network: z.string({
    required_error: "Rede social obrigatória",
    invalid_type_error: "A rede social precisa ser uma string",
  }),
  followers: z.coerce.number({
    required_error: "Seguidores obrigatórios",
    invalid_type_error: "Os seguidores precisam ser do tipo number",
  }),
});

export type CreateInfluencerDto = z.infer<typeof createInfluencerSchema>;
