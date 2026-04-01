import express, {type Express, type Request, type Response} from 'express'
import session from 'express-session'
import passport from 'passport'
import cors from 'cors'
import {PrismaClient} from './generated/prisma'
import {PrismaD1} from '@prisma/adapter-d1'
import {D1SessionStore} from './auth/session-store'
import {configurePassport} from './auth/passport'
import {createAuthRouter} from './auth/routes'

export interface AuthConfig {
  sessionSecret: string
  google: {clientId: string; clientSecret: string}
  backendUrl: string
  appUrl: string
}

export interface AppConfig {
  db: D1Database | (() => D1Database)
  auth?: AuthConfig | undefined
}

export function createApp(config: AppConfig) {
  const getDb = (): D1Database => (typeof config.db === 'function' ? config.db() : (config.db as D1Database))

  function getPrisma(): PrismaClient {
    return new PrismaClient({adapter: new PrismaD1(getDb())})
  }

  const app: Express = express()
  app.use(express.json())

  // ── CORS ──────────────────────────────────────────────────────
  // Apply CORS globally for all routes
  const corsOrigins = config.auth ? [config.auth.appUrl, 'visual-programming-4jx.pages.dev'] : '*'
  app.use(cors({origin: corsOrigins, credentials: !!config.auth}))

  if (config.auth) {
    const {auth} = config
    const isSecure = auth.backendUrl.startsWith('https')

    app.set('trust proxy', 1)

    app.use(
      session({
        name: 'sid',
        secret: auth.sessionSecret,
        resave: false,
        saveUninitialized: false,
        store: new D1SessionStore(getDb),
        cookie: {
          httpOnly: true,
          secure: isSecure,
          sameSite: 'lax',
          maxAge: 24 * 60 * 60 * 1000, // 24 h
        },
      }),
    )

    configurePassport(getPrisma, {
      clientId: auth.google.clientId,
      clientSecret: auth.google.clientSecret,
      callbackUrl: `${auth.backendUrl}/auth/google/callback`,
    })

    app.use(passport.initialize())
    app.use(passport.session())

    app.use(
      createAuthRouter({
        appUrl: auth.appUrl,
      }),
    )
  }

  // ── API routes ───────────────────────────────────────────────

  app.get('/posts', async (_req: Request, res: Response) => {
    const posts = await getPrisma().post.findMany()
    res.json({items: posts})
  })

  app.get('/posts/:id', async (req: Request, res: Response) => {
    const id = parseInt(req.params.id as string, 10)
    if (isNaN(id)) {
      res.status(400).json({error: 'Invalid post ID'})
      return
    }
    const post = await getPrisma().post.findUnique({where: {id}})
    if (!post) {
      res.status(404).json({error: 'Post not found'})
      return
    }
    res.json(post)
  })

  app.get('/', (_req: Request, res: Response) => {
    res.send('Server is running')
  })

  return app
}
