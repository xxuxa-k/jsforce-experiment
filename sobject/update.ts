import { newJsforceConnection } from "../jsforceConnection"

(async () => {
  const conn = await newJsforceConnection()
  const sobject = conn.sobject("Account")

  const result = await sobject.update([
    {
      Id: "001J300000LmG8EIAV",
      Name: "Foo Bar Baz",
    },
  ])
  console.log(result)
})()
