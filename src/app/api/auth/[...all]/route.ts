import { getAuth } from "@/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";
import { NextRequest } from "next/server";

async function handler(request: NextRequest, props: { params: Promise<{ all: string[] }> }) {
  const auth = await getAuth();
  const { POST, GET } = toNextJsHandler(auth);
  
  if (request.method === "POST") {
    return POST(request);
  }
  return GET(request);
}

export { handler as GET, handler as POST };
