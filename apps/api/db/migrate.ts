import { readFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { pool } from '../src/db'

const here = dirname(fileURLToPath(import.meta.url))
const schemaPath = resolve(here, 'schema.sql')
const schemaSql = readFileSync(schemaPath, 'utf-8')

async function runMigration() {
  console.log('[migrate] Applying schema.sql...')
  const client = await pool.connect()
  try {
    await client.query(schemaSql)
    console.log('[migrate] Migration applied successfully!')
  } finally {
    client.release()
    await pool.end()
  }
}

runMigration().catch((err) => {
  console.error('[migrate] Migration failed:', err)
  process.exit(1)
})
