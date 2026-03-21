import 'server-only'
import { getDB } from '@/lib/db'
import { generations } from '@/lib/db/schema'
import { desc } from 'drizzle-orm'
import cacheTagT from '@/lib/server/cacheTagT'

export const preload = () => {
  void getGenerations()
}

export async function getGenerations() {
  'use cache'
  cacheTagT('generations')

  console.log(new Date(), 'Fetch Generations Data')
  const db = await getDB()
  return db.select().from(generations).orderBy(desc(generations.id))
}
