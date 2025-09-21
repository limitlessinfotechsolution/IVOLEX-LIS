import { useState, useMemo, useCallback } from 'react'

export function useSearch(items, searchFields = ['name']) {
  const [searchQuery, setSearchQuery] = useState('')
  
  const filteredItems = useMemo(() => {
    if (!searchQuery.trim()) return items
    
    const query = searchQuery.toLowerCase()
    return items.filter(item => 
      searchFields.some(field => {
        const value = item[field]
        if (typeof value === 'string') {
          return value.toLowerCase().includes(query)
        }
        if (Array.isArray(value)) {
          return value.some(v => 
            typeof v === 'string' && v.toLowerCase().includes(query)
          )
        }
        return false
      })
    )
  }, [items, searchQuery, searchFields])
  
  return { searchQuery, setSearchQuery, filteredItems }
}

export function useFilter(items, initialFilters = {}) {
  const [filters, setFilters] = useState(initialFilters)
  
  const filteredItems = useMemo(() => {
    return items.filter(item => {
      return Object.entries(filters).every(([key, value]) => {
        if (!value || (Array.isArray(value) && value.length === 0)) {
          return true
        }
        
        if (Array.isArray(value)) {
          return value.includes(item[key])
        }
        
        if (typeof value === 'object' && value.min !== undefined && value.max !== undefined) {
          const itemValue = parseFloat(item[key])
          return itemValue >= value.min && itemValue <= value.max
        }
        
        return item[key] === value
      })
    })
  }, [items, filters])
  
  const updateFilter = useCallback((key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }, [])
  
  const clearFilter = useCallback((key) => {
    setFilters(prev => {
      const newFilters = { ...prev }
      delete newFilters[key]
      return newFilters
    })
  }, [])
  
  const clearAllFilters = useCallback(() => {
    setFilters({})
  }, [])
  
  return {
    filters,
    filteredItems,
    updateFilter,
    clearFilter,
    clearAllFilters
  }
}

export function useSort(items, initialSort = { field: null, direction: 'asc' }) {
  const [sort, setSort] = useState(initialSort)
  
  const sortedItems = useMemo(() => {
    if (!sort.field) return items
    
    return [...items].sort((a, b) => {
      const aValue = a[sort.field]
      const bValue = b[sort.field]
      
      // Handle numbers
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sort.direction === 'asc' ? aValue - bValue : bValue - aValue
      }
      
      // Handle strings
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        const comparison = aValue.toLowerCase().localeCompare(bValue.toLowerCase())
        return sort.direction === 'asc' ? comparison : -comparison
      }
      
      // Handle dates
      if (aValue instanceof Date && bValue instanceof Date) {
        return sort.direction === 'asc' ? aValue - bValue : bValue - aValue
      }
      
      return 0
    })
  }, [items, sort])
  
  const updateSort = useCallback((field) => {
    setSort(prev => ({
      field,
      direction: prev.field === field && prev.direction === 'asc' ? 'desc' : 'asc'
    }))
  }, [])
  
  return { sort, sortedItems, updateSort }
}

export function usePagination(items, itemsPerPage = 10) {
  const [currentPage, setCurrentPage] = useState(1)
  
  const totalPages = Math.ceil(items.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedItems = items.slice(startIndex, endIndex)
  
  const goToPage = useCallback((page) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)))
  }, [totalPages])
  
  const nextPage = useCallback(() => {
    goToPage(currentPage + 1)
  }, [currentPage, goToPage])
  
  const prevPage = useCallback(() => {
    goToPage(currentPage - 1)
  }, [currentPage, goToPage])
  
  // Reset to page 1 when items change
  const resetPagination = useCallback(() => {
    setCurrentPage(1)
  }, [])
  
  return {
    currentPage,
    totalPages,
    paginatedItems,
    hasNextPage: currentPage < totalPages,
    hasPrevPage: currentPage > 1,
    goToPage,
    nextPage,
    prevPage,
    resetPagination
  }
}