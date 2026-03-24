import express, {Request, Response} from 'express'

const app = express()

app.get('/', (_req: Request, res: Response) => {
  res.send('Server is running')
})

export default app
