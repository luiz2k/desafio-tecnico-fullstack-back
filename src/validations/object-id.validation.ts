import mongoose from "mongoose";
import { z } from "zod";

export const objectIdSchema = z
  .string({
    required_error: "Um id precisa ser informado",
    invalid_type_error: "O id precisa ser do tipo string",
  })
  // Valida se o id é do tipo ObjectId do MongoDb
  .refine((id) => mongoose.Types.ObjectId.isValid(id), {
    message: "Informe um id no formato ObjectId do MongoDB",
  });

export type ObjectIdSchema = z.infer<typeof objectIdSchema>;
