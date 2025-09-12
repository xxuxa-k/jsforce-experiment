import { createJsforceConnectionFromJsforceConfig } from "../jsforceConnection"

(async () => {
  const conn = await createJsforceConnectionFromJsforceConfig()

  const record = await conn.sobject("Account").retrieve("001J300000LmG8EIAV")
  console.log(record.Id, record.Name)
})()
