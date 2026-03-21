import { getDB } from '@/lib/db'
import { desc } from 'drizzle-orm'
import { generations } from '@/lib/db/schema'
import cacheTagT from '@/lib/server/cacheTagT'

export default async function getLastGeneration() {
  'use cache'
  cacheTagT('generations')
  const db = await getDB()
  return db.query.generations.findFirst({
    orderBy: desc(generations.startDate),
  })
}
