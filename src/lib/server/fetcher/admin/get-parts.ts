import 'server-only'
import { getDB } from '@/lib/db'
import { asc, desc } from 'drizzle-orm'
import { generations, parts } from '@/lib/db/schema'
import cacheTagT from '@/lib/server/cacheTagT'

export const preload = () => {
  void getParts()
}

export async function getParts() {
  'use cache'
  cacheTagT('parts', 'members')

  console.log(new Date(), 'Fetch Parts Data')
  const db = await getDB()
  return db.query.generations.findMany({
    with: {
      parts: {
        with: {
          usersToParts: {
            with: {
              user: true, // Include full user object for each member
            },
          },
        },
      },
    },
    orderBy: [desc(generations.id), asc(parts.createdAt)],
  })
}
