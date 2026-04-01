import {createFileRoute} from '@tanstack/react-router'

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3001'

export const Route = createFileRoute('/api/auth/logout')({
  server: {
    handlers: {
      POST: async ({request}) => {
        const res = await fetch(`${BACKEND_URL}/auth/logout`, {
          method: 'POST',
          headers: {cookie: request.headers.get('cookie') || ''},
        })
        const headers = new Headers({
          'content-type': res.headers.get('content-type') || 'application/json',
        })
        const setCookie = res.headers.get('set-cookie')
        if (setCookie) {
          headers.set('set-cookie', setCookie)
        }
        return new Response(res.body, {status: res.status, headers})
      },
    },
  },
})
