export type FieldKey =
  | 'grade'
  | 'career_stage'
  | 'current_career_interests'
  | 'reasons_for_interest'
  | 'exposure_level'
  | 'impression_sources'
  | 'understanding_confidence'
  | 'perceived_daily_work'
  | 'broad_interests'
  | 'interest_detail'
  | 'exploration_barriers'
  | 'career_information_needs'
  | 'preferred_guest_types'
  | 'preferred_event_formats'
  | 'openness_to_other_careers'
  | 'desired_event_outcomes'
  | 'question_for_professional'
  | 'marketing_opt_in'
  | 'email'
  | 'email_owner'

export type StepId =
  | 'welcome'
  | 'grade'
  | 'career_stage'
  | 'current_interest'
  | 'reasons'
  | 'exposure'
  | 'sources'
  | 'confidence'
  | 'career_picture'
  | 'broad_interests'
  | 'interest_detail'
  | 'barriers'
  | 'content_needs'
  | 'guest_types'
  | 'event_formats'
  | 'openness'
  | 'outcomes'
  | 'student_question'
  | 'opt_in'
  | 'review'
  | 'thank_you'

export type Branch = 'A' | 'B' | 'all'

export type QuestionType =
  | 'single'
  | 'multi'
  | 'scale'
  | 'textarea'
  | 'multi_text'
  | 'opt_in'
  | 'info'
  | 'review'

export interface OptionDef {
  value: string
  label: string
}

export interface AnswerState {
  grade: string | null
  career_stage: string | null
  current_career_interests: string[]
  reasons_for_interest: string[]
  exposure_level: string | null
  impression_sources: string[]
  understanding_confidence: number | null
  perceived_daily_work: string
  broad_interests: string[]
  interest_detail: string
  exploration_barriers: string[]
  career_information_needs: string[]
  preferred_guest_types: string[]
  preferred_event_formats: string[]
  openness_to_other_careers: number | null
  desired_event_outcomes: string[]
  question_for_professional: string
  marketing_opt_in: boolean | null
  email: string
  email_owner: string | null
  /** Free-text details when an "other" option is selected, keyed by field name. */
  other_details: Record<string, string>
}

export interface QuestionDef {
  id: StepId
  field?: FieldKey
  title: string | ((answers: AnswerState) => string)
  helper?: string
  type: QuestionType
  options?: OptionDef[]
  maxSelect?: number
  required?: boolean
  optional?: boolean
  branch?: Branch
  hideOptionWhen?: (value: string, answers: AnswerState) => boolean
}

export interface ResponseRecord {
  submission_id: string
  submitted_at: string
  grade: string
  career_stage: string
  current_career_interests: string[] | null
  reasons_for_interest: string[] | null
  exposure_level: string | null
  impression_sources: string[] | null
  understanding_confidence: number | null
  perceived_daily_work: string | null
  broad_interests: string[] | null
  interest_detail: string | null
  exploration_barriers: string[] | null
  career_information_needs: string[]
  preferred_guest_types: string[]
  preferred_event_formats: string[]
  openness_to_other_careers: number
  desired_event_outcomes: string[]
  question_for_professional: string | null
  marketing_opt_in: boolean
  other_details: Record<string, string>
}

export interface MarketingRecord {
  submission_id: string
  email: string
  email_owner: string
  email_owner_other: string | null
  submitted_at: string
}

export interface SubmitPayload {
  submission_id: string
  answers: ResponseRecord
  marketing: MarketingRecord | null
}

export const STORAGE_KEY = 'career-questionnaire-draft-v3'
export const OTHER_OPTION_VALUE = 'other'

export function createEmptyAnswers(): AnswerState {
  return {
    grade: null,
    career_stage: null,
    current_career_interests: [''],
    reasons_for_interest: [],
    exposure_level: null,
    impression_sources: [],
    understanding_confidence: null,
    perceived_daily_work: '',
    broad_interests: [],
    interest_detail: '',
    exploration_barriers: [],
    career_information_needs: [],
    preferred_guest_types: [],
    preferred_event_formats: [],
    openness_to_other_careers: null,
    desired_event_outcomes: [],
    question_for_professional: '',
    marketing_opt_in: null,
    email: '',
    email_owner: null,
    other_details: {},
  }
}

export function getOtherDetail(
  answers: AnswerState,
  field: string | undefined,
): string {
  if (!field) return ''
  return answers.other_details[field] ?? ''
}

export function hasOtherSelected(
  selected: string | string[] | null | undefined,
): boolean {
  if (Array.isArray(selected)) return selected.includes(OTHER_OPTION_VALUE)
  return selected === OTHER_OPTION_VALUE
}
