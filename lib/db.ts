import { Pool } from 'pg'

const globalForDb = globalThis as unknown as { bilaPool?: Pool }

const isNeon =
  process.env.DATABASE_URL?.includes('neon.tech') ||
  process.env.DATABASE_URL?.includes('sslmode=require')

export const pool =
  globalForDb.bilaPool ??
  new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: isNeon || process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : undefined,
    max: 5,
    connectionTimeoutMillis: 1000,
  })

if (process.env.NODE_ENV !== 'production') globalForDb.bilaPool = pool

