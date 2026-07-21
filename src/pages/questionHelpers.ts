import type { AnswerState, StepId } from '../questionnaire/types'
import { OTHER_OPTION_VALUE } from '../questionnaire/types'

export function getSingleValue(
  stepId: StepId,
  answers: AnswerState,
): string | null {
  if (stepId === 'grade') return answers.grade
  if (stepId === 'career_stage') return answers.career_stage
  if (stepId === 'exposure') return answers.exposure_level
  return null
}

export function setSingleValue(
  stepId: StepId,
  value: string,
  setAnswer: <K extends keyof AnswerState>(key: K, value: AnswerState[K]) => void,
  updateAnswers: (patch: Partial<AnswerState>) => void,
  answers: AnswerState,
) {
  if (stepId === 'grade') {
    setAnswer('grade', value)
    if (value !== OTHER_OPTION_VALUE) {
      const next = { ...answers.other_details }
      delete next.grade
      updateAnswers({ other_details: next })
    }
  }
  if (stepId === 'career_stage') setAnswer('career_stage', value)
  if (stepId === 'exposure') setAnswer('exposure_level', value)
}

export function getMultiValues(stepId: StepId, answers: AnswerState): string[] {
  switch (stepId) {
    case 'reasons':
      return answers.reasons_for_interest
    case 'sources':
      return answers.impression_sources
    case 'broad_interests':
      return answers.broad_interests
    case 'barriers':
      return answers.exploration_barriers
    case 'content_needs':
      return answers.career_information_needs
    case 'guest_types':
      return answers.preferred_guest_types
    case 'event_formats':
      return answers.preferred_event_formats
    case 'outcomes':
      return answers.desired_event_outcomes
    default:
      return []
  }
}

function fieldForStep(stepId: StepId): string | null {
  switch (stepId) {
    case 'reasons':
      return 'reasons_for_interest'
    case 'sources':
      return 'impression_sources'
    case 'broad_interests':
      return 'broad_interests'
    case 'barriers':
      return 'exploration_barriers'
    case 'content_needs':
      return 'career_information_needs'
    case 'guest_types':
      return 'preferred_guest_types'
    case 'event_formats':
      return 'preferred_event_formats'
    case 'outcomes':
      return 'desired_event_outcomes'
    case 'grade':
      return 'grade'
    default:
      return null
  }
}

export function toggleMulti(
  stepId: StepId,
  value: string,
  answers: AnswerState,
  updateAnswers: (patch: Partial<AnswerState>) => void,
  maxSelect?: number,
) {
  const current = getMultiValues(stepId, answers)
  const exists = current.includes(value)
  const next = exists ? current.filter((v) => v !== value) : [...current, value]
  if (!exists && maxSelect && next.length > maxSelect) return

  const field = fieldForStep(stepId)
  const patch: Partial<AnswerState> = {}

  if (field && value === OTHER_OPTION_VALUE && exists) {
    const details = { ...answers.other_details }
    delete details[field]
    patch.other_details = details
  }

  switch (stepId) {
    case 'reasons':
      patch.reasons_for_interest = next
      break
    case 'sources':
      patch.impression_sources = next
      break
    case 'broad_interests':
      patch.broad_interests = next
      break
    case 'barriers':
      patch.exploration_barriers = next
      break
    case 'content_needs':
      patch.career_information_needs = next
      break
    case 'guest_types':
      patch.preferred_guest_types = next
      break
    case 'event_formats':
      patch.preferred_event_formats = next
      break
    case 'outcomes':
      patch.desired_event_outcomes = next
      break
  }

  updateAnswers(patch)
}

export function setOtherDetail(
  field: string,
  value: string,
  answers: AnswerState,
  updateAnswers: (patch: Partial<AnswerState>) => void,
) {
  updateAnswers({
    other_details: {
      ...answers.other_details,
      [field]: value,
    },
  })
}

export { fieldForStep }
