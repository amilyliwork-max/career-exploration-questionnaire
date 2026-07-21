import type { ReactNode } from 'react'
import { ProgressBar } from './ProgressBar'

interface StepShellProps {
  title: string
  helper?: string
  children: ReactNode
  showProgress?: boolean
  progressIndex: number
  progressTotal: number
  showBack?: boolean
  onBack?: () => void
  primaryLabel?: string
  onPrimary?: () => void
  primaryDisabled?: boolean
  primaryLoading?: boolean
  primaryHint?: string | null
  secondary?: ReactNode
  hidePrimary?: boolean
}

export function StepShell({
  title,
  helper,
  children,
  showProgress = true,
  progressIndex,
  progressTotal,
  showBack = true,
  onBack,
  primaryLabel = 'Continue',
  onPrimary,
  primaryDisabled = false,
  primaryLoading = false,
  primaryHint = null,
  secondary,
  hidePrimary = false,
}: StepShellProps) {
  const longTitle = title.length > 80

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-xl flex-col px-4 pb-32 pt-6 sm:max-w-2xl sm:px-6 sm:pb-36 sm:pt-10">
      {showProgress && progressTotal > 0 && (
        <div className="sticky top-0 z-20 -mx-4 mb-7 bg-[var(--color-bg)]/95 px-4 pb-3 pt-1 backdrop-blur-md sm:-mx-6 sm:px-6">
          <ProgressBar index={progressIndex} total={progressTotal} />
        </div>
      )}

      <div key={title} className="step-enter flex flex-1 flex-col">
        <header className="mb-7 max-w-[40rem]">
          <h1
            className={[
              'font-semibold tracking-[-0.01em] text-[var(--color-ink)]',
              'leading-[var(--leading-title)]',
              longTitle
                ? 'text-[1.1875rem] sm:text-[1.5rem]'
                : 'text-[var(--text-title)] sm:text-[1.625rem]',
            ].join(' ')}
          >
            {title}
          </h1>
          {helper ? (
            <p className="mt-2.5 text-[var(--text-helper)] leading-[1.55] text-[var(--color-muted)] sm:mt-3">
              {helper}
            </p>
          ) : null}
        </header>

        <div className="flex-1 space-y-1 pb-6">{children}</div>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-[var(--color-border)] bg-white/95 backdrop-blur-md">
        <div className="mx-auto flex w-full max-w-xl flex-col gap-2 px-4 py-3 sm:max-w-2xl sm:flex-row sm:items-center sm:justify-between sm:px-6 sm:py-4">
          <div className="flex min-h-6 items-center">
            {showBack && onBack ? (
              <button
                type="button"
                onClick={onBack}
                className="min-h-11 rounded-2xl px-3 py-2 font-medium text-[var(--color-muted)] transition hover:bg-[var(--color-bg)] hover:text-[var(--color-ink)]"
              >
                Back
              </button>
            ) : (
              <span />
            )}
          </div>

          <div className="flex flex-col items-stretch gap-2 sm:items-end">
            {primaryDisabled && primaryHint ? (
              <p
                className="text-center text-[0.9375rem] leading-snug text-[var(--color-muted)] sm:text-right"
                aria-live="polite"
              >
                {primaryHint}
              </p>
            ) : null}
            <div className="flex items-center gap-3">
              {secondary}
              {!hidePrimary && onPrimary && (
                <button
                  type="button"
                  onClick={onPrimary}
                  disabled={primaryDisabled || primaryLoading}
                  className="min-h-12 flex-1 rounded-2xl bg-[var(--color-accent)] px-6 py-3 text-[1rem] font-semibold text-white shadow-sm transition hover:bg-[var(--color-accent-hover)] disabled:cursor-not-allowed disabled:opacity-45 sm:flex-none sm:text-[1.0625rem]"
                >
                  {primaryLoading ? 'Submitting…' : primaryLabel}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
