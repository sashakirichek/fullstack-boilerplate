import {env} from 'cloudflare:workers'
import {httpServerHandler} from 'cloudflare:node'
import app from './server'
const PORT = process.env.PORT ? Number(process.env.PORT) : 3001

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})

export default httpServerHandler({port: PORT})
