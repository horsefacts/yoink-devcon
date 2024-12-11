import { Client } from "@upstash/qstash";

const client = new Client({
  token: process.env.QSTASH_TOKEN!,
});

export type QueueMessage = {
  url: string;
  body: Record<string, any>;
  notBefore?: number;
  retries?: number;
};

export async function queueMessage({
  url,
  body,
  notBefore,
  retries = 3,
}: QueueMessage) {
  return client.publishJSON({
    url: `${process.env.APP_URL}${url}`,
    body,
    ...(notBefore && { notBefore }),
    retries,
    contentBasedDeduplication: true,
  });
}
