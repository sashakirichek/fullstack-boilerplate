import {useQuery} from '@tanstack/react-query'
import {authQueryOptions, getLoginUrl, useLogout} from '~/utils/auth'

export function AuthStatus() {
  const {data: user, isLoading} = useQuery(authQueryOptions())
  const logout = useLogout()

  if (isLoading) {
    return <span className="text-sm text-gray-500">...</span>
  }

  if (!user) {
    return (
      <a
        href={getLoginUrl()}
        className="text-sm text-blue-700 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
      >
        Sign in with Google
      </a>
    )
  }

  return (
    <span className="flex items-center gap-2 text-sm">
      <span
        className="text-gray-600 dark:text-gray-400"
        title={`${user.provider}:${user.id}`}
        aria-label={`${user.provider}:${user.id}`}
      >
        {user.provider}:{user.id.slice(0, 8)}
      </span>
      <button
        type="button"
        onClick={() => logout.mutate()}
        disabled={logout.isPending}
        className="text-red-600 hover:text-red-500 dark:text-red-400 dark:hover:text-red-300 disabled:opacity-50"
      >
        {logout.isPending ? 'Signing out...' : 'Sign out'}
      </button>
    </span>
  )
}
