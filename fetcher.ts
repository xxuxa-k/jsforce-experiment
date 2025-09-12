import { ofetch } from "ofetch"
import type { Connection } from "jsforce"

export function createFetcher(
  conn: Connection,
) {
  return ofetch.create({
    baseURL: `${conn.instanceUrl}/services/data/v${conn.version}/`,
    headers: {
      "Authorization": `Bearer ${conn.accessToken}`,
    },
  })
}

