export type Task = {
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

export async function list(): Promise<Task[]> {
  return tasks
}

export async function findById(id: string): Promise<Task | null> {
  const task = tasks.find((t) => t.id === id)
  return task ?? null
}

export async function create(data: { title: string }): Promise<Task> {
  const task: Task = {
    id: crypto.randomUUID(),
    title: data.title,
    done: false,
    createdAt: new Date().toISOString(),
  }
  tasks.push(task)
  return task
}

export async function update(
  id: string,
  data: { title?: string; done?: boolean }
): Promise<Task | null> {
  const task = tasks.find((t) => t.id === id)
  if (!task) return null

  if (typeof data.title === 'string') task.title = data.title
  if (typeof data.done === 'boolean') task.done = data.done

  return task
}

export async function remove(id: string): Promise<boolean> {
  const idx = tasks.findIndex((t) => t.id === id)
  if (idx === -1) return false
  tasks.splice(idx, 1)
  return true
}
