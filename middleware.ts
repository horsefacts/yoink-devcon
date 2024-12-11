import { verifySignature } from "@upstash/qstash/nextjs";

export const config = {
  matcher: ["/api/process-yoink", "/api/process-reminder"],
};

export default verifySignature;
