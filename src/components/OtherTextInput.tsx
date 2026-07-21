import { useEffect, useRef } from 'react'

interface OtherTextInputProps {
  id: string
  value: string
  onChange: (value: string) => void
  label?: string
  placeholder?: string
  autoFocus?: boolean
}

export function OtherTextInput({
  id,
  value,
  onChange,
  label = 'Please specify',
  placeholder = 'Type your answer here…',
  autoFocus = false,
}: OtherTextInputProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!autoFocus) return
    const timer = window.setTimeout(() => {
      inputRef.current?.focus()
      inputRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }, 80)
    return () => window.clearTimeout(timer)
  }, [autoFocus])

  return (
    <div className="rounded-2xl border border-[var(--color-accent)]/30 bg-[var(--color-accent-soft)]/50 p-4">
      <label htmlFor={id} className="mb-2 block text-[0.9375rem] font-semibold text-[var(--color-ink)]">
        {label}
      </label>
      <input
        ref={inputRef}
        id={id}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoComplete="off"
        className="min-h-12 w-full rounded-2xl border border-[var(--color-border)] bg-white px-4 py-3 text-[var(--text-option)] leading-[1.5]"
      />
    </div>
  )
}
