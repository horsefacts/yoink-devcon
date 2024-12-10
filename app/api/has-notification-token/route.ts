import { getNotificationTokenForFid } from "../../../lib/kv";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const fid = searchParams.get("fid");

  if (!fid) {
    return Response.json({ hasToken: false });
  }

  const token = await getNotificationTokenForFid(Number(fid));
  return Response.json({ hasToken: !!token });
}
