import {createFileRoute} from '@tanstack/react-router'

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3001'

export const Route = createFileRoute('/api/auth/google')({
  server: {
    handlers: {
      GET: async () => {
        return new Response(null, {
          status: 302,
          headers: {location: `${BACKEND_URL}/auth/google`},
        })
      },
    },
  },
})
