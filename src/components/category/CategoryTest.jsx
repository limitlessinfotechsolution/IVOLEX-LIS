import { BrowserRouter } from 'react-router-dom'
import CategoryScreen from '../../pages/screens/Category/CategoryScreen'

const CategoryTest = () => {
  return (
    <BrowserRouter>
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-6">Category Section Test</h1>
        <CategoryScreen />
      </div>
    </BrowserRouter>
  )
}

export default CategoryTest