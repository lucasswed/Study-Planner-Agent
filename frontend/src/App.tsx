import { Navigate, Route, Routes } from 'react-router-dom'

import ProtectedRoute from './components/ProtectedRoute'
import PublicRoute from './components/PublicRoute'
import { useAuth } from './hooks/auth'
import LoginPage from './pages/Login'
import MyPlanningsPage from './pages/MyPlannings'
import PlannerPage from './pages/Planner'
import PlanningDetailsPage from './pages/PlanningDetails'
import RegisterPage from './pages/Register'

function App() {
  const { isAuthenticated } = useAuth()

  return (
    <Routes>
      <Route element={<PublicRoute />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>
      <Route element={<ProtectedRoute />}>
        <Route path="/planner" element={<PlannerPage />} />
        <Route path="/my-plannings" element={<MyPlanningsPage />} />
        <Route path="/planning/:planningId" element={<PlanningDetailsPage />} />
      </Route>
      <Route
        path="*"
        element={<Navigate to={isAuthenticated ? '/planner' : '/login'} replace />}
      />
    </Routes>
  )
}

export default App
