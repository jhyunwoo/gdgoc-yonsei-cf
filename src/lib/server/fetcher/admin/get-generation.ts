import 'server-only'
import { getDB } from '@/lib/db'
import { generations } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import cacheTagT from '@/lib/server/cacheTagT'

export const preloadGeneration = (generationId: number) => {
  void getGeneration(generationId)
}

export async function getGeneration(generationId: number) {
  'use cache'
  cacheTagT('generations', 'members', 'parts')

  console.log(new Date(), 'Fetch Generation Data', generationId)
  const db = await getDB()
  return db.query.generations.findFirst({
    where: eq(generations.id, generationId),
    with: {
      parts: {
        with: {
          usersToParts: {
            with: {
              user: true,
            },
          },
        },
      },
    },
  })
}
