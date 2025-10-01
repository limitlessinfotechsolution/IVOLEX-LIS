import { useEffect, useState, useRef } from 'react'

export function usePerformance() {
  const [metrics, setMetrics] = useState({
    fcp: null, // First Contentful Paint
    lcp: null, // Largest Contentful Paint
    fid: null, // First Input Delay
    cls: null, // Cumulative Layout Shift
    ttfb: null, // Time to First Byte
  })
  
  const hasLogged = useRef(false)

  useEffect(() => {
    // Only run in browser environment
    if (typeof window === 'undefined') return

    // Measure Time to First Byte
    const navigation = performance.getEntriesByType('navigation')[0]
    if (navigation) {
      setMetrics(prev => ({
        ...prev,
        ttfb: navigation.responseStart - navigation.requestStart,
      }))
    }

    // Web Vitals using PerformanceObserver
    if ('PerformanceObserver' in window) {
      // First Contentful Paint
      const fcpObserver = new PerformanceObserver(list => {
        const entries = list.getEntries()
        const fcp = entries.find(
          entry => entry.name === 'first-contentful-paint'
        )
        if (fcp) {
          setMetrics(prev => ({ ...prev, fcp: fcp.startTime }))
        }
      })

      // Largest Contentful Paint
      const lcpObserver = new PerformanceObserver(list => {
        const entries = list.getEntries()
        const lastEntry = entries[entries.length - 1]
        setMetrics(prev => ({ ...prev, lcp: lastEntry.startTime }))
      })

      // First Input Delay
      const fidObserver = new PerformanceObserver(list => {
        const entries = list.getEntries()
        const firstEntry = entries[0]
        setMetrics(prev => ({
          ...prev,
          fid: firstEntry.processingStart - firstEntry.startTime,
        }))
      })

      // Cumulative Layout Shift
      const clsObserver = new PerformanceObserver(list => {
        let clsValue = 0
        const entries = list.getEntries()

        for (const entry of entries) {
          if (!entry.hadRecentInput) {
            clsValue += entry.value
          }
        }

        setMetrics(prev => ({ ...prev, cls: clsValue }))
      })

      try {
        fcpObserver.observe({ entryTypes: ['paint'] })
        lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] })
        fidObserver.observe({ entryTypes: ['first-input'] })
        clsObserver.observe({ entryTypes: ['layout-shift'] })
      } catch (error) {
        console.warn('Performance Observer not supported:', error)
      }

      return () => {
        fcpObserver.disconnect()
        lcpObserver.disconnect()
        fidObserver.disconnect()
        clsObserver.disconnect()
      }
    }
  }, [])

  // Log performance metrics in development - only once
  useEffect(() => {
    if (import.meta.env?.DEV && Object.values(metrics).some(Boolean) && !hasLogged.current) {
      hasLogged.current = true
      console.group('🚀 Performance Metrics')
      console.log(
        'First Contentful Paint (FCP):',
        metrics.fcp?.toFixed(2),
        'ms'
      )
      console.log(
        'Largest Contentful Paint (LCP):',
        metrics.lcp?.toFixed(2),
        'ms'
      )
      console.log('First Input Delay (FID):', metrics.fid?.toFixed(2), 'ms')
      console.log('Cumulative Layout Shift (CLS):', metrics.cls?.toFixed(4))
      console.log('Time to First Byte (TTFB):', metrics.ttfb?.toFixed(2), 'ms')
      console.groupEnd()
    }
  }, [metrics])

  return metrics
}

export function useResourceTiming() {
  const [resources, setResources] = useState([])

  useEffect(() => {
    if (typeof window === 'undefined') return

    const observer = new PerformanceObserver(list => {
      const entries = list.getEntries()
      const resourceData = entries.map(entry => ({
        name: entry.name,
        type: entry.initiatorType,
        size: entry.transferSize,
        duration: entry.duration,
        startTime: entry.startTime,
      }))

      setResources(prev => [...prev, ...resourceData])
    })

    try {
      observer.observe({ entryTypes: ['resource'] })
    } catch (error) {
      console.warn('Resource timing not supported:', error)
    }

    return () => observer.disconnect()
  }, [])

  return resources
}

export function useMemoryUsage() {
  const [memory, setMemory] = useState(null)

  useEffect(() => {
    if (typeof window === 'undefined' || !performance.memory) return

    const updateMemory = () => {
      setMemory({
        used: performance.memory.usedJSHeapSize,
        total: performance.memory.totalJSHeapSize,
        limit: performance.memory.jsHeapSizeLimit,
      })
    }

    updateMemory()
    const interval = setInterval(updateMemory, 5000) // Update every 5 seconds

    return () => clearInterval(interval)
  }, [])

  return memory
}