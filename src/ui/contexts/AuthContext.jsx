import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  // Check for existing session on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser))
      } catch (error) {
        console.error('Error parsing stored user:', error)
        localStorage.removeItem('user')
      }
    }
    setIsLoading(false)
  }, [])

  const login = async credentials => {
    // Super admin authentication
    if (
      credentials.email === 'faisal@limitlessinfotech.com' &&
      credentials.password === 'SuperAdmin2024!'
    ) {
      const userData = {
        id: '1',
        email: 'faisal@limitlessinfotech.com',
        firstName: 'Faisal',
        lastName: 'Khan',
        role: 'super_admin',
        avatar: null,
      }
      setUser(userData)
      localStorage.setItem('user', JSON.stringify(userData))
      return { success: true, user: userData }
    }
    // Demo user for testing
    if (
      credentials.email === 'demo@ivolex.com' &&
      credentials.password === 'password'
    ) {
      const userData = {
        id: '2',
        email: 'demo@ivolex.com',
        firstName: 'Demo',
        lastName: 'User',
        role: 'customer',
        avatar: null,
      }
      setUser(userData)
      localStorage.setItem('user', JSON.stringify(userData))
      return { success: true, user: userData }
    }
    return { success: false, error: 'Invalid credentials' }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('user')
  }

  const register = async userData => {
    // Simulate API call
    const newUser = {
      id: Date.now().toString(),
      ...userData,
      avatar: null,
    }
    setUser(newUser)
    localStorage.setItem('user', JSON.stringify(newUser))
    return { success: true, user: newUser }
  }

  const updateProfile = async updates => {
    if (!user) return { success: false, error: 'Not authenticated' }

    const updatedUser = { ...user, ...updates }
    setUser(updatedUser)
    localStorage.setItem('user', JSON.stringify(updatedUser))
    return { success: true, user: updatedUser }
  }

  const isAuthenticated = !!user

  const value = {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout,
    register,
    updateProfile,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
