import { CampaignStatus } from "src/schemas/campaign.schema";
import { dateStringSchema } from "src/validations/date-string.validation";
import { z } from "zod";

export const createCampaignSchema = z.object({
  title: z
    .string({
      required_error: "Título obrigatório",
      invalid_type_error: "O título precisa ser uma string",
    })
    .min(3, { message: "Título muito curto, mínimo 3 caracteres" }),
  customer: z
    .string({
      required_error: "Cliente obrigatório",
      invalid_type_error: "O cliente precisa ser uma string",
    })
    .min(3, { message: "Cliente muito curto, mínimo 3 caracteres" }),
  startedAt: dateStringSchema,
  finishedAt: dateStringSchema,
  status: z.nativeEnum(CampaignStatus, {
    required_error: "Status obrigatório",
    invalid_type_error: "O status deve ser um valor válido",
  }),
});

export type CreateCampaignDto = z.infer<typeof createCampaignSchema>;

export const createCampaignParticipantSchema = z.object({
  campaign: createCampaignSchema,
  participants: z
    .array(z.string(), {
      invalid_type_error: "A lista de participantes deve ser um array",
    })
    .optional(),
});

export type CreateCampaignParticipantDto = z.infer<
  typeof createCampaignParticipantSchema
>;
