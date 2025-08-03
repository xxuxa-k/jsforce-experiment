import { z } from "zod"

export const TokenResponseSchema = z.object({
  access_token: z.string(),
  scope: z.string(),
  instance_url: z.string(),
  id: z.string(),
  token_type: z.string(),
})
