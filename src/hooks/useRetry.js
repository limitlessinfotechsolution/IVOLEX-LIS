import { useState, useCallback } from 'react'
import { showError } from '../ui/components/ToastProvider'

export function useRetry(
  fn,
  { maxRetries = 3, delay = 1000, backoff = true } = {}
) {
  const [isRetrying, setIsRetrying] = useState(false)
  const [retryCount, setRetryCount] = useState(0)
  const [lastError, setLastError] = useState(null)

  const retry = useCallback(
    async (...args) => {
      if (retryCount >= maxRetries) {
        showError('Maximum retry attempts reached')
        return
      }

      setIsRetrying(true)
      setRetryCount(prev => prev + 1)

      try {
        const result = await fn(...args)
        setRetryCount(0)
        setLastError(null)
        setIsRetrying(false)
        return result
      } catch (error) {
        setLastError(error)

        if (retryCount < maxRetries - 1) {
          const retryDelay = backoff ? delay * Math.pow(2, retryCount) : delay

          setTimeout(() => {
            retry(...args)
          }, retryDelay)
        } else {
          setIsRetrying(false)
          showError('Operation failed after multiple attempts')
          throw error
        }
      }
    },
    [fn, maxRetries, delay, backoff, retryCount]
  )

  const reset = useCallback(() => {
    setRetryCount(0)
    setLastError(null)
    setIsRetrying(false)
  }, [])

  return {
    retry,
    reset,
    isRetrying,
    retryCount,
    lastError,
    canRetry: retryCount < maxRetries,
  }
}

export function useAsyncOperation() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [data, setData] = useState(null)

  const execute = useCallback(async (asyncFn, ...args) => {
    setLoading(true)
    setError(null)

    try {
      const result = await asyncFn(...args)
      setData(result)
      return result
    } catch (err) {
      setError(err)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const reset = useCallback(() => {
    setLoading(false)
    setError(null)
    setData(null)
  }, [])

  return {
    loading,
    error,
    data,
    execute,
    reset,
  }
}
