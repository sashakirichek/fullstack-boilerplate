import {createApp} from './server'

interface Env {
  DB: D1Database
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const app = createApp(env.DB)
    const url = new URL(request.url)

    const body = request.body ? Buffer.from(await request.arrayBuffer()) : null

    return new Promise(resolve => {
      // Build Node.js-style mock req
      const reqHeaders: Record<string, string> = {}
      request.headers.forEach((v, k) => {
        reqHeaders[k.toLowerCase()] = v
      })

      const req: any = {
        method: request.method,
        url: url.pathname + url.search,
        headers: reqHeaders,
        socket: {remoteAddress: '127.0.0.1', encrypted: false},
        connection: {remoteAddress: '127.0.0.1'},
        httpVersion: '1.1',
        on(event: string, cb: (...args: any[]) => void) {
          if (event === 'data' && body) cb(body)
          if (event === 'end') cb()
          return this
        },
        resume() {
          return this
        },
        pipe() {},
        unpipe() {},
      }

      // Build Node.js-style mock res
      const resHeaders: Record<string, string | string[]> = {}
      const chunks: Uint8Array[] = []

      const res: any = {
        statusCode: 200,
        setHeader(name: string, value: string | string[]) {
          resHeaders[name.toLowerCase()] = value
          return this
        },
        getHeader(name: string) {
          return resHeaders[name.toLowerCase()]
        },
        getHeaders() {
          return resHeaders
        },
        hasHeader(name: string) {
          return name.toLowerCase() in resHeaders
        },
        removeHeader(name: string) {
          delete resHeaders[name.toLowerCase()]
        },
        writeHead(code: number, hdrs?: Record<string, string>) {
          res.statusCode = code
          if (hdrs) {
            for (const [k, v] of Object.entries(hdrs)) resHeaders[k.toLowerCase()] = v
          }
          return this
        },
        write(chunk: Buffer | string) {
          chunks.push(typeof chunk === 'string' ? new TextEncoder().encode(chunk) : chunk)
          return true
        },
        end(chunk?: Buffer | string) {
          if (chunk) chunks.push(typeof chunk === 'string' ? new TextEncoder().encode(chunk) : chunk)

          const flatHeaders: Record<string, string> = {}
          for (const [k, v] of Object.entries(resHeaders)) {
            flatHeaders[k] = Array.isArray(v) ? v.join(', ') : v
          }

          const totalLength = chunks.reduce((sum, c) => sum + c.length, 0)
          const combined = new Uint8Array(totalLength)
          let offset = 0
          for (const c of chunks) {
            combined.set(c, offset)
            offset += c.length
          }

          resolve(new Response(combined, {status: res.statusCode, headers: flatHeaders}))
        },
      }

      try {
        app(req, res)
      } catch {
        resolve(new Response('Internal Server Error', {status: 500}))
      }
    })
  },
}
