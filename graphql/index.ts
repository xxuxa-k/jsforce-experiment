import { createJsforceConnectionFromJsforceConfig } from "../jsforceConnection"
import { createFetcher } from "../fetcher"
import { ReponseSchema } from "./types"
import { readFile } from "node:fs/promises"
import { resolve } from "node:path"

(async () => {
  const conn = await createJsforceConnectionFromJsforceConfig()

  const buffer = await readFile(resolve("graphql", "query.graphql"))
  const query = buffer.toString()

  const fetcher = createFetcher(conn)
  const response = await fetcher("/graphql", {
    method: "post",
    body: JSON.stringify({
      query,
      variables: {
        keyword: "東京都",
      },
    }),
  })

  const result = ReponseSchema.safeParse(response)
  if (!result.success) {
    console.error(result.error)
    throw new Error("Invalid response format")
  }

  const edges = result.data.data.uiapi.query.Account.edges
  if (edges.length > 0) {
    edges.forEach(edge => {
      const node = edge.node
      console.log(node.Id, node.Name.value, node.Website.value)
    })
  } else {
    console.log("No accounts found.")
  }
})()

