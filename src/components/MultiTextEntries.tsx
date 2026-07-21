interface MultiTextEntriesProps {
  values: string[]
  onChange: (values: string[]) => void
  maxEntries?: number
  placeholder?: string
}

export function MultiTextEntries({
  values,
  onChange,
  maxEntries = 3,
  placeholder = 'Type a career or type of work',
}: MultiTextEntriesProps) {
  const updateAt = (index: number, value: string) => {
    const next = [...values]
    next[index] = value
    onChange(next)
  }

  const add = () => {
    if (values.length >= maxEntries) return
    onChange([...values, ''])
  }

  const remove = (index: number) => {
    if (values.length <= 1) {
      onChange([''])
      return
    }
    onChange(values.filter((_, i) => i !== index))
  }

  return (
    <div className="flex flex-col gap-4">
      {values.map((value, index) => (
        <div key={index} className="flex gap-2">
          <label className="sr-only" htmlFor={`career-${index}`}>
            Career or field {index + 1}
          </label>
          <input
            id={`career-${index}`}
            type="text"
            value={value}
            onChange={(e) => updateAt(index, e.target.value)}
            placeholder={placeholder}
            className="min-h-12 w-full rounded-2xl border border-[var(--color-border)] bg-white px-4 py-3 text-[var(--text-option)] leading-[1.5]"
          />
          {values.length > 1 && (
            <button
              type="button"
              onClick={() => remove(index)}
              className="rounded-2xl border border-[var(--color-border)] px-3 text-sm text-[var(--color-muted)] hover:border-[var(--color-accent)]"
              aria-label={`Remove entry ${index + 1}`}
            >
              Remove
            </button>
          )}
        </div>
      ))}

      {values.length < maxEntries && (
        <button
          type="button"
          onClick={add}
          className="rounded-2xl border border-[var(--color-accent)] bg-white px-4 py-3 font-medium text-[var(--color-accent)] hover:bg-[var(--color-accent-soft)]"
        >
          Add another career or field
        </button>
      )}
    </div>
  )
}
