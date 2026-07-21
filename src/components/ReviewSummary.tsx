import { formatAnswerForReview } from '../questionnaire/labels'
import { getQuestion, getStepTitle } from '../questionnaire/branching'
import type { AnswerState, StepId } from '../questionnaire/types'

interface ReviewSummaryProps {
  steps: StepId[]
  answers: AnswerState
  onEdit: (id: StepId) => void
}

function ReviewItem({
  id,
  answers,
  onEdit,
}: {
  id: StepId
  answers: AnswerState
  onEdit: (id: StepId) => void
}) {
  return (
    <li className="rounded-2xl border border-[var(--color-border)] bg-white p-4">
      <div className="mb-2 flex items-start justify-between gap-3">
        <p className="text-sm leading-snug text-[var(--color-muted)]">
          {getStepTitle(id, answers)}
        </p>
        <button
          type="button"
          onClick={() => onEdit(id)}
          className="shrink-0 text-sm font-semibold text-[var(--color-accent)] underline-offset-2 hover:underline"
        >
          Edit
        </button>
      </div>
      <p className="text-[1.0625rem] font-medium leading-[1.55] text-[var(--color-ink)]">
        {formatAnswerForReview(id, answers)}
      </p>
    </li>
  )
}

export function ReviewSummary({ steps, answers, onEdit }: ReviewSummaryProps) {
  const questionnaireSteps = steps.filter(
    (id) => id !== 'opt_in' && id !== 'review',
  )

  const aboutSteps = questionnaireSteps.filter((id) => {
    const branch = getQuestion(id)?.branch
    return (
      id === 'grade' ||
      id === 'career_stage' ||
      branch === 'A' ||
      branch === 'B'
    )
  })
  const sharedSteps = questionnaireSteps.filter(
    (id) => !aboutSteps.includes(id),
  )

  return (
    <div className="flex flex-col gap-8">
      {aboutSteps.length > 0 && (
        <section aria-labelledby="review-branch-heading">
          <h2
            id="review-branch-heading"
            className="mb-4 font-[family-name:var(--font-display)] text-xl font-semibold"
          >
            About you
          </h2>
          <ul className="flex flex-col gap-3">
            {aboutSteps.map((id) => (
              <ReviewItem
                key={id}
                id={id}
                answers={answers}
                onEdit={onEdit}
              />
            ))}
          </ul>
        </section>
      )}

      {sharedSteps.length > 0 && (
        <section aria-labelledby="review-shared-heading">
          <h2
            id="review-shared-heading"
            className="mb-4 font-[family-name:var(--font-display)] text-xl font-semibold"
          >
            Event preferences
          </h2>
          <ul className="flex flex-col gap-3">
            {sharedSteps.map((id) => (
              <ReviewItem
                key={id}
                id={id}
                answers={answers}
                onEdit={onEdit}
              />
            ))}
          </ul>
        </section>
      )}

      <section
        aria-labelledby="review-email-heading"
        className="rounded-3xl border border-dashed border-[var(--color-border)] bg-[var(--color-warn-bg)] p-5"
      >
        <div className="mb-3 flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-muted)]">
              Optional
            </p>
            <h2
              id="review-email-heading"
              className="font-[family-name:var(--font-display)] text-xl font-semibold"
            >
              Email updates
            </h2>
          </div>
          <button
            type="button"
            onClick={() => onEdit('opt_in')}
            className="shrink-0 text-sm font-semibold text-[var(--color-accent)] underline-offset-2 hover:underline"
          >
            Edit
          </button>
        </div>
        <p className="font-medium text-[var(--color-ink)]">
          {formatAnswerForReview('opt_in', answers)}
        </p>
      </section>
    </div>
  )
}
