import express, { Express, Request, Response } from 'express'

const app: Express = express()

app.get('/', (_req: Request, res: Response) => {
  res.send('Server is running')
})

export default app
