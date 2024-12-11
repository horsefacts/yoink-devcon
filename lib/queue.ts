import { Client } from "@upstash/qstash";

const client = new Client({
  token: process.env.QSTASH_TOKEN!,
});

export type QueueMessage = {
  url: string;
  body: Record<string, any>;
  messageId: string;
  notBefore?: number;
  retries?: number;
};

export async function queueMessage({
  url,
  body,
  messageId,
  notBefore,
  retries = 3,
}: QueueMessage) {
  return client.publishJSON({
    url: `${process.env.APP_URL}${url}`,
    body,
    ...(notBefore && { notBefore }),
    retries,
    deduplicationId: messageId.replaceAll(":", "_"),
  });
}

export async function scheduleNotificationProcessing() {
  return client.schedules.create({
    destination: `${process.env.APP_URL}api/process-notifications`,
    cron: "* * * * *",
    retries: 3,
    scheduleId: "process-notifications",
  });
}
