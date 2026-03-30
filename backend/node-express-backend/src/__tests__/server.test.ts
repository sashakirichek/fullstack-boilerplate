import request from 'supertest'
import {createApp} from '../server'

describe('Express Server', () => {
  const app = createApp({} as any)

  it('GET / should return 200 with running message', async () => {
    const response = await request(app).get('/')
    expect(response.status).toBe(200)
    expect(response.text).toBe('Server is running')
  })
})
