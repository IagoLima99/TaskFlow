import { pool } from '../db'

export type Task = {
  id: string
  title: string
  done: boolean
  createdAt: string
  updatedAt: string
}

type TaskRow = {
  id: string
  title: string
  done: boolean
  created_at: Date | string
  updated_at: Date | string
}

function mapRowToTask(row: TaskRow): Task {
  return {
    id: row.id,
    title: row.title,
    done: row.done,
    createdAt: new Date(row.created_at).toISOString(),
    updatedAt: new Date(row.updated_at).toISOString(),
  }
}

export async function list(): Promise<Task[]> {
  const result = await pool.query<TaskRow>(
    'SELECT id, title, done, created_at, updated_at FROM tasks ORDER BY created_at ASC'
  )
  return result.rows.map(mapRowToTask)
}

export async function findById(id: string): Promise<Task | null> {
  const result = await pool.query<TaskRow>(
    'SELECT id, title, done, created_at, updated_at FROM tasks WHERE id = $1',
    [id]
  )
  const row = result.rows[0]
  if (!row) return null
  return mapRowToTask(row)
}

export async function create(data: { title: string }): Promise<Task> {
  const result = await pool.query<TaskRow>(
    'INSERT INTO tasks (title) VALUES ($1) RETURNING id, title, done, created_at, updated_at',
    [data.title]
  )
  const row = result.rows[0]
  if (!row) {
    throw new Error('Failed to create task')
  }
  return mapRowToTask(row)
}

export async function update(
  id: string,
  data: { title?: string; done?: boolean }
): Promise<Task | null> {
  const fields: string[] = []
  const values: unknown[] = []
  let idx = 1

  if (typeof data.title === 'string') {
    fields.push(`title = $${idx++}`)
    values.push(data.title)
  }

  if (typeof data.done === 'boolean') {
    fields.push(`done = $${idx++}`)
    values.push(data.done)
  }

  if (fields.length === 0) {
    return findById(id)
  }

  fields.push(`updated_at = NOW()`)
  values.push(id)

  const query = `
    UPDATE tasks
    SET ${fields.join(', ')}
    WHERE id = $${idx}
    RETURNING id, title, done, created_at, updated_at
  `

  const result = await pool.query<TaskRow>(query, values)
  const row = result.rows[0]
  if (!row) return null
  return mapRowToTask(row)
}

export async function remove(id: string): Promise<boolean> {
  const result = await pool.query('DELETE FROM tasks WHERE id = $1', [id])
  return (result.rowCount ?? 0) > 0
}
