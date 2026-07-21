import { useEffect, useRef } from 'react'
import { MultiTextEntries } from '../components/MultiTextEntries'
import { OptionCard } from '../components/OptionCard'
import { OptInSection } from '../components/OptInSection'
import { OtherTextInput } from '../components/OtherTextInput'
import { ReviewSummary } from '../components/ReviewSummary'
import { ScaleButtons } from '../components/ScaleButtons'
import { StepShell } from '../components/StepShell'
import { TextAreaQuestion } from '../components/TextAreaQuestion'
import { useQuestionnaire } from '../context/QuestionnaireContext'
import { getQuestion, getStepTitle } from '../questionnaire/branching'
import { QUESTIONS } from '../questionnaire/schema'
import {
  OTHER_OPTION_VALUE,
  getOtherDetail,
  hasOtherSelected,
} from '../questionnaire/types'
import { getContinueHint, visibleOptions } from '../questionnaire/validation'
import {
  fieldForStep,
  getMultiValues,
  getSingleValue,
  setOtherDetail,
  setSingleValue,
  toggleMulti,
} from './questionHelpers'

function getTextareaValue(
  stepId: string,
  answers: ReturnType<typeof useQuestionnaire>['answers'],
): string {
  switch (stepId) {
    case 'career_picture':
      return answers.perceived_daily_work
    case 'interest_detail':
      return answers.interest_detail
    case 'student_question':
      return answers.question_for_professional
    default:
      return ''
  }
}

function setTextareaValue(
  stepId: string,
  value: string,
  setAnswer: ReturnType<typeof useQuestionnaire>['setAnswer'],
) {
  if (stepId === 'career_picture') setAnswer('perceived_daily_work', value)
  else if (stepId === 'interest_detail') setAnswer('interest_detail', value)
  else if (stepId === 'student_question')
    setAnswer('question_for_professional', value)
}

