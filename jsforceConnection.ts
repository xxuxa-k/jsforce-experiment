import "dotenv/config"
import * as jwt from "jsonwebtoken"
import {
  Connection,
  type StandardSchema,
  type Schema,
} from "jsforce" 
import { TokenResponseSchema } from "./types"
import { readFile } from "node:fs/promises"
import { resolve } from "node:path"
import { homedir } from "node:os"

const CONFIG = {
  DEFAULT_API_VERSION: "64.0",
  JWT_EXPIRY_MINUTES: 1,
  JSFORCE_CONFIG_PATH: resolve(homedir(), ".jsforce", "config.json")
} as const

export async function createJsforceConnectionFromJsforceConfig<T extends Schema = StandardSchema>(
  options: {
    username?: string
    apiVersion?: string
  } = {}
) {
  const user = options?.username ?? process.env.USERNAME
  if (!user) {
    console.error("No username specified")
    throw new Error("No username specified")
  }

  const configFile = await readFile(CONFIG.JSFORCE_CONFIG_PATH, "utf8")
  const config = JSON.parse(configFile)
  const connection = config?.["connections"]?.[user]
  if (!connection) {
    throw new Error(`No connection config for ${user}`)
  }

  return new Connection<T>({
    accessToken: connection?.["accessToken"] ?? "",
    instanceUrl: connection?.["instanceUrl"] ?? "",
    version: options?.apiVersion ?? process.env.API_VERSION ?? CONFIG.DEFAULT_API_VERSION,
  })
}

export async function createJsforceConnectionFromJwtAuth<T extends Schema = StandardSchema>(
  options: {
    apiVersion?: string
  } = {}
) {
  const key = await readFile(process.env.JWT_KEY_PATH, "utf8")

  const signed = jwt.sign({
    iss: process.env.JWT_ISSUER ?? "",
    aud: process.env.JWT_AUDIENCE,
    sub: process.env.JWT_SUBJECT ?? process.env.USERNAME,
    exp: Math.floor(Date.now() / 1000) + CONFIG.JWT_EXPIRY_MINUTES * 60,
  }, key, {
      algorithm: "RS256",
    })

  const tokenResponse = await fetch(`${process.env.JWT_AUDIENCE ?? ""}/services/oauth2/token`, {
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
    version: options?.apiVersion ?? process.env.API_VERSION ?? CONFIG.DEFAULT_API_VERSION,
  })
}
