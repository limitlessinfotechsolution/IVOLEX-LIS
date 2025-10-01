// Search utility functions and constants

export const SEARCH_TYPES = {
  PRODUCTS: 'products',
  CATEGORIES: 'categories',
  BRANDS: 'brands',
  COLLECTIONS: 'collections',
  ALL: 'all',
}

export const RESULT_TYPES = {
  PRODUCT: 'product',
  CATEGORY: 'category',
  BRAND: 'brand',
  COLLECTION: 'collection',
  SUGGESTION: 'suggestion',
}

export const SEARCH_ACTIONS = {
  SET_QUERY: 'SET_QUERY',
  SET_RESULTS: 'SET_RESULTS',
  SET_SUGGESTIONS: 'SET_SUGGESTIONS',
  SET_LOADING: 'SET_LOADING',
  SET_FILTERS: 'SET_FILTERS',
  ADD_TO_HISTORY: 'ADD_TO_HISTORY',
  CLEAR_HISTORY: 'CLEAR_HISTORY',
  SET_POPULAR_SEARCHES: 'SET_POPULAR_SEARCHES',
}

// Fuzzy matching algorithm
export const fuzzyMatch = (query, target, threshold = 0.6) => {
  if (!query || !target) return { match: false, score: 0 }

  const queryLower = query.toLowerCase()
  const targetLower = target.toLowerCase()

  // Exact match
  if (targetLower.includes(queryLower)) {
    return { match: true, score: 1 }
  }

  // Levenshtein distance-based fuzzy matching
  const distance = levenshteinDistance(queryLower, targetLower)
  const maxLength = Math.max(queryLower.length, targetLower.length)
  const similarity = 1 - distance / maxLength

  return {
    match: similarity >= threshold,
    score: similarity,
  }
}

export const levenshteinDistance = (str1, str2) => {
  const matrix = []

  for (let i = 0; i <= str2.length; i++) {
    matrix[i] = [i]
  }

  for (let j = 0; j <= str1.length; j++) {
    matrix[0][j] = j
  }

  for (let i = 1; i <= str2.length; i++) {
    for (let j = 1; j <= str1.length; j++) {
      if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1]
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // substitution
          matrix[i][j - 1] + 1, // insertion
          matrix[i - 1][j] + 1 // deletion
        )
      }
    }
  }

  return matrix[str2.length][str1.length]
}