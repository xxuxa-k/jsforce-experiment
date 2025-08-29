import { newJsforceConnection } from "../jsforceConnection"

(async () => {
  const conn = await newJsforceConnection()

  const reportId = "00OJ3000000PkqeMAC"
  const report = conn.analytics.report(reportId)
  
  const reportExecution = await report.execute({
    details: true,
  })
  console.log(reportExecution)
})()
