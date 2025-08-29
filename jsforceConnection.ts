import * as jwt from "jsonwebtoken"
import {
  Connection,
  type StandardSchema,
  type Schema,
} from "jsforce" 
import { TokenResponseSchema } from "./types"
import { readFile } from "node:fs/promises"
import config from "./config"

export async function newJsforceConnection<T extends Schema = StandardSchema>() {
  const key = await readFile(config.keyPath, 'utf8')

  const signed = jwt.sign({
    iss: config.issuer,
    aud: config.audience,
    sub: config.subject,
    exp: Math.floor(Date.now() / 1000) + 1 * 60,
  }, key, {
      algorithm: "RS256",
    })

  const tokenResponse = await fetch(`${config.audience}/services/oauth2/token`, {
    method: "post",
    headers: new Headers({
      "Content-Type": "application/x-www-form-urlencoded",
    }),
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion: signed,
    }),
  })
  if (!tokenResponse.ok) {
    const text = await tokenResponse.text()
    console.error(text)
    throw new Error(`JWT auth error: ${text}`)
  }

  const result = TokenResponseSchema.safeParse(await tokenResponse.json())
  if (!result.success) {
    const text = JSON.stringify(result)
    throw new Error(`Invalid JWT auth response: ${text}`)
  }

  return new Connection<T>({
    accessToken: result.data.access_token,
    instanceUrl: result.data.instance_url,
    version: config.apiVersion ?? "64.0",
  })
}
