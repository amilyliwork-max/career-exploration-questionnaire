interface TextAreaQuestionProps {
  id: string
  value: string
  onChange: (value: string) => void
  helper?: string
  placeholder?: string
}

export function TextAreaQuestion({
  id,
  value,
  onChange,
  helper,
  placeholder = 'Type your answer here…',
}: TextAreaQuestionProps) {
  return (
    <div className="flex flex-col gap-2">
      {helper ? (
        <p
          id={`${id}-helper`}
          className="text-[1.0625rem] leading-[1.6] text-[var(--color-muted)]"
        >
          {helper}
        </p>
      ) : null}
      <textarea
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={5}
        placeholder={placeholder}
        aria-describedby={helper ? `${id}-helper` : undefined}
        className="w-full resize-y rounded-2xl border border-[var(--color-border)] bg-white px-4 py-3 text-[var(--text-option)] leading-[1.55] sm:py-3.5"
      />
    </div>
  )
}
