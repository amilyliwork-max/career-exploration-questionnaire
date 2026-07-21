interface OptionCardProps {
  label: string
  selected: boolean
  onSelect: () => void
  disabled?: boolean
  multi?: boolean
}

export function OptionCard({
  label,
  selected,
  onSelect,
  disabled = false,
  multi = false,
}: OptionCardProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      disabled={disabled}
      aria-pressed={selected}
      className={[
        'mb-3 w-full rounded-2xl border px-4 py-[1.05rem] text-left transition-all duration-150 last:mb-0',
        'min-h-[3.75rem] focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-2',
        selected
          ? 'border-[var(--color-accent)] bg-[var(--color-accent-soft)] text-[var(--color-ink)] shadow-[inset_3px_0_0_0_var(--color-accent)]'
          : 'border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-ink)] hover:-translate-y-px hover:border-[var(--color-accent)]/40 hover:shadow-sm',
        disabled
          ? 'cursor-not-allowed opacity-50 hover:translate-y-0 hover:shadow-none'
          : 'cursor-pointer',
      ].join(' ')}
    >
      <span className="flex items-start gap-3.5">
        <span
          className={[
            'mt-1 flex h-5 w-5 shrink-0 items-center justify-center border-2 transition-colors',
            multi ? 'rounded-md' : 'rounded-full',
            selected
              ? 'border-[var(--color-accent)] bg-[var(--color-accent)] text-white'
              : 'border-[var(--color-border)] bg-white',
          ].join(' ')}
          aria-hidden
        >
          {selected ? (
            <svg
              viewBox="0 0 16 16"
              className="h-3 w-3"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <path d="M3.5 8.5 6.5 11.5 12.5 4.5" />
            </svg>
          ) : null}
        </span>
        <span className="text-[var(--text-option)] leading-[1.5]">{label}</span>
      </span>
    </button>
  )
}
