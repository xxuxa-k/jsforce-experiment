import { newJsforceConnection } from "../jsforceConnection"
import { ReponseSchema } from "./types"
import { readFile } from "node:fs/promises"

(async () => {
  const conn = await newJsforceConnection()

  const buffer = await readFile("./query.graphql")
  const query = buffer.toString()

  const url = new URL(`${conn.instanceUrl}/services/data/${conn.version}/graphql`)
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
  const result = ReponseSchema.safeParse(json)

  if (!result.success) {
    console.error(result.error)
    throw new Error("Invalid response format")
  }
  result.data.data.uiapi.query.Account.edges.forEach(edge => {
    const node = edge.node
    console.log(node.Id, node.Name.value, node.Website.value)
  })
})()

