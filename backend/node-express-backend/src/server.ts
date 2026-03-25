import express, {Express, Request, Response} from 'express'

const app: Express = express()

app.get('/posts', (_req: Request, res: Response) => {
  res.json({
    items: [
      {id: 1, text: 'text1'},
      {id: 2, text: 'text2'},
      {id: 3, text: 'text3'},
      {id: 4, text: 'text4'},
      {id: 5, text: 'text5'},
    ],
  })
})

app.get('/', (_req: Request, res: Response) => {
  res.send('Server is running')
})

export default app
