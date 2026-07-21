import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { getQuestion, resolveStepOrder } from '../questionnaire/branching'
import { clearDraft, loadDraft, saveDraft } from '../questionnaire/persistence'
import { submitQuestionnaire } from '../questionnaire/submit'
import {
  createEmptyAnswers,
  type AnswerState,
  type StepId,
} from '../questionnaire/types'
import { canContinue } from '../questionnaire/validation'

interface QuestionnaireContextValue {
  answers: AnswerState
  currentStepId: StepId
  history: StepId[]
  steps: StepId[]
  progressIndex: number
  progressTotal: number
  setAnswer: <K extends keyof AnswerState>(key: K, value: AnswerState[K]) => void
  updateAnswers: (patch: Partial<AnswerState>) => void
  goNext: () => void
  goBack: () => void
  goToStep: (id: StepId) => void
  start: () => void
  canGoNext: boolean
  isSubmitting: boolean
  submitError: string | null
  submit: () => Promise<boolean>
  reset: () => void
}

const QuestionnaireContext = createContext<QuestionnaireContextValue | null>(null)

export function QuestionnaireProvider({ children }: { children: ReactNode }) {
  const initial = loadDraft()
  const [answers, setAnswers] = useState<AnswerState>(
    () => initial?.answers ?? createEmptyAnswers(),
  )
  const [currentStepId, setCurrentStepId] = useState<StepId>(
    () => initial?.currentStepId ?? 'welcome',
  )
  const [history, setHistory] = useState<StepId[]>(() => initial?.history ?? [])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const steps = useMemo(() => resolveStepOrder(answers), [answers])

  useEffect(() => {
    if (currentStepId === 'thank_you') return
    saveDraft({ answers, currentStepId, history })
  }, [answers, currentStepId, history])

  useEffect(() => {
    if (currentStepId === 'welcome' || currentStepId === 'thank_you') return
    if (!steps.includes(currentStepId) && steps.length > 0) {
      setCurrentStepId(steps[0])
      setHistory([])
    }
  }, [steps, currentStepId])

  const setAnswer = useCallback(
    <K extends keyof AnswerState>(key: K, value: AnswerState[K]) => {
      setAnswers((prev) => ({ ...prev, [key]: value }))
    },
    [],
  )

  const updateAnswers = useCallback((patch: Partial<AnswerState>) => {
    setAnswers((prev) => ({ ...prev, ...patch }))
  }, [])

  const start = useCallback(() => {
    setHistory(['welcome'])
    setCurrentStepId('grade')
  }, [])

  const goNext = useCallback(() => {
    if (currentStepId === 'welcome') {
      start()
      return
    }
    if (currentStepId === 'review' || currentStepId === 'thank_you') return
    const idx = steps.indexOf(currentStepId)
    if (idx < 0 || idx >= steps.length - 1) return
    setHistory((h) => [...h, currentStepId])
    setCurrentStepId(steps[idx + 1])
  }, [currentStepId, start, steps])

  const goBack = useCallback(() => {
    if (history.length === 0) {
      if (currentStepId !== 'welcome') setCurrentStepId('welcome')
      return
    }
    const prev = history[history.length - 1]
    setHistory((h) => h.slice(0, -1))
    setCurrentStepId(prev)
  }, [history, currentStepId])

  const goToStep = useCallback(
    (id: StepId) => {
      if (id === currentStepId) return
      setHistory((h) => [...h, currentStepId])
      setCurrentStepId(id)
    },
    [currentStepId],
  )

  const reset = useCallback(() => {
    clearDraft()
    setAnswers(createEmptyAnswers())
    setCurrentStepId('welcome')
    setHistory([])
  }, [])

  const submit = useCallback(async () => {
    setSubmitError(null)
    setIsSubmitting(true)
    const result = await submitQuestionnaire(answers)
    setIsSubmitting(false)
    if (!result.ok) {
      setSubmitError(result.error)
      return false
    }
    clearDraft()
    setCurrentStepId('thank_you')
    return true
  }, [answers])

  const question = getQuestion(currentStepId)
  const canGoNext = question ? canContinue(question, answers) : true

  const value = useMemo(
    () => ({
      answers,
      currentStepId,
      history,
      steps,
      progressIndex: Math.max(0, steps.indexOf(currentStepId)),
      progressTotal: steps.length,
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
    }),
    [
      answers,
      currentStepId,
      history,
      steps,
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
    ],
  )

  return (
    <QuestionnaireContext.Provider value={value}>
      {children}
    </QuestionnaireContext.Provider>
  )
}

export function useQuestionnaire() {
  const ctx = useContext(QuestionnaireContext)
  if (!ctx) {
    throw new Error('useQuestionnaire must be used within QuestionnaireProvider')
  }
  return ctx
}
