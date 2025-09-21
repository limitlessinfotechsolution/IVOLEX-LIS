import { createContext, useContext, useState, useEffect } from 'react'
import { useAuth } from './AuthContext.jsx'
import { supabase } from '../../config/supabase.js'

const AdminAuthContext = createContext()

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext)
  if (!context) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider')
  }
  return context
}

export const AdminAuthProvider = ({ children }) => {
  const { user, isAuthenticated } = useAuth()
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false)
  const [isAdminLoading, setIsAdminLoading] = useState(true)
  const [adminUser, setAdminUser] = useState(null)

  // Check admin authentication status
  useEffect(() => {
    const checkAdminAuth = async () => {
      setIsAdminLoading(true)

      // If user is not authenticated at all, they can't be admin
      if (!isAuthenticated || !user) {
        setIsAdminAuthenticated(false)
        setAdminUser(null)
        setIsAdminLoading(false)
        return
      }

      // Check if user has admin role in Supabase
      try {
        if (supabase) {
          // Check user role in database
          const { data, error } = await supabase
            .from('users')
            .select('role, is_admin, is_super_admin')
            .eq('id', user.id)
            .single()

          if (error) {
            console.error('Error fetching user role:', error)
            // Fallback to local check for demo purposes
            const isAdmin = user.role === 'admin' || user.role === 'super_admin'
            setIsAdminAuthenticated(isAdmin)
            setAdminUser(isAdmin ? user : null)
          } else if (data) {
            const isAdmin =
              data.is_admin ||
              data.is_super_admin ||
              data.role === 'admin' ||
              data.role === 'super_admin'
            setIsAdminAuthenticated(isAdmin)
            setAdminUser(isAdmin ? { ...user, ...data } : null)
          } else {
            setIsAdminAuthenticated(false)
            setAdminUser(null)
          }
        } else {
          // Fallback to local check when Supabase is not configured
          const isAdmin = user.role === 'admin' || user.role === 'super_admin'
          setIsAdminAuthenticated(isAdmin)
          setAdminUser(isAdmin ? user : null)
        }
      } catch (error) {
        console.error('Error checking admin auth:', error)
        // Fallback to local check
        const isAdmin = user.role === 'admin' || user.role === 'super_admin'
        setIsAdminAuthenticated(isAdmin)
        setAdminUser(isAdmin ? user : null)
      } finally {
        setIsAdminLoading(false)
      }
    }

    checkAdminAuth()
  }, [user, isAuthenticated])

  const value = {
    isAdminAuthenticated,
    isAdminLoading,
    adminUser,
  }

  return (
    <AdminAuthContext.Provider value={value}>
      {children}
    </AdminAuthContext.Provider>
  )
}
