import { newJsforceConnection } from "../jsforceConnection"

(async () => {
  const conn = await newJsforceConnection()

  const soql = "SELECT Id, Name FROM Account Order By Name LIMIT 5"
  const res = await conn.query(soql)

  for (const record of res.records) {
    console.log(record)
  }
})()
