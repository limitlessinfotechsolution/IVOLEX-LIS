import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Plus,
  Edit,
  Eye,
  Search,
  Download,
  Star,
  Package,
  AlertCircle,
  Check,
} from 'lucide-react'
import { useI18n } from '../../../ui/contexts/I18nContext.jsx'

import { useAudit, AUDIT_ACTIONS } from '../../../ui/contexts/AuditContext.jsx'
import BulkOperationsManager from '../../../components/admin/BulkOperationsManager.jsx'

// Mock product data
const MOCK_PRODUCTS = [
  {
    id: 1,
    name: 'Premium Leather Briefcase',
    nameAr: 'حقيبة جلدية فاخرة',
    category: 'leather',
    subcategory: 'bags',
    price: 850,
    originalPrice: 1200,
    stock: 15,
    status: 'active',
    rating: 4.8,
    reviews: 124,
    image: '/api/placeholder/300/300',
    featured: true,
    bestseller: true,
    dateAdded: '2024-01-15',
    lastModified: '2024-01-20',
  },
  {
    id: 2,
    name: 'Wireless Premium Headphones',
    nameAr: 'سماعات لاسلكية فاخرة',
    category: 'electronics',
    subcategory: 'audio',
    price: 299,
    originalPrice: 399,
    stock: 32,
    status: 'active',
    rating: 4.6,
    reviews: 89,
    image: '/api/placeholder/300/300',
    featured: false,
    bestseller: true,
    dateAdded: '2024-01-10',
    lastModified: '2024-01-18',
  },
  {
    id: 3,
    name: 'Executive Office Chair',
    nameAr: 'كرسي مكتب تنفيذي',
    category: 'furniture',
    subcategory: 'seating',
    price: 650,
    originalPrice: 650,
    stock: 8,
    status: 'active',
    rating: 4.9,
    reviews: 56,
    image: '/api/placeholder/300/300',
    featured: true,
    bestseller: false,
    dateAdded: '2024-01-12',
    lastModified: '2024-01-19',
  },
  {
    id: 4,
    name: 'Handcrafted Leather Wallet',
    nameAr: 'محفظة جلدية مصنوعة يدوياً',
    category: 'leather',
    subcategory: 'wallets',
    price: 120,
    originalPrice: 150,
    stock: 0,
    status: 'out_of_stock',
    rating: 4.7,
    reviews: 203,
    image: '/api/placeholder/300/300',
    featured: false,
    bestseller: true,
    dateAdded: '2024-01-08',
    lastModified: '2024-01-16',
  },
]

const CATEGORIES = {
  leather: {
    name: 'Leather',
    nameAr: 'جلود',
    subcategories: ['bags', 'wallets', 'belts', 'accessories'],
  },
  electronics: {
    name: 'Electronics',
    nameAr: 'إلكترونيات',
    subcategories: ['audio', 'wearables', 'accessories'],
  },
  furniture: {
    name: 'Furniture',
    nameAr: 'أثاث',
    subcategories: ['office', 'seating', 'storage'],
  },
}

const STATUS_OPTIONS = [
  { value: 'all', label: 'All Status', labelAr: 'جميع الحالات' },
  { value: 'active', label: 'Active', labelAr: 'نشط' },
  { value: 'inactive', label: 'Inactive', labelAr: 'غير نشط' },
  { value: 'out_of_stock', label: 'Out of Stock', labelAr: 'نفد المخزون' },
  { value: 'draft', label: 'Draft', labelAr: 'مسودة' },
]

