import type { AnswerState, QuestionDef } from './types'
import { OTHER_OPTION_VALUE, getOtherDetail, hasOtherSelected } from './types'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function isValidEmail(email: string): boolean {
  return EMAIL_RE.test(email.trim())
}

function otherTextOk(answers: AnswerState, field: string | undefined): boolean {
  if (!field) return true
  return getOtherDetail(answers, field).trim().length > 0
}

export function canContinue(question: QuestionDef, answers: AnswerState): boolean {
  return getContinueHint(question, answers) === null
}

/** Human-readable reason Continue is disabled, or null if ready. */
export function getContinueHint(
  question: QuestionDef,
  answers: AnswerState,
): string | null {
  if (question.id === 'opt_in') {
    if (answers.marketing_opt_in === null) {
      return 'Choose Yes or No to continue'
    }
    if (answers.marketing_opt_in === false) return null
    if (!answers.email.trim()) return 'Enter an email address'
    if (!isValidEmail(answers.email)) return 'Enter a valid email address'
    if (!answers.email_owner) return 'Choose whose email this is'
    if (
      answers.email_owner === OTHER_OPTION_VALUE &&
      !otherTextOk(answers, 'email_owner')
    ) {
      return 'Please describe whose email this is'
    }
    return null
  }

  if (question.optional || question.type === 'info' || question.type === 'review') {
    return null
  }

  switch (question.id) {
    case 'grade':
      if (answers.grade === null) return 'Select your grade to continue'
      if (
        answers.grade === OTHER_OPTION_VALUE &&
        !otherTextOk(answers, 'grade')
      ) {
        return 'Please describe your grade'
      }
      return null
    case 'career_stage':
      return answers.career_stage === null
        ? 'Select the option that fits you best'
        : null
    case 'current_interest':
      return answers.current_career_interests.some((v) => v.trim().length > 0)
        ? null
        : 'Add at least one career or type of work'
    case 'reasons':
      if (answers.reasons_for_interest.length === 0) {
        return 'Select up to 3 options'
      }
      if (
        hasOtherSelected(answers.reasons_for_interest) &&
        !otherTextOk(answers, 'reasons_for_interest')
      ) {
        return 'Please describe “Other”'
      }
      return null
    case 'exposure':
      return answers.exposure_level === null
        ? 'Select the option that fits best'
        : null
    case 'sources':
      if (answers.impression_sources.length === 0) {
        return 'Select up to 3 options'
      }
      if (
        hasOtherSelected(answers.impression_sources) &&
        !otherTextOk(answers, 'impression_sources')
      ) {
        return 'Please describe “Other”'
      }
      return null
    case 'confidence':
      return answers.understanding_confidence === null
        ? 'Choose a confidence level'
        : null
    case 'broad_interests':
      if (answers.broad_interests.length === 0) {
        return 'Select up to 4 options'
      }
      if (
        hasOtherSelected(answers.broad_interests) &&
        !otherTextOk(answers, 'broad_interests')
      ) {
        return 'Please describe “Other”'
      }
      return null
    case 'barriers':
      if (answers.exploration_barriers.length === 0) {
        return 'Select up to 3 options'
      }
      if (
        hasOtherSelected(answers.exploration_barriers) &&
        !otherTextOk(answers, 'exploration_barriers')
      ) {
        return 'Please describe “Other”'
      }
      return null
    case 'content_needs':
      if (answers.career_information_needs.length === 0) {
        return 'Select up to 3 options'
      }
      if (
        hasOtherSelected(answers.career_information_needs) &&
        !otherTextOk(answers, 'career_information_needs')
      ) {
        return 'Please describe “Other”'
      }
      return null
    case 'guest_types':
      if (answers.preferred_guest_types.length === 0) {
        return 'Select up to 2 options'
      }
      if (
        hasOtherSelected(answers.preferred_guest_types) &&
        !otherTextOk(answers, 'preferred_guest_types')
      ) {
        return 'Please describe “Other”'
      }
      return null
    case 'event_formats':
      if (answers.preferred_event_formats.length === 0) {
        return 'Select up to 2 options'
      }
      if (
        hasOtherSelected(answers.preferred_event_formats) &&
        !otherTextOk(answers, 'preferred_event_formats')
      ) {
        return 'Please describe “Other”'
      }
      return null
    case 'openness':
      return answers.openness_to_other_careers === null
        ? 'Choose how interested you are'
        : null
    case 'outcomes':
      if (answers.desired_event_outcomes.length === 0) {
        return 'Select up to 2 options'
      }
      if (
        hasOtherSelected(answers.desired_event_outcomes) &&
        !otherTextOk(answers, 'desired_event_outcomes')
      ) {
        return 'Please describe “Other”'
      }
      return null
    default:
      return null
  }
}

export function visibleOptions(
  question: {
    options?: { value: string; label: string }[]
    hideOptionWhen?: (
      value: string,
      answers: import('./types').AnswerState,
    ) => boolean
  },
  answers: import('./types').AnswerState,
) {
  return (question.options ?? []).filter(
    (opt) => !question.hideOptionWhen?.(opt.value, answers),
  )
}
