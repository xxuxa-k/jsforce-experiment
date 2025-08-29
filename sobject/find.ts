import { newJsforceConnection } from "../jsforceConnection"

(async () => {
  const conn = await newJsforceConnection()
  const sobject = conn.sobject("Account")

  const records = await sobject.find({
    Website: { $exists: true }
  })
  for (const record of records) {
    console.log(record.Name, record.Website)
  }
})()
