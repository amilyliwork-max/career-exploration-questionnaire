import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

interface ExportPayload {
  responses: Record<string, unknown>[]
  email_subscriptions: Record<string, unknown>[]
}

export function AdminExportPage() {
  const [data, setData] = useState<ExportPayload | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/export?format=json')
      if (!res.ok) throw new Error('Could not load responses.')
      const json = (await res.json()) as ExportPayload
      setData(json)
    } catch {
      setError('Could not load responses. Is the API server running?')
      setData(null)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void load()
  }, [load])

  return (
    <div className="mx-auto min-h-screen max-w-4xl px-4 py-10">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-[family-name:var(--font-display)] text-3xl font-semibold">
            Response export
          </h1>
          <p className="mt-2 text-[var(--color-muted)]">
            Local admin view. Protect this page before deploying publicly.
          </p>
        </div>
        <Link
          to="/"
          className="rounded-2xl border border-[var(--color-border)] px-4 py-2 text-sm font-medium"
        >
          Back to questionnaire
        </Link>
      </div>

      <div className="mb-6 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => void load()}
          className="rounded-2xl bg-[var(--color-accent)] px-4 py-2 font-semibold text-white"
        >
          Refresh
        </button>
        <a
          href="/api/export?format=json"
          className="rounded-2xl border border-[var(--color-border)] bg-white px-4 py-2 font-medium"
        >
          Download JSON
        </a>
        <a
          href="/api/export?format=csv"
          className="rounded-2xl border border-[var(--color-border)] bg-white px-4 py-2 font-medium"
        >
          Download CSV
        </a>
      </div>

      {loading && <p>Loading…</p>}
      {error && (
        <p className="text-red-700" role="alert">
          {error}
        </p>
      )}

      {data && (
        <div className="grid gap-6 md:grid-cols-2">
          <section className="rounded-2xl border border-[var(--color-border)] bg-white p-5">
            <h2 className="mb-3 text-lg font-semibold">
              Questionnaire responses ({data.responses.length})
            </h2>
            <p className="mb-3 text-sm text-[var(--color-muted)]">
              Stored in <code>data/responses.jsonl</code>
            </p>
            <pre className="max-h-96 overflow-auto rounded-xl bg-[var(--color-bg)] p-3 text-xs">
              {JSON.stringify(data.responses, null, 2)}
            </pre>
          </section>
          <section className="rounded-2xl border border-dashed border-[var(--color-border)] bg-[var(--color-warn-bg)] p-5">
            <h2 className="mb-3 text-lg font-semibold">
              Email subscriptions ({data.email_subscriptions.length})
            </h2>
            <p className="mb-3 text-sm text-[var(--color-muted)]">
              Stored separately in <code>data/email_subscriptions.jsonl</code>
            </p>
            <pre className="max-h-96 overflow-auto rounded-xl bg-white/70 p-3 text-xs">
              {JSON.stringify(data.email_subscriptions, null, 2)}
            </pre>
          </section>
        </div>
      )}
    </div>
  )
}
