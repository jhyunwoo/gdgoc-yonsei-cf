import 'server-only'
import { getDB } from '@/lib/db'
import { user as users, usersToParts, parts, generations } from '@/lib/db/schema'
import { desc, eq } from 'drizzle-orm'
import cacheTagT from '@/lib/server/cacheTagT'

export const preload = (userId: string) => {
  void getMember(userId)
}
export async function getMember(userId: string) {
  'use cache'
  cacheTagT('members', 'generations', 'parts')

  console.log(new Date(), 'Fetch Member Data:', userId)
  const db = await getDB()
  const result = await db
    .select({
      id: users.id,
      name: users.name,
      firstName: users.firstName,
      firstNameKo: users.firstNameKo,
      lastName: users.lastName,
      lastNameKo: users.lastNameKo,
      role: users.role,
      image: users.image,
      part: parts.name,
      email: users.email,
      githubId: users.githubId,
      instagramId: users.instagramId,
      linkedInId: users.linkedInId,
      createdAt: users.createdAt,
      updatedAt: users.updatedAt,
      isForeigner: users.isForeigner,
      generation: generations.name,
      major: users.major,
      studentId: users.studentId,
      telephone: users.telephone,
      sessionNotiEmail: users.sessionNotiEmail,
    })
    .from(users)
    .where(eq(users.id, userId))
    .leftJoin(usersToParts, eq(usersToParts.userId, users.id))
    .leftJoin(parts, eq(parts.id, usersToParts.partId))
    .leftJoin(generations, eq(generations.id, parts.generationId))
    .orderBy(desc(generations.id), desc(parts.id), desc(users.updatedAt))
    .limit(1)

  return result[0]
}
