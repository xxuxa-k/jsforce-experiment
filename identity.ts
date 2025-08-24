import { getJsforceConnection } from "./jsforceConnection"

(async () => {
  const conn = await getJsforceConnection()

  const identity = await conn.identity()
  console.log(identity)
})()
