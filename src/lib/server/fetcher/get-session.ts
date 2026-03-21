import 'server-only'
import { getDB } from '@/lib/db'
import { and, eq, lte } from 'drizzle-orm'
import { sessions } from '@/lib/db/schema'
import cacheTagT from '@/lib/server/cacheTagT'

export const preload = (sessionId: string) => {
  void getSession(sessionId)
}

export async function getSession(sessionId: string) {
  'use cache'
  cacheTagT('sessions')
  const db = await getDB()

  return db.query.sessions.findFirst({
    where: and(
      eq(sessions.id, sessionId),
      lte(sessions.endAt, new Date()),
      eq(sessions.displayOnWebsite, true)
    ),
  })
}
