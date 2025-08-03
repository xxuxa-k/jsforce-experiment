import { getJsforceConnection } from "./jsforceConnection"

(async function () {
  const conn = await getJsforceConnection()

  const identity = await conn.identity()
  console.log(identity)
})()
