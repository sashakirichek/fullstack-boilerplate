import passport from 'passport'
import {GoogleOAuth2Strategy} from './google-oauth'
import type {PrismaClient} from '../generated/prisma'

export interface GoogleStrategyConfig {
  clientId: string
  clientSecret: string
  callbackUrl: string
}

export function configurePassport(getPrisma: () => PrismaClient, config: GoogleStrategyConfig): void {
  passport.use(
    new GoogleOAuth2Strategy(
      {
        clientID: config.clientId,
        clientSecret: config.clientSecret,
        callbackURL: config.callbackUrl,
      },
      async (_accessToken, _refreshToken, profile, done) => {
        try {
          const user = await getPrisma().user.upsert({
            where: {provider_providerId: {provider: 'google', providerId: profile.id}},
            update: {},
            create: {id: crypto.randomUUID(), provider: 'google', providerId: profile.id},
          })
          done(null, {id: user.id, provider: user.provider})
        } catch (err) {
          done(err as Error)
        }
      },
    ),
  )

  passport.serializeUser((user: Express.User, done) => {
    done(null, user)
  })

  passport.deserializeUser((user: Express.User, done) => {
    done(null, user)
  })
}
