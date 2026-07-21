import { QUESTIONS } from './schema'
import type { AnswerState, FieldKey, StepId } from './types'
import { OTHER_OPTION_VALUE, getOtherDetail, hasOtherSelected } from './types'

export function optionLabel(field: FieldKey | undefined, value: string): string {
  if (!field) return value
  for (const q of QUESTIONS) {
    if (q.field !== field || !q.options) continue
    const found = q.options.find((o) => o.value === value)
    if (found) return found.label
  }
  if (field === 'email_owner') {
    const map: Record<string, string> = {
      self: 'My email address',
      parent: 'A parent or guardian’s email address',
      other: 'Other',
    }
    return map[value] ?? value
  }
  return value
}

function formatWithOther(
  field: FieldKey,
  values: string[],
  answers: AnswerState,
): string {
  if (values.length === 0) return '—'
  return (
    values
      .map((v) => {
        if (v === OTHER_OPTION_VALUE) {
          const detail = getOtherDetail(answers, field).trim()
          return detail ? `Other: ${detail}` : 'Other'
        }
        return optionLabel(field, v)
      })
      .join('; ') || '—'
  )
}

function formatSingleWithOther(
  field: FieldKey,
  value: string | null,
  answers: AnswerState,
): string {
  if (!value) return '—'
  if (value === OTHER_OPTION_VALUE) {
    const detail = getOtherDetail(answers, field).trim()
    return detail ? `Other: ${detail}` : 'Other'
  }
  return optionLabel(field, value)
}

export function formatAnswerForReview(
  stepId: StepId,
  answers: AnswerState,
): string {
  switch (stepId) {
    case 'grade':
      return formatSingleWithOther('grade', answers.grade, answers)
    case 'career_stage':
      return answers.career_stage
        ? optionLabel('career_stage', answers.career_stage)
        : '—'
    case 'current_interest':
      return (
        answers.current_career_interests.filter((s) => s.trim()).join('; ') ||
        '—'
      )
    case 'reasons':
      return formatWithOther(
        'reasons_for_interest',
        answers.reasons_for_interest,
        answers,
      )
    case 'exposure':
      return answers.exposure_level
        ? optionLabel('exposure_level', answers.exposure_level)
        : '—'
    case 'sources':
      return formatWithOther(
        'impression_sources',
        answers.impression_sources,
        answers,
      )
    case 'confidence':
      return answers.understanding_confidence != null
        ? optionLabel(
            'understanding_confidence',
            String(answers.understanding_confidence),
          )
        : '—'
    case 'career_picture':
      return answers.perceived_daily_work.trim() || '—'
    case 'broad_interests':
      return formatWithOther('broad_interests', answers.broad_interests, answers)
    case 'interest_detail':
      return answers.interest_detail.trim() || '—'
    case 'barriers':
      return formatWithOther(
        'exploration_barriers',
        answers.exploration_barriers,
        answers,
      )
    case 'content_needs':
      return formatWithOther(
        'career_information_needs',
        answers.career_information_needs,
        answers,
      )
    case 'guest_types':
      return formatWithOther(
        'preferred_guest_types',
        answers.preferred_guest_types,
        answers,
      )
    case 'event_formats':
      return formatWithOther(
        'preferred_event_formats',
        answers.preferred_event_formats,
        answers,
      )
    case 'openness':
      return answers.openness_to_other_careers != null
        ? optionLabel(
            'openness_to_other_careers',
            String(answers.openness_to_other_careers),
          )
        : '—'
    case 'outcomes':
      return formatWithOther(
        'desired_event_outcomes',
        answers.desired_event_outcomes,
        answers,
      )
    case 'student_question':
      return answers.question_for_professional.trim() || '—'
    case 'opt_in':
      if (answers.marketing_opt_in === true) {
        let owner = answers.email_owner
          ? optionLabel('email_owner', answers.email_owner)
          : ''
        if (
          answers.email_owner === OTHER_OPTION_VALUE &&
          hasOtherSelected(answers.email_owner)
        ) {
          const detail = getOtherDetail(answers, 'email_owner').trim()
          owner = detail ? `Other: ${detail}` : 'Other'
        }
        return `Yes — ${answers.email}${owner ? ` (${owner})` : ''}`
      }
      if (answers.marketing_opt_in === false) return 'No'
      return '—'
    default:
      return '—'
  }
}

export { getStepTitle } from './branching'
