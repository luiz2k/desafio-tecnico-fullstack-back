import { CampaignStatus } from "src/schemas/campaign.schema";
import { objectIdSchema } from "src/validations/object-id.validation";
import { z } from "zod";

export const createCampaignSchema = z.object({
  title: z.string({
    required_error: "Título obrigatório",
    invalid_type_error: "O título precisa ser uma string",
  }),
  customer: z.string({
    required_error: "Cliente obrigatório",
    invalid_type_error: "O cliente precisa ser uma string",
  }),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
  finishedAt: z.date().nullable().optional(),
  status: z.nativeEnum(CampaignStatus, {
    required_error: "Status obrigatório",
    invalid_type_error: "O status deve ser um valor válido",
  }),
  influencers: z.array(objectIdSchema, {
    required_error: "Influenciadores obrigatórios",
    invalid_type_error: "Os influenciadores devem ser um array de ObjectIds",
  }),
});

export type CreateCampaignDto = z.infer<typeof createCampaignSchema>;
