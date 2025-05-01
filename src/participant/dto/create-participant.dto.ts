import { objectIdSchema } from "src/validations/object-id.validation";
import { z } from "zod";

export const createParticipantSchema = z.object({
  compaign: objectIdSchema,
  participant: objectIdSchema,
});

export type CreateParticipantDto = z.infer<typeof createParticipantSchema>;
