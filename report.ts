import { getJsforceConnection } from "./jsforceConnection"

(async () => {
  const conn = await getJsforceConnection()

  const reportId = "00OJ3000000PkqeMAC"
  const report = conn.analytics.report(reportId)
  
  const reportExecute = await report.execute({
    details: true,
  })
  console.log(reportExecute)
})()
