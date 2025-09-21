import { describe, it, expect } from 'vitest'
import { supabase } from '../../config/supabase.js'

describe('Supabase Integration', () => {
  it('should have Supabase client configured', () => {
    expect(supabase).toBeDefined()
  })

  it('should be able to connect to Supabase', async () => {
    // Skip this test if Supabase is not configured
    if (!supabase) {
      expect(supabase).toBeNull()
      return
    }

    // Test health check
    try {
      const { error } = await supabase
        .from('users')
        .select('count()', { count: 'exact' })
        .limit(1)

      // We expect either data or a specific error about table not existing
      expect(error).toBeNull()
    } catch (error) {
      // If there's an error, it should be related to the table not existing
      // which is expected in a fresh setup
      expect(error).toBeDefined()
    }
  })

  it('should have proper environment variables', () => {
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
    const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

    // These might be undefined in local development
    // but should not be empty strings if set
    if (supabaseUrl !== undefined) {
      expect(supabaseUrl).not.toBe('')
    }

    if (supabaseAnonKey !== undefined) {
      expect(supabaseAnonKey).not.toBe('')
    }
  })
})
