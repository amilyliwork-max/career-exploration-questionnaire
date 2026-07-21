import type { OptionDef } from '../questionnaire/types'

interface ScaleButtonsProps {
  options: OptionDef[]
  value: number | null
  onChange: (value: number) => void
}

export function ScaleButtons({ options, value, onChange }: ScaleButtonsProps) {
  return (
    <div className="flex flex-col gap-3" role="radiogroup">
      {options.map((opt) => {
        const num = Number(opt.value)
        const selected = value === num
        return (
          <button
            key={opt.value}
            type="button"
            role="radio"
            aria-checked={selected}
            onClick={() => onChange(num)}
            className={[
              'flex w-full items-center gap-4 rounded-2xl border px-4 py-[1.05rem] text-left transition-all duration-150',
              'min-h-[3.75rem]',
              selected
                ? 'border-[var(--color-accent)] bg-[var(--color-accent-soft)] shadow-[inset_3px_0_0_0_var(--color-accent)]'
                : 'border-[var(--color-border)] bg-[var(--color-surface)] hover:-translate-y-px hover:border-[var(--color-accent)]/40 hover:shadow-sm',
            ].join(' ')}
          >
            <span
              className={[
                'flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-lg font-semibold transition-colors',
                selected
                  ? 'bg-[var(--color-accent)] text-white'
                  : 'bg-[var(--color-bg)] text-[var(--color-muted)]',
              ].join(' ')}
            >
              {opt.value}
            </span>
            <span className="text-[var(--text-option)] leading-[1.5]">{opt.label}</span>
          </button>
        )
      })}
    </div>
  )
}
