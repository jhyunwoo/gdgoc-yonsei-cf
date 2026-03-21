import { sessions, generations } from '@/lib/db/schema'
import 'server-only'
import { getDB } from '@/lib/db'
import { desc } from 'drizzle-orm'
import { cacheTag } from 'next/dist/server/use-cache/cache-tag'

export const preload = () => {
  void getSessions()
}

export async function getSessions() {
  'use cache'
  console.log(new Date(), 'Fetch Sessions Data')
  cacheTag('generations', 'sessions')
  const db = await getDB()

  return db.query.generations.findMany({
    with: {
      parts: {
        with: {
          sessions: {
            orderBy: desc(sessions.startAt),
          },
        },
      },
    },
    orderBy: desc(generations.id),
  })
}
