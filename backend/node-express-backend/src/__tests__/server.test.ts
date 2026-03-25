import request from 'supertest'
import app from '../server'

describe('Express Server', () => {
  it('GET / should return 200 with running message', async () => {
    const response = await request(app).get('/')
    expect(response.status).toBe(200)
    expect(response.text).toBe('Server is running')
  })
})
