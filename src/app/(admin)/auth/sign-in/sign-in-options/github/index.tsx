'use client'
import { authClient } from '@/lib/auth-client'
import GithubSubmitButton from '@/app/(admin)/auth/sign-in/sign-in-options/github/github-submit-button'

/**
 * Github 로그인 버튼
 * @constructor
 */
export default function SignInWithGithub() {
  return (
    <div
      onClick={async () => {
        await authClient.signIn.social({
            provider: 'github',
            callbackURL: '/admin'
        })
      }}
      className={'w-full cursor-pointer'}
    >
      <GithubSubmitButton />
    </div>
  )
}
