import z from "zod";

export const envSchema = z.object({
  PORT: z.coerce.number(),
  MONGODB_URI: z.string(),
  JWT_SECRET: z.string(),
  JWT_EXPIRES_IN: z.string(),
});

export type Env = z.infer<typeof envSchema>;
