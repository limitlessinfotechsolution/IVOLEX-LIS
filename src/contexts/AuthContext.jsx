import { createContext, useContext, useState, useEffect } from 'react'
import { supabase } from '../config/supabase.js'

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
    const checkSession = async () => {
      try {
        // Check Supabase session first
        if (supabase) {
          const {
            data: { session },
          } = await supabase.auth.getSession()
          if (session?.user) {
            // Fetch user details from Supabase
            const { data: userData, error } = await supabase
              .from('users')
              .select('*')
              .eq('id', session.user.id)
              .single()

            if (!error && userData) {
              setUser({
                id: userData.id,
                email: userData.email,
                firstName: userData.first_name,
                lastName: userData.last_name,
                role: userData.role,
                avatar: userData.avatar_url,
              })
            } else {
              // Fallback to session user
              setUser({
                id: session.user.id,
                email: session.user.email,
                firstName: session.user.user_metadata?.first_name || '',
                lastName: session.user.user_metadata?.last_name || '',
                role: session.user.user_metadata?.role || 'customer',
                avatar: session.user.user_metadata?.avatar_url || null,
              })
            }
          }
        } else {
          // Fallback to localStorage when Supabase is not configured
          const storedUser = localStorage.getItem('user')
          if (storedUser) {
            try {
              setUser(JSON.parse(storedUser))
            } catch (error) {
              console.error('Error parsing stored user:', error)
              localStorage.removeItem('user')
            }
          }
        }
      } catch (error) {
        console.error('Error checking session:', error)
      } finally {
        setIsLoading(false)
      }
    }

    checkSession()

    // Listen for auth state changes
    if (supabase) {
      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange((_event, session) => {
        if (session?.user) {
          setUser({
            id: session.user.id,
            email: session.user.email,
            firstName: session.user.user_metadata?.first_name || '',
            lastName: session.user.user_metadata?.last_name || '',
            role: session.user.user_metadata?.role || 'customer',
            avatar: session.user.user_metadata?.avatar_url || null,
          })
        } else {
          setUser(null)
        }
      })

      return () => {
        subscription.unsubscribe()
      }
    }
  }, [])

  const login = async credentials => {
    try {
      // Try Supabase login first
      if (supabase) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: credentials.email,
          password: credentials.password,
        })

        if (error) {
          return { success: false, error: error.message }
        }

        if (data?.user) {
          // Fetch user details from database
          const { data: userData, error: userError } = await supabase
            .from('users')
            .select('*')
            .eq('id', data.user.id)
            .single()

          const userObj =
            userError || !userData
              ? {
                  id: data.user.id,
                  email: data.user.email,
                  firstName: data.user.user_metadata?.first_name || '',
                  lastName: data.user.user_metadata?.last_name || '',
                  role: data.user.user_metadata?.role || 'customer',
                  avatar: data.user.user_metadata?.avatar_url || null,
                }
              : {
                  id: userData.id,
                  email: userData.email,
                  firstName: userData.first_name,
                  lastName: userData.last_name,
                  role: userData.role,
                  avatar: userData.avatar_url,
                }

          setUser(userObj)
          return { success: true, user: userObj }
        }
      } else {
        // Fallback to local authentication when Supabase is not configured
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
      }

      return { success: false, error: 'Invalid credentials' }
    } catch (error) {
      console.error('Login error:', error)
      return { success: false, error: 'Login failed. Please try again.' }
    }
  }

  const logout = async () => {
    try {
      if (supabase) {
        await supabase.auth.signOut()
      }
      setUser(null)
      localStorage.removeItem('user')
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  const register = async userData => {
    try {
      if (supabase) {
        const { data, error } = await supabase.auth.signUp({
          email: userData.email,
          password: userData.password,
          options: {
            data: {
              first_name: userData.firstName,
              last_name: userData.lastName,
            },
          },
        })

        if (error) {
          return { success: false, error: error.message }
        }

        if (data?.user) {
          // Insert user into users table
          const { error: insertError } = await supabase.from('users').insert({
            id: data.user.id,
            email: userData.email,
            first_name: userData.firstName,
            last_name: userData.lastName,
            role: 'customer', // Default role
          })

          if (insertError) {
            console.error('Error inserting user:', insertError)
          }

          const newUser = {
            id: data.user.id,
            email: data.user.email,
            firstName: userData.firstName,
            lastName: userData.lastName,
            role: 'customer',
            avatar: null,
          }

          setUser(newUser)
          return { success: true, user: newUser }
        }
      } else {
        // Fallback to local registration when Supabase is not configured
        const newUser = {
          id: Date.now().toString(),
          ...userData,
          avatar: null,
          role: 'customer',
        }
        setUser(newUser)
        localStorage.setItem('user', JSON.stringify(newUser))
        return { success: true, user: newUser }
      }
    } catch (error) {
      console.error('Registration error:', error)
      return { success: false, error: 'Registration failed. Please try again.' }
    }
  }

  const updateProfile = async updates => {
    if (!user) return { success: false, error: 'Not authenticated' }

    try {
      if (supabase) {
        // Update user in Supabase auth
        const { error: authError } = await supabase.auth.updateUser({
          data: {
            first_name: updates.firstName,
            last_name: updates.lastName,
            avatar_url: updates.avatar,
          },
        })

        if (authError) {
          return { success: false, error: authError.message }
        }

        // Update user in database
        const { error: dbError } = await supabase
          .from('users')
          .update({
            first_name: updates.firstName,
            last_name: updates.lastName,
            avatar_url: updates.avatar,
          })
          .eq('id', user.id)

        if (dbError) {
          console.error('Database update error:', dbError)
        }

        const updatedUser = { ...user, ...updates }
        setUser(updatedUser)
        return { success: true, user: updatedUser }
      } else {
        // Fallback to local update when Supabase is not configured
        const updatedUser = { ...user, ...updates }
        setUser(updatedUser)
        localStorage.setItem('user', JSON.stringify(updatedUser))
        return { success: true, user: updatedUser }
      }
    } catch (error) {
      console.error('Profile update error:', error)
      return {
        success: false,
        error: 'Profile update failed. Please try again.',
      }
    }
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
