import express, {Express, Request, Response} from 'express'
import {PrismaClient} from './generated/prisma'
import {PrismaD1} from '@prisma/adapter-d1'

export function createApp(db: D1Database) {
  const adapter = new PrismaD1(db)
  const prisma = new PrismaClient({adapter})
  const app: Express = express()
  app.use(express.json())

  app.get('/posts', async (_req: Request, res: Response) => {
    const posts = await prisma.post.findMany()
    res.json({items: posts})
  })

  app.get('/posts/:id', async (req: Request, res: Response) => {
    const id = parseInt(req.params.id!, 10)
    if (isNaN(id)) {
      res.status(400).json({error: 'Invalid post ID'})
      return
    }
    const post = await prisma.post.findUnique({where: {id}})
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
