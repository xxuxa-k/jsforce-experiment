import { newJsforceConnection } from "../jsforceConnection"

(async () => {
  const conn = await newJsforceConnection()
  const sobject = conn.sobject("Account")

  const result = await sobject.create({
    Name: "Hoge",
  })
  console.log(result)
})()
