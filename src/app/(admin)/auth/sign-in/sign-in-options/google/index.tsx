'use client'
import { authClient } from '@/lib/auth-client'
import GoogleSubmitButton from '@/app/(admin)/auth/sign-in/sign-in-options/google/google-submit-button'

/**
 * Google 로그인 버튼
 * @constructor
 */
export default function SignInWithGoogle() {
  return (
    <div
      onClick={async () => {
        await authClient.signIn.social({
            provider: 'google',
            callbackURL: '/admin' // Adapting to typical redirect flow
        })
      }}
      className={'w-full cursor-pointer'}
    >
      <GoogleSubmitButton />
    </div>
  )
}
