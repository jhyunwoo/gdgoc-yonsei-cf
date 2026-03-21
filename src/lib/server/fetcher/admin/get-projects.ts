/**
 * @file This file contains a server-side function for fetching all projects.
 * It uses Next.js's unstable_cache for caching.
 */

import 'server-only'
import { getDB } from '@/lib/db'
import { desc } from 'drizzle-orm'
import { projects } from '@/lib/db/schema'
import cacheTagT from '@/lib/server/cacheTagT'

export const preload = () => {
  void getProjects()
}

export async function getProjects() {
  'use cache'
  cacheTagT('projects')

  console.log(new Date(), 'Fetch Projects Data')
  const db = await getDB()
  return db.query.projects.findMany({
    orderBy: desc(projects.updatedAt),
  })
}
