import { getJsforceConnection } from "./jsforceConnection"

(async function () {
  const conn = await getJsforceConnection()

  const soql = "SELECT Id, Name FROM Account Order By Name LIMIT 5"
  const res = await conn.query(soql)
  console.log(res)
})()
