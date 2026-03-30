import {env} from 'cloudflare:workers'
import {createApp} from './server'

interface CloudflareEnv {
  DB: D1Database
}

const PORT = process.env.PORT ? Number(process.env.PORT) : 3001
const app = createApp((env as unknown as CloudflareEnv).DB)

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
