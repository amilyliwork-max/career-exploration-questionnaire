import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { mkdir, appendFile, readFile, access } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const dataDir = path.resolve(__dirname, '../data')
const responsesPath = path.join(dataDir, 'responses.jsonl')
const emailsPath = path.join(dataDir, 'email_subscriptions.jsonl')

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

async function ensureDataDir() {
  await mkdir(dataDir, { recursive: true })
}

async function readJsonl(filePath: string): Promise<Record<string, unknown>[]> {
  try {
    await access(filePath)
  } catch {
    return []
  }
  const raw = await readFile(filePath, 'utf8')
  return raw
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => JSON.parse(line) as Record<string, unknown>)
}

function toCsv(rows: Record<string, unknown>[]): string {
  if (rows.length === 0) return ''
  const keys = Array.from(
    rows.reduce((set, row) => {
      Object.keys(row).forEach((k) => set.add(k))
      return set
    }, new Set<string>()),
  )
  const escape = (value: unknown) => {
    const str =
      value == null
        ? ''
        : Array.isArray(value) || typeof value === 'object'
          ? JSON.stringify(value)
          : String(value)
    return `"${str.replaceAll('"', '""')}"`
  }
  return [
    keys.join(','),
    ...rows.map((row) => keys.map((k) => escape(row[k])).join(',')),
  ].join('\n')
}

const app = new Hono()
app.use('*', cors())

app.get('/api/health', (c) => c.json({ ok: true }))

app.post('/api/submit', async (c) => {
  try {
    const body = await c.req.json<{
      submission_id?: string
      answers?: Record<string, unknown>
      marketing?: {
        submission_id: string
        email: string
        email_owner: string
        submitted_at: string
      } | null
    }>()

    if (!body.submission_id || !body.answers) {
      return c.json({ error: 'Invalid payload' }, 400)
    }

    const answers = { ...body.answers }
    delete answers.email
    delete answers.email_owner

    await ensureDataDir()
    await appendFile(responsesPath, `${JSON.stringify(answers)}\n`, 'utf8')

    if (body.marketing?.email && EMAIL_RE.test(body.marketing.email)) {
      await appendFile(emailsPath, `${JSON.stringify(body.marketing)}\n`, 'utf8')
    }

    return c.json({ ok: true, submission_id: body.submission_id })
  } catch (error) {
    console.error(error)
    return c.json({ error: 'Failed to save submission' }, 500)
  }
})

app.get('/api/export', async (c) => {
  const format = c.req.query('format') ?? 'json'
  const responses = await readJsonl(responsesPath)
  const email_subscriptions = await readJsonl(emailsPath)

  if (format === 'csv') {
    const csv = [
      '# responses',
      toCsv(responses),
      '',
      '# email_subscriptions',
      toCsv(email_subscriptions),
    ].join('\n')
    return c.body(csv, 200, {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': 'attachment; filename="career-questionnaire-export.csv"',
    })
  }

  return c.json({ responses, email_subscriptions })
})

const port = Number(process.env.PORT ?? 8787)
console.log(`API listening on http://localhost:${port}`)
serve({ fetch: app.fetch, port })
