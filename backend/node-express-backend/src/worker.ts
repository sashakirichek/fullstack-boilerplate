import {env} from 'cloudflare:workers'
import {httpServerHandler} from 'cloudflare:node'
import {createApp, type AuthConfig} from './server'

interface CloudflareEnv {
  DB: D1Database
  GOOGLE_CLIENT_ID?: string
  GOOGLE_CLIENT_SECRET?: string
  SESSION_SECRET?: string
  APP_URL?: string
  BACKEND_URL?: string
}

const cfEnv = env as unknown as CloudflareEnv

function buildAuthConfig(): AuthConfig | undefined {
  if (!cfEnv.GOOGLE_CLIENT_ID || !cfEnv.GOOGLE_CLIENT_SECRET || !cfEnv.SESSION_SECRET) {
    console.warn(
      'Auth disabled: missing',
      [
        !cfEnv.GOOGLE_CLIENT_ID && 'GOOGLE_CLIENT_ID',
        !cfEnv.GOOGLE_CLIENT_SECRET && 'GOOGLE_CLIENT_SECRET',
        !cfEnv.SESSION_SECRET && 'SESSION_SECRET',
      ]
        .filter(Boolean)
        .join(', '),
    )
    return undefined
  }
  return {
    sessionSecret: cfEnv.SESSION_SECRET,
    google: {clientId: cfEnv.GOOGLE_CLIENT_ID, clientSecret: cfEnv.GOOGLE_CLIENT_SECRET},
    backendUrl: cfEnv.BACKEND_URL || 'http://localhost:3001',
    appUrl: cfEnv.APP_URL || 'http://localhost:3000',
  }
}

const PORT = 3001
const app = createApp({db: () => cfEnv.DB, auth: buildAuthConfig()})

app.listen(PORT)
export default httpServerHandler({port: PORT})
