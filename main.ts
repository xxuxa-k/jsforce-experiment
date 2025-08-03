import { getJsforceConnection } from "./jsforceConnection"

async function main() {
  const conn = await getJsforceConnection()
  const identity = await conn.identity()

  console.log(identity)
}

main()
