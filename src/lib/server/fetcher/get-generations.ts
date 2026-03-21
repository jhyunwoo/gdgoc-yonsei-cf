import 'server-only'
import { getDB } from '@/lib/db'
import { asc } from 'drizzle-orm'
import { generations, parts } from '@/lib/db/schema'
import cacheTagT from '@/lib/server/cacheTagT'

export const preload = () => {
  void getGenerations()
}

export async function getGenerations() {
  'use cache'
  cacheTagT('generations', 'parts', 'members')
  const db = await getDB()
  return db.query.generations.findMany({
    columns: {
      id: false,
    },
    orderBy: asc(generations.id),
    with: {
      parts: {
        with: {
          usersToParts: {
            with: {
              user: true,
            },
          },
        },
        orderBy: asc(parts.id),
      },
    },
  })
}
