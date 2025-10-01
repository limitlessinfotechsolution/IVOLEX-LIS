import { useState } from 'react'
import EnhancedSearch from './EnhancedSearch'

const SearchTest = () => {
  const [searchResults, setSearchResults] = useState([])

  const handleResultSelect = (result) => {
    console.log('Selected result:', result)
    setSearchResults(prev => [...prev, result])
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Search Functionality Test</h1>
      
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Enhanced Search Component</h2>
        <EnhancedSearch 
          placeholder="Test search functionality..."
          onResultSelect={handleResultSelect}
          showFilters={true}
        />
      </div>

      {searchResults.length > 0 && (
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Search Results</h2>
          <div className="bg-gray-100 p-4 rounded-lg">
            <pre>{JSON.stringify(searchResults, null, 2)}</pre>
          </div>
        </div>
      )}
    </div>
  )
}

export default SearchTest