import EmbeddedPostgres from 'embedded-postgres'
import { Client, Pool } from 'pg'
import { getMigrations } from 'better-auth/db/migration'
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { randomBytes } from 'node:crypto'
import path from 'node:path'

const localDir = path.resolve('.local')
mkdirSync(localDir, { recursive: true })
const configPath = path.join(localDir, 'database.json')
const config = existsSync(configPath)
  ? JSON.parse(readFileSync(configPath, 'utf8'))
  : { password: randomBytes(24).toString('hex'), port: 54329 }
if (!existsSync(configPath)) writeFileSync(configPath, JSON.stringify(config))

const databaseDir = path.join(localDir, 'postgres')
const postgres = new EmbeddedPostgres({
  databaseDir,
  user: 'bila',
  password: config.password,
  port: config.port,
  persistent: true,
  initdbFlags: ['--encoding=UTF8', '--locale=C'],
  postgresFlags: ['-h', '127.0.0.1'],
})

if (!existsSync(path.join(databaseDir, 'PG_VERSION'))) await postgres.initialise()
const connectionString = `postgresql://bila:${config.password}@127.0.0.1:${config.port}/bila`
const adminConfig = { host: '127.0.0.1', port: config.port, user: 'bila', password: config.password, database: 'postgres' }
const probe = new Client(adminConfig)
let started = false
try {
  await probe.connect()
} catch {
  await postgres.start()
  started = true
} finally {
  await probe.end().catch(() => {})
}
const admin = new Client(adminConfig)
await admin.connect()
if (!(await admin.query("SELECT 1 FROM pg_database WHERE datname = 'bila'")).rowCount) {
  await admin.query('CREATE DATABASE bila')
}
await admin.end()
const pool = new Pool({ connectionString })
try {
  const migrations = await getMigrations({ database: pool, emailAndPassword: { enabled: true } })
  await migrations.runMigrations()
  await pool.query(readFileSync('lib/schema.sql', 'utf8'))
} finally {
  await pool.end()
}

if (!existsSync('.env.local')) {
  writeFileSync('.env.local', `DATABASE_URL=${connectionString}\nBETTER_AUTH_URL=http://localhost:3000\nBETTER_AUTH_SECRET=${randomBytes(32).toString('hex')}\n`)
}
console.log('Base de datos BILA lista en 127.0.0.1:' + config.port)
console.log('Datos persistentes en .local/postgres. Usa Ctrl+C para detenerla.')
for (const signal of ['SIGINT', 'SIGTERM']) {
  process.once(signal, async () => {
    if (started) await postgres.stop()
    process.exit(0)
  })
}
setInterval(() => {}, 60_000)
