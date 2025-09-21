import { Router } from 'express'
import productController from '../controllers/productController.js'

const router = Router()

// Health check route
router.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    service: 'Ivolex API',
  })
})

// Product routes
router.get('/products', productController.getAllProducts)
router.get('/products/:id', productController.getProductById)
router.get('/enhanced-products', productController.getEnhancedProducts)

export default router
