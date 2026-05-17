import { Navigate, Outlet } from 'react-router-dom'

import { useAuth } from '../hooks/auth'

const PublicRoute = () => {
    const { isAuthenticated } = useAuth()

    if (isAuthenticated) {
        return <Navigate to="/planner" replace />
    }

    return <Outlet />
}

export default PublicRoute
