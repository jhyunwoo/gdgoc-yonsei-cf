'use server'

import { auth } from '@/lib/auth'
import { getMember } from '@/lib/server/fetcher/admin/get-member'
import { getDB } from '@/lib/db'
import { user as users } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import refresh from '@/app/components/admin/refresh-all-data-button/actions'

export async function changeSubscribeSessionNotiEmail(formData: FormData) {
  const session = await auth()

  if (!session?.user?.id) {
    return refresh()
  }

  const userData = await getMember(session.user.id)

  const db = await getDB()
  await db
    .update(users)
    .set({
      sessionNotiEmail: !userData.sessionNotiEmail,
    })
    .where(eq(users.id, session.user.id))

  await refresh()
}
