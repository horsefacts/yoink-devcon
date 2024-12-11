import { verifySignatureAppRouter } from "@upstash/qstash/nextjs";
import { getYoinksSinceId } from "../../../lib/contract";
import {
  getLastProcessedYoinkId,
  setLastProcessedYoinkId,
} from "../../../lib/kv";
import { queueMessage } from "../../../lib/queue";
import { getYoinksWithUsernames } from "../../../lib/neynar";

async function handler() {
  try {
    const lastProcessedId = await getLastProcessedYoinkId();
    console.log("Last processed yoink ID:", lastProcessedId);

    if (!lastProcessedId) {
      console.log("No last processed yoink ID found");
      return Response.json({ status: "no_last_yoink" });
    }

    const yoinks = await getYoinksSinceId(lastProcessedId);
    console.log(`Found ${yoinks.length} new yoinks since ${lastProcessedId}`);

    if (yoinks.length === 0) {
      return Response.json({ status: "no_new_yoinks" });
    }

    const yoinksWithUsernames = await getYoinksWithUsernames(yoinks);

    for (const yoink of yoinks) {
      const username =
        yoinksWithUsernames?.find(
          (activity) => activity.by && activity.timestamp === yoink.timestamp,
        )?.by ?? "Someone";

      const yoinkId = `yoink:${yoink.id}`;
      console.log(`Queueing notification for yoink ${yoinkId} by ${username}`);

      /*await queueMessage({
        messageId: yoinkId,
        url: "api/process-yoink",
        body: {
          yoinkId,
          from: yoink.from,
          by: yoink.by,
          username,
        },
      });*/
      console.log("Queued message:", {
        yoinkId,
        from: yoink.from,
        by: yoink.by,
        username,
      });
    }

    console.log(`Setting last processed ID to ${yoinks[0]!.id}`);
    await setLastProcessedYoinkId(yoinks[0]!.id);

    return Response.json({
      status: "success",
      processed: yoinks.length,
    });
  } catch (error) {
    console.error("Error processing notifications:", error);
    return Response.json(
      { error: "Failed to process notifications" },
      { status: 500 },
    );
  }
}

export const POST = verifySignatureAppRouter(handler);
