import { createAuth } from "@/lib/auth";
import { getDB } from "@/lib/db";
import { toNextJsHandler } from "better-auth/next-js";

export const POST = async (req: Request) => {
  const db = await getDB();
  const auth = createAuth(db);
  return toNextJsHandler(auth).POST(req);
};

export const GET = async (req: Request) => {
  const db = await getDB();
  const auth = createAuth(db);
  return toNextJsHandler(auth).GET(req);
};
