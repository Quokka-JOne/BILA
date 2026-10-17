import { Pool } from 'pg'

const globalForDb = globalThis as unknown as { bilaPool?: Pool }

export const pool =
  globalForDb.bilaPool ??
  new Pool({
    connectionString: process.env.DATABASE_URL,
    max: 5,
  })

if (process.env.NODE_ENV !== 'production') globalForDb.bilaPool = pool
