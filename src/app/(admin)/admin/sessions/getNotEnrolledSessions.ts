import { getDB } from '@/lib/db'
import { userToSession, sessions, parts } from '@/lib/db/schema'
import { and, asc, eq, gt, isNull, sql } from 'drizzle-orm'
import cacheTagT from '@/lib/server/cacheTagT'

export default async function getNotEnrolledSessions(userId: string) {
  'use cache'
  cacheTagT('sessions')
  const db = await getDB()
  const participantsSub = db
    .select({
      sessionId: userToSession.sessionId,
      participantCount: sql<number>`COUNT(${userToSession.userId})`.as(
        'participantCount'
      ),
    })
    .from(userToSession)
    .groupBy(userToSession.sessionId)
    .as('participants')

  const now = new Date()

  return db
    .select({
      id: sessions.id,
      name: sessions.nameKo,
      startAt: sessions.startAt,
      endAt: sessions.endAt,
      location: sessions.locationKo,
      maxCapacity: sessions.maxCapacity,
      partId: sessions.partId,
      part: parts.name,
      mainImage: sessions.mainImage,
      images: sessions.images,
      participantCount: participantsSub.participantCount,
    })
    .from(sessions)
    .innerJoin(parts, eq(sessions.partId, parts.id))
    .leftJoin(participantsSub, eq(sessions.id, participantsSub.sessionId))
    .leftJoin(
      userToSession,
      and(
        eq(userToSession.sessionId, sessions.id),
        eq(userToSession.userId, userId)
      )
    )
    .where(
      and(
        eq(sessions.internalOpen, true),
        gt(sessions.startAt, now),
        isNull(userToSession.userId)
      )
    )
    .orderBy(asc(sessions.startAt))
}
