import { z } from "zod"

export const ReponseSchema = z.object({
  data: z.object({
    uiapi: z.object({
      query: z.object({
        Account: z.object({
          edges: z.array(
            z.object({
              node: z.object({
                InvalidProperty: z.string().optional().describe("Does not cause an error."),
                Id: z.string(),
                Name: z.object({
                  value: z.string(),
                }),
                Website: z.object({
                  value: z.string().nullable(),
                }),
              })
            })),
        }),
      }),
    })
  }),
  errors: z.array(z.any()),
})
