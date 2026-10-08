import type { FastifyPluginAsync } from 'fastify'
import * as tasksRepo from '../repositories/tasks'

export const tasksRoutes: FastifyPluginAsync = async (app) => {
  app.get('/', async () => {
    return tasksRepo.list()
  })

  app.post('/', async (req, reply) => {
    const body = req.body as { title?: unknown }
    if (typeof body?.title !== 'string' || body.title.trim() === '') {
      return reply.status(400).send({ error: 'title is required' })
    }
    const task = await tasksRepo.create({ title: body.title.trim() })
    return reply.status(201).send(task)
  })

  app.patch('/:id', async (req, reply) => {
    const { id } = req.params as { id: string }
    const body = req.body as { title?: string; done?: boolean }
    const task = await tasksRepo.update(id, body)
    if (!task) return reply.status(404).send({ error: 'not found' })
    return task
  })

  app.delete('/:id', async (req, reply) => {
    const { id } = req.params as { id: string }
    const deleted = await tasksRepo.remove(id)
    if (!deleted) return reply.status(404).send({ error: 'not found' })
    return reply.status(204).send()
  })
}