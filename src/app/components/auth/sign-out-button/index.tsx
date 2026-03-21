'use client'
import { authClient } from '@/lib/auth-client'
import { useRouter } from 'next/navigation'

export function SignOutButton({ className }: { className?: string }) {
  const router = useRouter()
  return (
    <form action={async () => {
        await authClient.signOut()
        router.refresh()
    }}>
      <button className={className} type="submit">
        Sign Out
      </button>
    </form>
  )
}
