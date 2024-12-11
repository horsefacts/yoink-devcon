import { scheduleNotificationProcessing } from "../lib/queue.js";

async function main() {
  try {
    const result = await scheduleNotificationProcessing();
    console.log("Scheduled notification processing:", result);
  } catch (error) {
    console.error("Failed to schedule notifications:", error);
    process.exit(1);
  }
}

main();
