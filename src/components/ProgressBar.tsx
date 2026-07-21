interface ProgressBarProps {
  index: number
  total: number
}

function progressLabel(index: number, total: number): string {
  if (total <= 0) return ''
  const remaining = total - (index + 1)
  if (index === 0) return 'Getting started'
  if (remaining <= 0) return 'Last step'
  if (remaining === 1) return 'One question left'
  if (remaining <= 3) return 'Almost there'
  return `Step ${index + 1} of ${total}`
}

export function ProgressBar({ index, total }: ProgressBarProps) {
  const pct = total > 0 ? Math.round(((index + 1) / total) * 100) : 0
  return (
    <div className="w-full" aria-hidden={total === 0}>
      <div className="mb-2 flex items-center justify-between text-[0.9375rem] font-medium text-[var(--color-muted)]">
        <span>{progressLabel(index, total)}</span>
        <span className="tabular-nums">{pct}%</span>
      </div>
      <div
        className="h-2 overflow-hidden rounded-full bg-[var(--color-border)]"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={pct}
        aria-label="Questionnaire progress"
      >
        <div
          className="h-full rounded-full bg-[var(--color-accent)] transition-all duration-300 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}
