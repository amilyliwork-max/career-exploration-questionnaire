import { STORAGE_KEY, createEmptyAnswers, type AnswerState, type StepId } from './types'

export interface DraftState {
  answers: AnswerState
  currentStepId: StepId
  history: StepId[]
}

export function loadDraft(): DraftState | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as DraftState
    const empty = createEmptyAnswers()
    return {
      answers: {
        ...empty,
        ...parsed.answers,
        other_details: {
          ...empty.other_details,
          ...(parsed.answers?.other_details ?? {}),
        },
      },
      currentStepId: parsed.currentStepId ?? 'welcome',
      history: Array.isArray(parsed.history) ? parsed.history : [],
    }
  } catch {
    return null
  }
}

export function saveDraft(draft: DraftState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(draft))
  } catch {
    // Ignore quota / private mode errors.
  }
}

export function clearDraft(): void {
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch {
    // ignore
  }
}
