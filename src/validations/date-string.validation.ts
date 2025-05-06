import { z } from "zod";

export const dateStringSchema = z
  .string({
    required_error: "Data obrigatória",
    invalid_type_error: "A data precisa está no formato string",
  })
  .refine((val) => !isNaN(Date.parse(val)), {
    message: "Data inválida",
  })
  .transform((val) => new Date(val));
