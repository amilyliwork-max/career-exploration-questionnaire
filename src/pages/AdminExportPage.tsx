import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { isSupabaseConfigured } from '../lib/supabase'
import { fetchExportData } from '../questionnaire/submit'

interface ExportPayload {
  responses: Record<string, unknown>[]
  email_subscriptions: Record<string, unknown>[]
}

function downloadJson(data: ExportPayload) {
  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: 'application/json',
  })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'career-questionnaire-export.json'
  a.click()
  URL.revokeObjectURL(url)
}

export function AdminExportPage() {
  const [data, setData] = useState<ExportPayload | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const usingSupabase = isSupabaseConfigured()

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const json = await fetchExportData()
      setData(json)
    } catch {
      setError(
        usingSupabase
          ? 'Could not load responses from Supabase.'
          : 'Could not load responses. Is the API server running?',
      )
      setData(null)
    } finally {
      setLoading(false)
    }
  }, [usingSupabase])

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
            {usingSupabase
              ? 'Reading questionnaire answers from Supabase. Emails are viewed in the Supabase dashboard for privacy.'
              : 'Local admin view. Protect this page before deploying publicly.'}
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
        {usingSupabase ? (
          <button
            type="button"
            disabled={!data}
            onClick={() => data && downloadJson(data)}
            className="rounded-2xl border border-[var(--color-border)] bg-white px-4 py-2 font-medium disabled:opacity-50"
          >
            Download JSON
          </button>
        ) : (
          <>
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
          </>
        )}
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
              {usingSupabase
                ? 'Stored in Supabase table questionnaire_responses'
                : 'Stored in data/responses.jsonl'}
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
              {usingSupabase
                ? 'Open Supabase → Table Editor → email_subscriptions to view emails.'
                : 'Stored separately in data/email_subscriptions.jsonl'}
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
