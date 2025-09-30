import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext.jsx'
import { useAdminAuth } from '../../contexts/AdminAuthContext.jsx'

const AdminRoute = ({ children }) => {
  const navigate = useNavigate()
  const { isAuthenticated, isLoading: authLoading } = useAuth()
  const { isAdminAuthenticated, isAdminLoading } = useAdminAuth()

  useEffect(() => {
    // Redirect if not authenticated or not admin
    if (!authLoading && !isAdminLoading) {
      if (!isAuthenticated) {
        // Not authenticated at all, redirect to login
        navigate('/login', {
          state: {
            from: location.pathname,
            message: 'Please log in to access the admin panel',
          },
        })
      } else if (!isAdminAuthenticated) {
        // Authenticated but not admin, redirect to home
        navigate('/', {
          state: {
            message: 'Access denied. Admin privileges required.',
          },
        })
      }
    }
  }, [
    isAuthenticated,
    isAdminAuthenticated,
    authLoading,
    isAdminLoading,
    navigate,
  ])

  // Show loading state while checking auth
  if (authLoading || isAdminLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-brand-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-stone-600">Verifying admin access...</p>
        </div>
      </div>
    )
  }

  // Render children only if admin authenticated
  if (isAuthenticated && isAdminAuthenticated) {
    return children
  }

  // Return null while redirecting
  return null
}

export default AdminRoute
