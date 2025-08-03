import { getJsforceConnection } from "./jsforceConnection"

(async function () {
  const conn = await getJsforceConnection()

  const result = await conn.chatter.resource("/feed-elements").create({
    body: {
      messageSegments: [
        {
          type: "Text",
          text: "This is a test post from jsforce.",
        },
      ],
    },
    feedElementType : "FeedItem",
    subjectId: "me",
  })
  console.log(result)
})()
