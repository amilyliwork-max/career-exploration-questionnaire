import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { QuestionnaireProvider } from './context/QuestionnaireContext'
import { AdminExportPage } from './pages/AdminExportPage'
import { QuestionFlowPage } from './pages/QuestionFlowPage'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <QuestionnaireProvider>
              <QuestionFlowPage />
            </QuestionnaireProvider>
          }
        />
        <Route path="/admin" element={<AdminExportPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
