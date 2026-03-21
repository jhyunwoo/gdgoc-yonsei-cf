import 'server-only'
import { getDB } from '@/lib/db'
import { desc, eq } from 'drizzle-orm'
import { parts } from '@/lib/db/schema'
import cacheTagT from '@/lib/server/cacheTagT'

export const preload = (partId: number) => {
  void getPart(partId)
}

export async function getPart(partId: number) {
  'use cache'
  cacheTagT('parts', 'members')

  console.log(new Date(), 'Fetch Part Data', partId)
  const db = await getDB()
  return db.query.parts.findFirst({
    where: eq(parts.id, partId),
    with: {
      usersToParts: {
        with: {
          user: true, // Include the full user object for each member
        },
      },
    },
    orderBy: desc(parts.createdAt),
  })
}
