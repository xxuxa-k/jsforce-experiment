import { z } from "zod"
import { getJsforceConnection } from "./jsforceConnection"
import { SALESFORCE_API_VERSION } from "./config"
import { readFile } from "node:fs/promises"

const ReponseSchema = z.object({
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

const main = async () => {
  const conn = await getJsforceConnection()

  const buffer = await readFile("./query.graphql")
  const query = buffer.toString()

  const apiVersion = SALESFORCE_API_VERSION ?? ""
  if (!apiVersion) {
    throw new Error("SALESFORCE_API_VERSION is not set")
  }

  const url = new URL(`${conn.instanceUrl}/services/data/${apiVersion}/graphql`)
  const response = await fetch(url, {
    method: "post",
    headers: new Headers({
      "Authorization": `Bearer ${conn.accessToken}`,
      "Content-Type": "application/json",
    }),
    body: JSON.stringify({
      query,
      variables: {
        keyword: "東京都",
      },
    }),
  })

  const json = await response.json()
  if (!response.ok) {
    console.error("Error:", json)
    throw new Error("Error")
  }
  const { success, data, error } = ReponseSchema.safeParse(json)

  if (!success) {
    console.error(error)
    throw new Error("Invalid response format")
  }
  data.data.uiapi.query.Account.edges.forEach(edge => {
    const node = edge.node
    console.log(node.Id, node.Name.value, node.Website.value)
  })
}

main()
