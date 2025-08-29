import { newJsforceConnection } from "../jsforceConnection"

(async () => {
  const conn = await newJsforceConnection()
  const identity = await conn.identity()
  console.log(identity)
})()
