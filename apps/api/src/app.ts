import Fastify from 'fastify'
import cors from '@fastify/cors'
import { healthRoutes } from './routes/health'
import { tasksRoutes } from './routes/tasks'

export function buildApp() {
  const app = Fastify({
    logger: {
      level: 'info',
      transport:
        process.env.NODE_ENV === 'development'
          ? { target: 'pino-pretty' }
          : undefined,
    },
  })

  app.register(cors, { origin: true })
  app.register(healthRoutes , { prefix: '/health' })
  app.register(tasksRoutes, { prefix: '/tasks' })

  return app
}