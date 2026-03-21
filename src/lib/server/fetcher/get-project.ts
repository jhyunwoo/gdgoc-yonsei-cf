import 'server-only'
import { getDB } from '@/lib/db'
import { eq } from 'drizzle-orm'
import { projects } from '@/lib/db/schema'
import cacheTagT from '@/lib/server/cacheTagT'

export const preload = (projectId: string) => {
  void getProject(projectId)
}

export async function getProject(projectId: string) {
  'use cache'
  cacheTagT('projects')
  const db = await getDB()

  return db.query.projects.findFirst({
    where: eq(projects.id, projectId),
    with: {
      usersToProjects: {
        with: {
          user: true,
        },
      },
    },
  })
}
