import { Navigate, Outlet, useLocation } from 'react-router-dom'

import { useAuth } from '../hooks/auth'

const PublicRoute = () => {
    const { isAuthenticated } = useAuth()
    const location = useLocation()
    const from =
        (location.state as { from?: { pathname?: string } } | null)?.from
            ?.pathname ?? '/planner'

    if (isAuthenticated) {
        return <Navigate to={from} replace />
    }

    return <Outlet />
}

export default PublicRoute
