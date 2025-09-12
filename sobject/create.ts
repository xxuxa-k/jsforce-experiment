import { createJsforceConnectionFromJsforceConfig } from "../jsforceConnection"

(async () => {
  const conn = await createJsforceConnectionFromJsforceConfig()
  const sobject = conn.sobject("Account")

  const result = await sobject.create({
    Name: "Hoge",
  })
  console.log(result)
})()
