import { isBranchA } from './branching'
import type {
  AnswerState,
  MarketingRecord,
  ResponseRecord,
  SubmitPayload,
} from './types'
import { OTHER_OPTION_VALUE, getOtherDetail, hasOtherSelected } from './types'

function collectOtherDetails(answers: AnswerState): Record<string, string> {
  const entries: [string, string | string[] | null][] = [
    ['grade', answers.grade],
    ['reasons_for_interest', answers.reasons_for_interest],
    ['impression_sources', answers.impression_sources],
    ['broad_interests', answers.broad_interests],
    ['exploration_barriers', answers.exploration_barriers],
    ['career_information_needs', answers.career_information_needs],
    ['preferred_guest_types', answers.preferred_guest_types],
    ['preferred_event_formats', answers.preferred_event_formats],
    ['desired_event_outcomes', answers.desired_event_outcomes],
  ]

  const details: Record<string, string> = {}
  for (const [field, selected] of entries) {
    if (!hasOtherSelected(selected)) continue
    const text = getOtherDetail(answers, field).trim()
    if (text) details[field] = text
  }
  return details
}

export function buildSubmissionPayload(answers: AnswerState): SubmitPayload {
  const submission_id = crypto.randomUUID()
  const submitted_at = new Date().toISOString()
  const branchA = isBranchA(answers)

  const response: ResponseRecord = {
    submission_id,
    submitted_at,
    grade: answers.grade ?? '',
    career_stage: answers.career_stage ?? '',
    current_career_interests: branchA
      ? answers.current_career_interests.map((s) => s.trim()).filter(Boolean)
      : null,
    reasons_for_interest: branchA ? answers.reasons_for_interest : null,
    exposure_level: branchA ? answers.exposure_level : null,
    impression_sources: branchA ? answers.impression_sources : null,
    understanding_confidence: branchA ? answers.understanding_confidence : null,
    perceived_daily_work: branchA
      ? answers.perceived_daily_work.trim() || null
      : null,
    broad_interests: branchA ? null : answers.broad_interests,
    interest_detail: branchA ? null : answers.interest_detail.trim() || null,
    exploration_barriers: branchA ? null : answers.exploration_barriers,
    career_information_needs: answers.career_information_needs,
    preferred_guest_types: answers.preferred_guest_types,
    preferred_event_formats: answers.preferred_event_formats,
    openness_to_other_careers: answers.openness_to_other_careers ?? 0,
    desired_event_outcomes: answers.desired_event_outcomes,
    question_for_professional: answers.question_for_professional.trim() || null,
    marketing_opt_in: answers.marketing_opt_in === true,
    other_details: collectOtherDetails(answers),
  }

  let marketing: MarketingRecord | null = null
  if (
    answers.marketing_opt_in === true &&
    answers.email.trim() &&
    answers.email_owner
  ) {
    marketing = {
      submission_id,
      email: answers.email.trim(),
      email_owner: answers.email_owner,
      email_owner_other:
        answers.email_owner === OTHER_OPTION_VALUE
          ? getOtherDetail(answers, 'email_owner').trim() || null
          : null,
      submitted_at,
    }
  }

  return { submission_id, answers: response, marketing }
}

let inFlight = false

export async function submitQuestionnaire(
  answers: AnswerState,
): Promise<{ ok: true; submission_id: string } | { ok: false; error: string }> {
  if (inFlight) {
    return { ok: false, error: 'Submission already in progress.' }
  }
  inFlight = true
  try {
    const payload = buildSubmissionPayload(answers)
    const res = await fetch('/api/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    if (!res.ok) {
      const text = await res.text()
      return { ok: false, error: text || 'Could not submit. Please try again.' }
    }
    return { ok: true, submission_id: payload.submission_id }
  } catch {
    return {
      ok: false,
      error: 'Could not reach the server. Make sure the app is running.',
    }
  } finally {
    inFlight = false
  }
}
