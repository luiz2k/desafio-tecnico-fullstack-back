import { z } from "zod";
import { createParticipantSchema } from "./create-participant.dto";

export const updateParticipantSchema = createParticipantSchema.partial();

export type UpdateParticipantDto = z.infer<typeof updateParticipantSchema>;
