import { createAuth } from "@/lib/auth";
import { getDB } from "@/lib/db";
import { headers } from "next/headers";

export async function getAuth() {
  const db = await getDB();
  return createAuth(db);
}

export async function getSession() {
  const auth = await getAuth();
  if (!auth) return null;

  // headers()를 사용하여 현재 요청의 세션 확인
  return auth.api.getSession({
    headers: await headers(),
  });
}
