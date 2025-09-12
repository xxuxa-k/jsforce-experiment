import { createJsforceConnectionFromJsforceConfig } from "../jsforceConnection"

(async () => {
  const conn = await createJsforceConnectionFromJsforceConfig()
  
  const sobject = conn.sobject("Account")
  const metadata = await sobject.describe()

  console.log(metadata)
})()