export default function ProductCatalog() {
  const [products, setProducts] = useState(MOCK_PRODUCTS)
  const [filteredProducts, setFilteredProducts] = useState(MOCK_PRODUCTS)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [selectedProducts, setSelectedProducts] = useState([])

  const { t, isRTL, formatCurrency } = useI18n()
  const { logAction } = useAudit()

  // Filter products based on search and filters
  useEffect(() => {
    let filtered = products

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(
        product =>
          product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.nameAr.includes(searchQuery) ||
          product.category.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(
        product => product.category === selectedCategory
      )
    }

    // Status filter
    if (selectedStatus !== 'all') {
      filtered = filtered.filter(product => product.status === selectedStatus)
    }

    setFilteredProducts(filtered)
  }, [products, searchQuery, selectedCategory, selectedStatus])

  const handleSelectProduct = productId => {
    setSelectedProducts(prev =>
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    )
  }

  const handleBulkAction = async (action, selectedIds, data = null) => {
    // Declare variables outside switch to avoid lexical declaration issues
    let duplicates = []
    let newProducts = []
    let newStatus = ''

    switch (action) {
      case 'delete':
        if (
          window.confirm(
            t(
              'admin.confirmBulkDelete',
              `Delete ${selectedIds.length} products?`
            )
          )
        ) {
          setProducts(prev => prev.filter(p => !selectedIds.includes(p.id)))
          await logAction(AUDIT_ACTIONS.DELETE, 'bulk-products', {
            productIds: selectedIds,
            count: selectedIds.length,
          })
        }
        break
      case 'archive':
        setProducts(prev =>
          prev.map(p =>
            selectedIds.includes(p.id) ? { ...p, status: 'archived' } : p
          )
        )
        await logAction(AUDIT_ACTIONS.UPDATE, 'bulk-products-archive', {
          productIds: selectedIds,
          count: selectedIds.length,
        })
        break
      case 'duplicate':
        duplicates = products
          .filter(p => selectedIds.includes(p.id))
          .map(p => ({
            ...p,
            id: Date.now() + Math.random(),
            name: `${p.name} (Copy)`,
          }))
        setProducts(prev => [...prev, ...duplicates])
        await logAction(AUDIT_ACTIONS.CREATE, 'bulk-products-duplicate', {
          originalIds: selectedIds,
          count: duplicates.length,
        })
        break
      case 'export':
        await exportProducts('csv', selectedIds)
        break
      case 'bulk_edit':
        // Open bulk edit modal
        console.log('Bulk edit:', selectedIds)
        break
      case 'import':
        if (data) {
          newProducts = data.map(item => ({
            ...item,
            id: Date.now() + Math.random(),
            dateAdded: new Date().toISOString().split('T')[0],
            lastModified: new Date().toISOString().split('T')[0],
          }))
          setProducts(prev => [...prev, ...newProducts])
          await logAction(AUDIT_ACTIONS.CREATE, 'bulk-products-import', {
            count: newProducts.length,
          })
        }
        break
      default:
        if (action === 'activate' || action === 'deactivate') {
          newStatus = action === 'activate' ? 'active' : 'inactive'
          setProducts(prev =>
            prev.map(p =>
              selectedIds.includes(p.id) ? { ...p, status: newStatus } : p
            )
          )
          await logAction(AUDIT_ACTIONS.UPDATE, 'bulk-products-status', {
            productIds: selectedIds,
            newStatus,
            count: selectedIds.length,
          })
        }
    }
    setSelectedProducts([])
  }

  const exportProducts = async (format = 'csv', selectedIds = null) => {
    const exportItems = selectedIds
      ? filteredProducts.filter(p => selectedIds.includes(p.id))
      : filteredProducts

    const exportData = exportItems.map(product => ({
      ID: product.id,
      Name: isRTL ? product.nameAr : product.name,
      Category:
        CATEGORIES[product.category]?.[isRTL ? 'nameAr' : 'name'] ||
        product.category,
      Price: product.price,
      OriginalPrice: product.originalPrice,
      Stock: product.stock,
      Status: product.status,
      Rating: product.rating,
      Reviews: product.reviews,
      Featured: product.featured ? 'Yes' : 'No',
      Bestseller: product.bestseller ? 'Yes' : 'No',
      DateAdded: product.dateAdded,
      LastModified: product.lastModified,
    }))

    if (format === 'csv') {
      const csv = convertToCSV(exportData)
      downloadFile(
        csv,
        `products-${new Date().toISOString().split('T')[0]}.csv`,
        'text/csv'
      )
    } else if (format === 'json') {
      const json = JSON.stringify(exportData, null, 2)
      downloadFile(
        json,
        `products-${new Date().toISOString().split('T')[0]}.json`,
        'application/json'
      )
    }

    await logAction(AUDIT_ACTIONS.EXPORT, 'products', {
      format,
      count: exportData.length,
      selectedOnly: !!selectedIds,
      filters: {
        category: selectedCategory,
        status: selectedStatus,
        search: searchQuery,
      },
    })
  }

  const convertToCSV = data => {
    if (data.length === 0) return ''
    const headers = Object.keys(data[0]).join(',')
    const rows = data.map(row =>
      Object.values(row)
        .map(value =>
          typeof value === 'string' && value.includes(',')
            ? `"${value.replace(/"/g, '""')}"`
            : value
        )
        .join(',')
    )
    return [headers, ...rows].join('\n')
  }

  const downloadFile = (content, filename, mimeType) => {
    const blob = new Blob([content], { type: mimeType })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    window.URL.revokeObjectURL(url)
  }

  const getStatusBadge = status => {
    const statusConfig = {
      active: {
        bg: 'bg-green-100',
        text: 'text-green-800',
        label: t('admin.status.active', 'Active'),
      },
      inactive: {
        bg: 'bg-gray-100',
        text: 'text-gray-800',
        label: t('admin.status.inactive', 'Inactive'),
      },
      out_of_stock: {
        bg: 'bg-red-100',
        text: 'text-red-800',
        label: t('admin.status.outOfStock', 'Out of Stock'),
      },
      draft: {
        bg: 'bg-yellow-100',
        text: 'text-yellow-800',
        label: t('admin.status.draft', 'Draft'),
      },
    }

    const config = statusConfig[status] || statusConfig.draft

    return (
      <span
        className={`px-2 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}
      >
        {config.label}
      </span>
    )
  }

  const ProductGridItem = ({ product }) => (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="bg-surface border border-border rounded-xl p-4 hover:shadow-lg transition-all group"
    >
      {/* Product Image */}
      <div className="relative mb-4">
        <div className="aspect-square bg-background rounded-lg overflow-hidden">
          <img
            src={product.image}
            alt={isRTL ? product.nameAr : product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>

        {/* Quick Actions */}
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="flex gap-1">
            <button className="p-1.5 bg-white/90 backdrop-blur-sm rounded-lg hover:bg-white transition-colors">
              <Eye size={14} />
            </button>
            <button
              onClick={() => console.log('Edit product:', product.id)}
              className="p-1.5 bg-white/90 backdrop-blur-sm rounded-lg hover:bg-white transition-colors"
            >
              <Edit size={14} />
            </button>
          </div>
        </div>

        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {product.featured && (
            <span className="px-2 py-1 bg-primary text-white text-xs rounded-full font-medium">
              {t('admin.featured', 'Featured')}
            </span>
          )}
          {product.bestseller && (
            <span className="px-2 py-1 bg-accent text-white text-xs rounded-full font-medium">
              {t('admin.bestseller', 'Bestseller')}
            </span>
          )}
        </div>

        {/* Selection Checkbox */}
        <div className="absolute bottom-2 left-2">
          <input
            type="checkbox"
            checked={selectedProducts.includes(product.id)}
            onChange={() => handleSelectProduct(product.id)}
            className="w-4 h-4 text-primary bg-white border-gray-300 rounded focus:ring-primary"
          />
        </div>
      </div>

      {/* Product Info */}
      <div className="space-y-2">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-medium text-foreground line-clamp-2">
            {isRTL ? product.nameAr : product.name}
          </h3>
          <div className="flex items-center gap-1 text-xs text-foreground/60">
            <Star size={12} className="fill-yellow-400 text-yellow-400" />
            {product.rating}
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-foreground">
                {formatCurrency(product.price)}
              </span>
              {product.originalPrice > product.price && (
                <span className="text-sm text-foreground/50 line-through">
                  {formatCurrency(product.originalPrice)}
                </span>
              )}
            </div>
            <div className="text-xs text-foreground/60">
              {t('admin.stock', 'Stock')}: {product.stock}
            </div>
          </div>
          {getStatusBadge(product.status)}
        </div>
      </div>
    </motion.div>
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div
        className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}
      >
        <div className={isRTL ? 'text-right' : 'text-left'}>
          <h1 className="text-2xl font-bold text-foreground">
            {t('admin.productCatalog', 'Product Catalog')}
          </h1>
          <p className="text-foreground/60">
            {t(
              'admin.catalogSubtitle',
              'Manage your product inventory and catalog'
            )}
          </p>
        </div>

        <div
          className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}
        >
          {/* Export Dropdown */}
          <div className="relative">
            <motion.button
              onClick={() => exportProducts('csv')}
              className="flex items-center gap-2 px-4 py-2 border border-border bg-surface rounded-xl hover:bg-background transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Download size={16} />
              {t('admin.exportCSV', 'Export CSV')}
            </motion.button>
          </div>

          {/* Add Product Button */}
          <motion.button
            onClick={() => console.log('Add product')}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl hover:bg-primary/90 transition-colors"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Plus size={20} />
            {t('admin.addProduct', 'Add Product')}
          </motion.button>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-surface border border-border rounded-xl p-4">
        <div className="flex items-center gap-4 flex-wrap">
          {/* Search */}
          <div className="relative flex-1 min-w-[300px]">
            <Search
              className={`absolute top-1/2 transform -translate-y-1/2 text-foreground/40 ${isRTL ? 'right-3' : 'left-3'}`}
              size={20}
            />
            <input
              type="text"
              placeholder={t('admin.searchProducts', 'Search products...')}
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className={`w-full bg-background border border-border rounded-lg text-foreground placeholder-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary ${
                isRTL ? 'pr-10 pl-4 text-right' : 'pl-10 pr-4 text-left'
              } py-2`}
            />
          </div>

          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={e => setSelectedCategory(e.target.value)}
            className="px-3 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="all">
              {t('admin.allCategories', 'All Categories')}
            </option>
            {Object.entries(CATEGORIES).map(([key, category]) => (
              <option key={key} value={key}>
                {isRTL ? category.nameAr : category.name}
              </option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={e => setSelectedStatus(e.target.value)}
            className="px-3 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          >
            {STATUS_OPTIONS.map(option => (
              <option key={option.value} value={option.value}>
                {isRTL ? option.labelAr : option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Advanced Bulk Operations Manager */}
      <BulkOperationsManager
        items={filteredProducts}
        selectedItems={selectedProducts}
        onSelectionChange={setSelectedProducts}
        onBulkAction={handleBulkAction}
        itemType="products"
        columns={[
          {
            key: 'category',
            label: 'Category',
            filterable: true,
            filterOptions: Object.entries(CATEGORIES).map(([key, cat]) => ({
              value: key,
              label: isRTL ? cat.nameAr : cat.name,
            })),
          },
          {
            key: 'status',
            label: 'Status',
            filterable: true,
            filterOptions: STATUS_OPTIONS.filter(
              opt => opt.value !== 'all'
            ).map(opt => ({
              value: opt.value,
              label: isRTL ? opt.labelAr : opt.label,
            })),
          },
        ]}
      />

      {/* Products Grid/List */}
      <div className="bg-surface border border-border rounded-xl overflow-hidden">
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <AnimatePresence>
              {filteredProducts.map(product => (
                <ProductGridItem key={product.id} product={product} />
              ))}
            </AnimatePresence>
          </div>
        </div>

        {/* Empty State */}
        {filteredProducts.length === 0 && (
          <div className="py-12 text-center">
            <Package size={48} className="mx-auto text-foreground/30 mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">
              {t('admin.noProducts', 'No products found')}
            </h3>
            <p className="text-foreground/60">
              {t(
                'admin.noProductsSubtitle',
                'Try adjusting your search or filter criteria'
              )}
            </p>
          </div>
        )}
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-surface border border-border rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Package className="text-blue-600" size={20} />
            </div>
            <div>
              <div className="text-sm text-foreground/60">
                {t('admin.totalProducts', 'Total Products')}
              </div>
              <div className="text-xl font-bold text-foreground">
                {products.length}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-surface border border-border rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <Check className="text-green-600" size={20} />
            </div>
            <div>
              <div className="text-sm text-foreground/60">
                {t('admin.activeProducts', 'Active')}
              </div>
              <div className="text-xl font-bold text-foreground">
                {products.filter(p => p.status === 'active').length}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-surface border border-border rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 rounded-lg">
              <AlertCircle className="text-red-600" size={20} />
            </div>
            <div>
              <div className="text-sm text-foreground/60">
                {t('admin.outOfStock', 'Out of Stock')}
              </div>
              <div className="text-xl font-bold text-foreground">
                {products.filter(p => p.status === 'out_of_stock').length}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-surface border border-border rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Star className="text-yellow-600" size={20} />
            </div>
            <div>
              <div className="text-sm text-foreground/60">
                {t('admin.avgRating', 'Avg. Rating')}
              </div>
              <div className="text-xl font-bold text-foreground">
                {(
                  products.reduce((sum, p) => sum + p.rating, 0) /
                  products.length
                ).toFixed(1)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
