import type { FastifyPluginAsync } from 'fastify'
import { pool } from '../db'

export const healthRoutes: FastifyPluginAsync = async (app) => {
  app.get('/', async (_req, reply) => {
    try {
      await pool.query('SELECT 1')
      return { status: 'ok', db: 'up', ts: new Date().toISOString() }
    } catch (err) {
      app.log.error(err)
      return reply.status(503).send({ status: 'error', db: 'down' })
    }
  })
}