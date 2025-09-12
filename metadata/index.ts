import { createJsforceConnectionFromJsforceConfig } from "../jsforceConnection"

(async () => {
  const conn = await createJsforceConnectionFromJsforceConfig()
  
  const metadata = conn.metadata
  const list = await metadata.list({
    type: "Flow",
  })

  console.log(list)
})()
