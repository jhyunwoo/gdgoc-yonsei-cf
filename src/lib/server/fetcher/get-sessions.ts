import 'server-only'
import { getDB } from '@/lib/db'
import cacheTagT from '@/lib/server/cacheTagT'
import { lte } from 'drizzle-orm'
import { sessions } from '@/lib/db/schema'

export const preload = () => {
  void getSessions()
}

export async function getSessions() {
  'use cache'
  cacheTagT('sessions')
  const db = await getDB()

  return db.query.sessions.findMany({
    with: {
      part: {
        with: {
          generation: true,
        },
      },
    },
    where: lte(sessions.endAt, new Date()),
  })
}
