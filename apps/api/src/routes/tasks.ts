import type { FastifyPluginAsync } from 'fastify'

type Task = {
  id: string
  title: string
  done: boolean
  createdAt: string
}

const tasks: Task[] = [
  {
    id: crypto.randomUUID(),
    title: 'Aprender Fastify',
    done: false,
    createdAt: new Date().toISOString(),
  },
]

export const tasksRoutes: FastifyPluginAsync = async (app) => {
  app.get('/', async () => tasks)

  app.post('/', async (req, reply) => {
    const body = req.body as { title?: unknown }
    if (typeof body?.title !== 'string' || body.title.trim() === '') {
      return reply.status(400).send({ error: 'title is required' })
    }
    const task: Task = {
      id: crypto.randomUUID(),
      title: body.title.trim(),
      done: false,
      createdAt: new Date().toISOString(),
    }
    tasks.push(task)
    return reply.status(201).send(task)
  })

  app.patch('/:id', async (req, reply) => {
    const { id } = req.params as { id: string }
    const task = tasks.find((t) => t.id === id)
    if (!task) return reply.status(404).send({ error: 'not found' })

    const body = req.body as Partial<Pick<Task, 'title' | 'done'>>
    if (typeof body.title === 'string') task.title = body.title
    if (typeof body.done === 'boolean') task.done = body.done
    return task
  })

  app.delete('/:id', async (req, reply) => {
    const { id } = req.params as { id: string }
    const idx = tasks.findIndex((t) => t.id === id)
    if (idx === -1) return reply.status(404).send({ error: 'not found' })
    tasks.splice(idx, 1)
    return reply.status(204).send()
  })
}