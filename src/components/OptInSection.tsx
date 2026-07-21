import { OptionCard } from './OptionCard'
import { OtherTextInput } from './OtherTextInput'
import { isValidEmail } from '../questionnaire/validation'
import type { AnswerState } from '../questionnaire/types'
import { OTHER_OPTION_VALUE, getOtherDetail } from '../questionnaire/types'

interface OptInSectionProps {
  answers: AnswerState
  onChange: (patch: Partial<AnswerState>) => void
  title?: string
  helper?: string
}

const OWNER_OPTIONS = [
  { value: 'self', label: 'My email address' },
  { value: 'parent', label: 'A parent or guardian’s email address' },
  { value: 'other', label: 'Other' },
]

export function OptInSection({ answers, onChange }: OptInSectionProps) {
  const emailInvalid =
    answers.marketing_opt_in === true &&
    answers.email.trim().length > 0 &&
    !isValidEmail(answers.email)

  return (
    <section
      className="rounded-3xl border border-dashed border-[var(--color-border)] bg-[var(--color-warn-bg)] p-5 sm:p-6"
      aria-label="Optional email updates"
    >
      <p className="mb-4 text-xs font-semibold uppercase tracking-wide text-[var(--color-muted)]">
        Optional
      </p>

      <div className="mb-4 flex flex-col gap-3">
        <OptionCard
          label="Yes"
          selected={answers.marketing_opt_in === true}
          onSelect={() => onChange({ marketing_opt_in: true })}
        />
        <OptionCard
          label="No"
          selected={answers.marketing_opt_in === false}
          onSelect={() =>
            onChange({
              marketing_opt_in: false,
              email: '',
              email_owner: null,
              other_details: (() => {
                const next = { ...answers.other_details }
                delete next.email_owner
                return next
              })(),
            })
          }
        />
      </div>

      {answers.marketing_opt_in === true && (
        <div className="mt-4 flex flex-col gap-4 border-t border-[var(--color-border)] pt-4">
          <div>
            <label htmlFor="email" className="mb-2 block font-medium">
              Email address
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              value={answers.email}
              onChange={(e) => onChange({ email: e.target.value })}
              className="min-h-12 w-full rounded-2xl border border-[var(--color-border)] bg-white px-4 py-3"
              aria-invalid={emailInvalid}
            />
            {emailInvalid && (
              <p className="mt-2 text-sm text-red-700" role="alert">
                Please enter a valid email address.
              </p>
            )}
          </div>

          <fieldset>
            <legend className="mb-3 font-medium">Whose email address is this?</legend>
            <div className="flex flex-col gap-3">
              {OWNER_OPTIONS.map((opt) => (
                <OptionCard
                  key={opt.value}
                  label={opt.label}
                  selected={answers.email_owner === opt.value}
                  onSelect={() => {
                    const next = { ...answers.other_details }
                    if (opt.value !== OTHER_OPTION_VALUE) delete next.email_owner
                    onChange({
                      email_owner: opt.value,
                      other_details: next,
                    })
                  }}
                />
              ))}
            </div>
          </fieldset>

          {answers.email_owner === OTHER_OPTION_VALUE && (
            <OtherTextInput
              id="email-owner-other"
              value={getOtherDetail(answers, 'email_owner')}
              onChange={(value) =>
                onChange({
                  other_details: {
                    ...answers.other_details,
                    email_owner: value,
                  },
                })
              }
              label="Please specify whose email this is"
              placeholder="For example: school counselor, relative…"
            />
          )}

          <p className="text-sm leading-relaxed text-[var(--color-muted)]">
            Providing an email address is optional. It will only be used to share
            information about upcoming events and related opportunities. You may
            unsubscribe at any time.
          </p>
        </div>
      )}
    </section>
  )
}
