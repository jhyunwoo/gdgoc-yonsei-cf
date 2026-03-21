import 'server-only'
import { getDB } from '@/lib/db'
import { asc, desc } from 'drizzle-orm'
import { user as users, usersToParts, parts } from '@/lib/db/schema'
import cacheTagT from '@/lib/server/cacheTagT'

export const preloadMembers = () => {
  void getMembers()
}

export async function getMembers() {
  'use cache'
  cacheTagT('members', 'parts', 'generations')
  const db = await getDB()
  return db.query.user.findMany({
    with: {
      usersToParts: {
        with: {
          part: {
            columns: {
              name: true,
            },
            with: {
              generation: {
                columns: {
                  id: false,
                },
              },
            },
          },
        },
        columns: {
          partId: false,
          userId: false,
        },
        orderBy: desc(usersToParts.partId),
      },
    },
    columns: {
      createdAt: false,
      emailVerified: false,
      id: false,
      registeredAt: false,
      studentId: false,
      telephone: false,
      updatedAt: false,
    },
    orderBy: asc(parts.id),
  })
}
