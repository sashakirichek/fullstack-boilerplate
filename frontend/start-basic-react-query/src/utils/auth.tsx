import {queryOptions, useMutation, useQueryClient} from '@tanstack/react-query'
import axios from 'redaxios'

export type AuthUser = {
  id: string
  provider: string
}

function isAuthUser(v: unknown): v is AuthUser {
  return (
    typeof v === 'object' &&
    v !== null &&
    typeof (v as AuthUser).id === 'string' &&
    typeof (v as AuthUser).provider === 'string'
  )
}

export const authQueryOptions = () =>
  queryOptions({
    queryKey: ['auth', 'me'],
    queryFn: () =>
      axios
        .get<AuthUser>('/api/auth/me')
        .then(r => (isAuthUser(r.data) ? r.data : null))
        .catch(() => null),
    staleTime: 5 * 60 * 1000,
    retry: false,
  })

export function getLoginUrl() {
  return '/api/auth/google'
}

export function useLogout() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => axios.post('/api/auth/logout'),
    onSuccess: () => {
      queryClient.setQueryData(['auth', 'me'], null)
    },
  })
}
