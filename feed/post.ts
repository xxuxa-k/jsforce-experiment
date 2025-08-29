import { newJsforceConnection } from "../jsforceConnection"

(async () => {
  try {
    const conn = await newJsforceConnection()

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
      subjectId: "001J300000LmG8EIAV",
    })
    console.log(result)
  } catch (error) {
    console.error(error.message)
  }
})()
