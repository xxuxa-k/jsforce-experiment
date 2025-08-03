import * as jwt from "jsonwebtoken"
import * as jsforce from "jsforce"
import { AccessTokenResponseSchema } from "./types"
import { readFile } from "fs/promises"
import config from "./config"

export async function getJsforceConnection() {
  const cert = await readFile(config.keyPath, 'utf8')

  const signed = jwt.sign({
    iss: config.issuer,
    aud: config.audience,
    sub: config.subject,
    exp: (Math.floor(Date.now() / 1000) + 1 * 60) * 1000,
  }, cert, {
      algorithm: "RS256",
    })
  // console.log(signed)

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
    console.error(await tokenResponse.text())
    return
  }

  const { success, data } = AccessTokenResponseSchema.safeParse(await tokenResponse.json())
  if (!success) {
    throw new Error(`Invalid JWT auth response: ${await tokenResponse.text()}`)
  }

  const conn = new jsforce.Connection({
    accessToken: data.access_token,
    instanceUrl: data.instance_url,
  })

  return conn
}
