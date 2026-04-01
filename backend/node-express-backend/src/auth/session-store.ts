import session from 'express-session'

/**
 * Lightweight express-session store backed by Cloudflare D1.
 *
 * The "Session" table must already exist (see migration 0003).
 * Expired rows are lazily removed on ~1 % of `set` calls.
 */
const DEFAULT_SESSION_MAX_AGE = 86_400_000 // 24 hours

/**
 * Probability of running expired-row cleanup on each `set` call.
 * At 1 % the DELETE runs roughly once per 100 session writes, keeping the
 * table tidy without adding a query to every single request. Raise the
 * value under heavy traffic or lower it if D1 write quotas are tight.
 */
const CLEANUP_PROBABILITY = 0.01

export class D1SessionStore extends session.Store {
  private readonly resolveDb: () => D1Database

  constructor(db: D1Database | (() => D1Database)) {
    super()
    this.resolveDb = typeof db === 'function' ? db : () => db
  }

  get = (sid: string, callback: (err?: unknown, session?: session.SessionData | null) => void): void => {
    this.resolveDb()
      .prepare('SELECT data FROM "Session" WHERE sid = ? AND expires_at > ?')
      .bind(sid, Date.now())
      .first<{data: string}>()
      .then(row => callback(null, row ? (JSON.parse(row.data) as session.SessionData) : null))
      .catch(err => callback(err))
  }

  set = (sid: string, sess: session.SessionData, callback?: (err?: unknown) => void): void => {
    const maxAge = sess.cookie?.maxAge ?? DEFAULT_SESSION_MAX_AGE
    const expiresAt = Date.now() + maxAge

    this.resolveDb()
      .prepare('INSERT OR REPLACE INTO "Session" (sid, data, expires_at) VALUES (?, ?, ?)')
      .bind(sid, JSON.stringify(sess), expiresAt)
      .run()
      .then(() => {
        this.maybeCleanup()
        callback?.()
      })
      .catch(err => callback?.(err))
  }

  destroy = (sid: string, callback?: (err?: unknown) => void): void => {
    this.resolveDb()
      .prepare('DELETE FROM "Session" WHERE sid = ?')
      .bind(sid)
      .run()
      .then(() => callback?.())
      .catch(err => callback?.(err))
  }

  touch = (sid: string, sess: session.SessionData, callback?: (err?: unknown) => void): void => {
    const maxAge = sess.cookie?.maxAge ?? DEFAULT_SESSION_MAX_AGE
    const expiresAt = Date.now() + maxAge

    this.resolveDb()
      .prepare('UPDATE "Session" SET expires_at = ? WHERE sid = ?')
      .bind(expiresAt, sid)
      .run()
      .then(() => callback?.())
      .catch(err => callback?.(err))
  }

  /** Delete expired rows with ~1 % probability to amortise cost. */
  private maybeCleanup(): void {
    if (Math.random() < CLEANUP_PROBABILITY) {
      this.resolveDb()
        .prepare('DELETE FROM "Session" WHERE expires_at <= ?')
        .bind(Date.now())
        .run()
        .catch(() => {})
    }
  }
}