export function QuestionFlowPage() {
  const {
    answers,
    currentStepId,
    steps,
    progressIndex,
    progressTotal,
    setAnswer,
    updateAnswers,
    goNext,
    goBack,
    goToStep,
    start,
    canGoNext,
    isSubmitting,
    submitError,
    submit,
    reset,
  } = useQuestionnaire()

  const headingRef = useRef<HTMLDivElement>(null)
  const pendingAdvance = useRef(false)
  const welcome = QUESTIONS.find((q) => q.id === 'welcome')

  useEffect(() => {
    headingRef.current?.focus()
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [currentStepId])

  useEffect(() => {
    if (!pendingAdvance.current || !canGoNext) return
    pendingAdvance.current = false
    const timer = window.setTimeout(() => {
      goNext()
    }, 240)
    return () => window.clearTimeout(timer)
  }, [answers, canGoNext, currentStepId, goNext])

  if (currentStepId === 'welcome') {
    return (
      <div className="mx-auto flex min-h-screen w-full max-w-2xl flex-col justify-center px-4 py-10 sm:px-6">
        <div className="step-enter rounded-[1.75rem] border border-[var(--color-border)] bg-white/95 p-6 shadow-sm sm:p-10">
          <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-[var(--color-accent)]">
            Grades 6–12 · About 5–7 minutes
          </p>
          <h1 className="font-[family-name:var(--font-display)] text-[1.625rem] font-semibold leading-[1.25] tracking-[-0.01em] sm:text-[2.25rem]">
            {typeof welcome?.title === 'string'
              ? welcome.title
              : 'Career Exploration Questionnaire'}
          </h1>
          <p className="mt-3 text-[1rem] leading-[1.55] text-[var(--color-muted)] sm:mt-4 sm:text-[1.125rem] sm:leading-[1.65]">
            Help us design career exploration events around what students actually
            want to learn and experience.
          </p>
          <ul className="mt-5 space-y-3 text-[1rem] leading-[1.5] text-[var(--color-ink)] sm:mt-6 sm:space-y-3.5 sm:text-[1.0625rem]">
            <li className="flex gap-3">
              <span
                className="mt-1 h-2 w-2 shrink-0 rounded-full bg-[var(--color-accent)]"
                aria-hidden
              />
              <span>There are no right or wrong answers.</span>
            </li>
            <li className="flex gap-3">
              <span
                className="mt-1 h-2 w-2 shrink-0 rounded-full bg-[var(--color-accent)]"
                aria-hidden
              />
              <span>It is completely okay if you are unsure.</span>
            </li>
            <li className="flex gap-3">
              <span
                className="mt-1 h-2 w-2 shrink-0 rounded-full bg-[var(--color-accent)]"
                aria-hidden
              />
              <span>This is not a career-matching test.</span>
            </li>
          </ul>
          <button
            type="button"
            onClick={start}
            className="mt-8 min-h-12 w-full rounded-2xl bg-[var(--color-accent)] px-6 py-3 font-semibold text-white shadow-sm hover:bg-[var(--color-accent-hover)] sm:w-auto"
          >
            Start questionnaire
          </button>
        </div>
      </div>
    )
  }

  if (currentStepId === 'thank_you') {
    return (
      <div className="mx-auto flex min-h-screen w-full max-w-2xl flex-col justify-center px-4 py-10">
        <div className="step-enter rounded-[1.75rem] border border-[var(--color-border)] bg-white p-6 sm:p-10">
          <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-[var(--color-accent)]">
            Done
          </p>
          <h1 className="font-[family-name:var(--font-display)] text-[1.625rem] font-semibold leading-[1.25] sm:text-[2.25rem]">
            Thank you for sharing
          </h1>
          <p className="mt-4 text-[1rem] leading-[1.55] text-[var(--color-muted)] sm:mt-5 sm:text-[1.125rem] sm:leading-[1.65]">
            Your responses will help us create a career exploration event based on
            what students actually want to understand and experience.
          </p>
          <button
            type="button"
            onClick={reset}
            className="mt-8 min-h-12 rounded-2xl border border-[var(--color-border)] px-5 py-3 font-medium transition hover:border-[var(--color-accent)] hover:bg-[var(--color-accent-soft)]"
          >
            Start over
          </button>
        </div>
      </div>
    )
  }

  const question = getQuestion(currentStepId)
  if (!question) return null

  const title = getStepTitle(currentStepId, answers)
  const options = visibleOptions(question, answers)
  const maxSelect = question.maxSelect
  const selectedCount = getMultiValues(currentStepId, answers).length
  const otherField =
    question.field ?? fieldForStep(currentStepId) ?? undefined
  const showOtherInput =
    !!otherField &&
    (question.type === 'single'
      ? getSingleValue(currentStepId, answers) === OTHER_OPTION_VALUE
      : question.type === 'multi'
        ? hasOtherSelected(getMultiValues(currentStepId, answers))
        : false)
  const continueHint = getContinueHint(question, answers)

  const handleSingleSelect = (value: string) => {
    setSingleValue(currentStepId, value, setAnswer, updateAnswers, answers)
    if (value === OTHER_OPTION_VALUE) {
      pendingAdvance.current = false
      return
    }
    pendingAdvance.current = true
  }

  const handleScaleSelect = (n: number) => {
    if (currentStepId === 'confidence') {
      setAnswer('understanding_confidence', n)
    } else {
      setAnswer('openness_to_other_careers', n)
    }
    pendingAdvance.current = true
  }

  if (currentStepId === 'review') {
    return (
      <div ref={headingRef} tabIndex={-1}>
        <StepShell
          title="Review your answers"
          helper="You can edit any response before submitting."
          progressIndex={progressIndex}
          progressTotal={progressTotal}
          onBack={goBack}
          primaryLabel="Submit"
          onPrimary={() => {
            void submit()
          }}
          primaryDisabled={isSubmitting}
          primaryLoading={isSubmitting}
        >
          <ReviewSummary steps={steps} answers={answers} onEdit={goToStep} />
          {submitError ? (
            <p className="mt-4 text-sm text-red-700" role="alert">
              {submitError}
            </p>
          ) : null}
        </StepShell>
      </div>
    )
  }

  return (
    <div ref={headingRef} tabIndex={-1}>
      <StepShell
        title={title}
        helper={question.helper}
        progressIndex={progressIndex}
        progressTotal={progressTotal}
        onBack={goBack}
        onPrimary={goNext}
        primaryDisabled={!canGoNext}
        primaryHint={continueHint}
        primaryLabel="Continue"
      >
        {question.type === 'single' && (
          <div className="flex flex-col gap-3">
            {options.map((opt) => (
              <OptionCard
                key={opt.value}
                label={opt.label}
                selected={getSingleValue(currentStepId, answers) === opt.value}
                onSelect={() => handleSingleSelect(opt.value)}
              />
            ))}
            {showOtherInput && otherField && (
              <OtherTextInput
                id={`${currentStepId}-other`}
                value={getOtherDetail(answers, otherField)}
                autoFocus
                onChange={(value) =>
                  setOtherDetail(otherField, value, answers, updateAnswers)
                }
              />
            )}
          </div>
        )}

        {question.type === 'multi' && (
          <div className="flex flex-col gap-3">
            {maxSelect ? (
              <div className="sticky top-[3.25rem] z-10 -mx-1 rounded-xl bg-[var(--color-bg)]/95 px-1 py-2 backdrop-blur-sm">
                <p
                  className="text-[0.9375rem] font-semibold text-[var(--color-accent)]"
                  aria-live="polite"
                >
                  {selectedCount} of {maxSelect} selected
                </p>
              </div>
            ) : null}
            {options.map((opt) => {
              const selected = getMultiValues(currentStepId, answers).includes(
                opt.value,
              )
              const atMax =
                !!maxSelect && selectedCount >= maxSelect && !selected
              return (
                <OptionCard
                  key={opt.value}
                  label={opt.label}
                  multi
                  selected={selected}
                  disabled={atMax}
                  onSelect={() =>
                    toggleMulti(
                      currentStepId,
                      opt.value,
                      answers,
                      updateAnswers,
                      maxSelect,
                    )
                  }
                />
              )
            })}
            {showOtherInput && otherField && (
              <OtherTextInput
                id={`${currentStepId}-other`}
                value={getOtherDetail(answers, otherField)}
                autoFocus
                onChange={(value) =>
                  setOtherDetail(otherField, value, answers, updateAnswers)
                }
              />
            )}
          </div>
        )}

        {question.type === 'scale' && question.options && (
          <ScaleButtons
            options={question.options}
            value={
              currentStepId === 'confidence'
                ? answers.understanding_confidence
                : answers.openness_to_other_careers
            }
            onChange={handleScaleSelect}
          />
        )}

        {question.type === 'multi_text' && (
          <MultiTextEntries
            values={answers.current_career_interests}
            onChange={(values) => setAnswer('current_career_interests', values)}
            maxEntries={3}
          />
        )}

        {question.type === 'textarea' && (
          <TextAreaQuestion
            id={currentStepId}
            value={getTextareaValue(currentStepId, answers)}
            onChange={(value) =>
              setTextareaValue(currentStepId, value, setAnswer)
            }
          />
        )}

        {question.type === 'opt_in' && (
          <OptInSection
            answers={answers}
            onChange={updateAnswers}
            title={title}
            helper={question.helper}
          />
        )}
      </StepShell>
    </div>
  )
}
