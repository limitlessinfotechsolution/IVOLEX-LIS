import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import express from 'express'
import apiRoutes from '../../api/routes/apiRoutes.js'

describe('API Routes', () => {
  let server
  let app

  beforeAll(() => {
    app = express()
    app.use('/api', apiRoutes)
    server = app.listen(3002)
  })

  afterAll(() => {
    server.close()
  })

  it('should return health check status', async () => {
    const response = await fetch('http://localhost:3002/api/health')
    expect(response.status).toBe(200)

    const data = await response.json()
    expect(data).toHaveProperty('status', 'OK')
    expect(data).toHaveProperty('service', 'Ivolex API')
  })

  it('should return products list', async () => {
    const response = await fetch('http://localhost:3002/api/products')
    expect(response.status).toBe(200)

    const data = await response.json()
    expect(Array.isArray(data)).toBe(true)
  })

  it('should return enhanced products list', async () => {
    const response = await fetch('http://localhost:3002/api/enhanced-products')
    expect(response.status).toBe(200)

    const data = await response.json()
    expect(Array.isArray(data)).toBe(true)
  })
})
