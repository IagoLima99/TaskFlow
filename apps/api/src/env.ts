import { config } from 'dotenv'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const here = dirname(fileURLToPath(import.meta.url))
const rootEnv = resolve(here, '../../../.env')

config({ path: rootEnv })

export const env = {
  PORT: Number(process.env.PORT ?? 3333),
  DATABASE_URL: process.env.DATABASE_URL ?? '',
  NODE_ENV: process.env.NODE_ENV ?? 'development',
}