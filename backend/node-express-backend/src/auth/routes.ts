import {Router, type Request, type Response} from 'express'
import passport from 'passport'

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface User {
      id: string
      provider: string
    }
  }
}

export interface AuthRouterConfig {
  appUrl: string
}

export function createAuthRouter(config: AuthRouterConfig): Router {
  const router = Router()

  // ── Initiate Google login ────────────────────────────────────
  router.get('/auth/google', passport.authenticate('google'))

  // ── Google callback ──────────────────────────────────────────
  router.get(
    '/auth/google/callback',
    passport.authenticate('google', {failureRedirect: `${config.appUrl}?auth=error`}),
    (_req: Request, res: Response) => {
      res.redirect(config.appUrl)
    },
  )

  // ── Current user ─────────────────────────────────────────────
  router.get('/auth/me', (req: Request, res: Response) => {
    if (req.user) {
      res.json({id: req.user.id, provider: req.user.provider})
    } else {
      res.status(401).json({error: 'Authentication required'})
    }
  })

  // ── Logout ───────────────────────────────────────────────────
  router.post('/auth/logout', (req: Request, res: Response) => {
    req.logout(err => {
      if (err) {
        res.status(500).json({error: 'Logout failed'})
        return
      }
      req.session.destroy(destroyErr => {
        if (destroyErr) {
          res.status(500).json({error: 'Logout failed'})
          return
        }
        res.clearCookie('sid')
        res.json({ok: true})
      })
    })
  })

  return router
}
