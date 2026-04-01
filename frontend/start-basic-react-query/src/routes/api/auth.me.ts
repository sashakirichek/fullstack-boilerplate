import {createFileRoute} from '@tanstack/react-router'

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3001'

export const Route = createFileRoute('/api/auth/me')({
  server: {
    handlers: {
      GET: async ({request}) => {
        const res = await fetch(`${BACKEND_URL}/auth/me`, {
          headers: {cookie: request.headers.get('cookie') || ''},
        })
        const headers = new Headers(res.headers)
        headers.set('content-type', res.headers.get('content-type') || 'application/json')
        return new Response(res.body, {
          status: res.status,
          headers,
        })
      },
    },
  },
})
