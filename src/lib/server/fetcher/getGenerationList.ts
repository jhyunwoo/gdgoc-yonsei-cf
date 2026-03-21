'use cache'

import { getDB } from '@/lib/db'
import { generations } from '@/lib/db/schema'
import { asc } from 'drizzle-orm'
import cacheTagT from '@/lib/server/cacheTagT'

export default async function getGenerationList() {
  cacheTagT('generations')
  const db = await getDB()

  return db
    .select({ id: generations.id, name: generations.name })
    .from(generations)
    .orderBy(asc(generations.startDate))
}
