import productData from '../../data/products.json' with { type: 'json' }
import enhancedProductData from '../../data/enhancedProducts.json' with { type: 'json' }

const getAllProducts = (req, res) => {
  try {
    res.json(productData)
  } catch (_error) {
    console.error(_error)
    res.status(500).json({ error: 'Failed to fetch products' })
  }
}

const getProductById = (req, res) => {
  try {
    const product = productData.find(p => p.id === req.params.id)
    if (!product) {
      return res.status(404).json({ error: 'Product not found' })
    }
    res.json(product)
  } catch (_error) {
    console.error(_error)
    res.status(500).json({ error: 'Failed to fetch product' })
  }
}

const getEnhancedProducts = (req, res) => {
  try {
    res.json(enhancedProductData)
  } catch (_error) {
    console.error(_error)
    res.status(500).json({ error: 'Failed to fetch enhanced products' })
  }
}

export default {
  getAllProducts,
  getProductById,
  getEnhancedProducts,
}
