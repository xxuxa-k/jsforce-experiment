import { createJsforceConnectionFromJsforceConfig } from "../jsforceConnection"

(async () => {
  const conn = await createJsforceConnectionFromJsforceConfig()
  const sobject = conn.sobject("Account")

  const result = await sobject.update([
    {
      Id: "001J300000LmG8EIAV",
      Name: "Foo Bar Baz",
    },
  ])
  console.log(result)
})()
