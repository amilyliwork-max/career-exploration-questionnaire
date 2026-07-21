import { QUESTIONS, hasSpecificCareerAnswers } from './schema'
import type { AnswerState, StepId } from './types'

const EARLY_STEPS = new Set<StepId>(['grade', 'career_stage'])

export function isBranchA(answers: AnswerState): boolean {
  return answers.career_stage !== null && hasSpecificCareerAnswers(answers)
}

export function isBranchB(answers: AnswerState): boolean {
  return answers.career_stage !== null && !hasSpecificCareerAnswers(answers)
}

/** Steps counted in the progress bar (excludes welcome / thank-you). */
export function resolveStepOrder(answers: AnswerState): StepId[] {
  const branch = isBranchA(answers) ? 'A' : isBranchB(answers) ? 'B' : null

  return QUESTIONS.filter((q) => {
    if (q.id === 'welcome' || q.id === 'thank_you') return false
    if (!branch) return EARLY_STEPS.has(q.id)
    if (q.branch === 'A') return branch === 'A'
    if (q.branch === 'B') return branch === 'B'
    return true
  }).map((q) => q.id)
}

export function getQuestion(id: StepId) {
  return QUESTIONS.find((q) => q.id === id)
}

export function getStepTitle(id: StepId, answers: AnswerState): string {
  const q = getQuestion(id)
  if (!q) return ''
  return typeof q.title === 'function' ? q.title(answers) : q.title
}
