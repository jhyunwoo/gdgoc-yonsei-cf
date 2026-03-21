import 'server-only'
import { getDB } from '@/lib/db'
import cacheTagT from '@/lib/server/cacheTagT'
import { projects } from '@/lib/db/schema'

export const preload = () => {
  void getProjects()
}

export async function getProjects() {
  'use cache'
  cacheTagT('projects', 'generations')
  const db = await getDB()

  return db.query.projects.findMany({
    with: {
      generation: true,
    },
  })
}
