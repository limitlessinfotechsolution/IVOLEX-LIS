import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Store, Package, ShoppingBag, Users, 
  TrendingUp, Settings, Eye, Edit3, 
  Plus, Download, BarChart3
} from 'lucide-react';

const ShopManagement = () => {
  const [activeSection, setActiveSection] = useState('overview');

  // Mock shop data
  const shopStats = {
    totalProducts: 147,
    totalOrders: 1284,
    totalCustomers: 892,
    revenue: 2840000,
    conversionRate: 3.4,
    averageOrderValue: 2847
  };

  const recentOrders = [
    {
      id: 'ORD-001',
      customer: 'Rajesh Kumar',
      items: 3,
      total: 12450,
      status: 'completed',
      date: '2024-01-20'
    },
    {
      id: 'ORD-002', 
      customer: 'Priya Sharma',
      items: 1,
      total: 8500,
      status: 'processing',
      date: '2024-01-20'
    },
    {
      id: 'ORD-003',
      customer: 'Amit Patel',
      items: 2,
      total: 15600,
      status: 'shipped',
      date: '2024-01-19'
    }
  ];

  const topProducts = [
    {
      id: 1,
      name: 'Premium Leather Briefcase',
      sales: 89,
      revenue: 534000,
      stock: 23
    },
    {
      id: 2,
      name: 'Executive Wallet Set',
      sales: 67,
      revenue: 234500,
      stock: 45
    },
    {
      id: 3,
      name: 'Leather Laptop Bag',
      sales: 54,
      revenue: 432000,
      stock: 12
    }
  ];

  const sections = [
    { id: 'overview', label: 'Shop Overview', icon: Store },
    { id: 'products', label: 'Product Management', icon: Package },
    { id: 'orders', label: 'Order Management', icon: ShoppingBag },
    { id: 'customers', label: 'Customer Management', icon: Users },
    { id: 'analytics', label: 'Shop Analytics', icon: BarChart3 },
    { id: 'settings', label: 'Shop Settings', icon: Settings }
  ];

  const statusConfig = {
    completed: { label: 'Completed', color: 'green', bg: 'bg-green-100', text: 'text-green-800' },
    processing: { label: 'Processing', color: 'blue', bg: 'bg-blue-100', text: 'text-blue-800' },
    shipped: { label: 'Shipped', color: 'purple', bg: 'bg-purple-100', text: 'text-purple-800' },
    cancelled: { label: 'Cancelled', color: 'red', bg: 'bg-red-100', text: 'text-red-800' }
  };

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600">Total Products</p>
              <p className="text-2xl font-bold text-gray-900">{shopStats.totalProducts}</p>
            </div>
            <Package className="w-8 h-8 text-blue-600" />
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600">Total Orders</p>
              <p className="text-2xl font-bold text-green-600">{shopStats.totalOrders.toLocaleString()}</p>
            </div>
            <ShoppingBag className="w-8 h-8 text-green-600" />
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600">Total Customers</p>
              <p className="text-2xl font-bold text-purple-600">{shopStats.totalCustomers}</p>
            </div>
            <Users className="w-8 h-8 text-purple-600" />
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-green-600">₹{(shopStats.revenue / 100000).toFixed(1)}L</p>
            </div>
            <TrendingUp className="w-8 h-8 text-green-600" />
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600">Conversion Rate</p>
              <p className="text-2xl font-bold text-orange-600">{shopStats.conversionRate}%</p>
            </div>
            <BarChart3 className="w-8 h-8 text-orange-600" />
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600">Avg Order Value</p>
              <p className="text-2xl font-bold text-blue-600">₹{shopStats.averageOrderValue.toLocaleString()}</p>
            </div>
            <TrendingUp className="w-8 h-8 text-blue-600" />
          </div>
        </div>
      </div>

      {/* Recent Orders & Top Products */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Recent Orders</h3>
              <button 
                onClick={() => setActiveSection('orders')}
                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                View All
              </button>
            </div>
          </div>
          
          <div className="divide-y divide-gray-200">
            {recentOrders.map((order) => {
              const statusInfo = statusConfig[order.status];
              
              return (
                <div key={order.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="font-medium text-gray-900">{order.id}</h4>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusInfo.bg} ${statusInfo.text}`}>
                          {statusInfo.label}
                        </span>
                      </div>
                      <p className="text-gray-600 text-sm">{order.customer}</p>
                      <p className="text-gray-500 text-xs">{order.items} items • {order.date}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">₹{order.total.toLocaleString()}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <button className="p-1 text-gray-400 hover:text-blue-600">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="p-1 text-gray-400 hover:text-gray-600">
                          <Edit3 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Top Products</h3>
              <button 
                onClick={() => setActiveSection('products')}
                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                View All
              </button>
            </div>
          </div>
          
          <div className="divide-y divide-gray-200">
            {topProducts.map((product, index) => (
              <div key={product.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gray-200 rounded-lg flex items-center justify-center">
                      <span className="text-sm font-semibold text-gray-600">#{index + 1}</span>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">{product.name}</h4>
                      <p className="text-gray-600 text-sm">{product.sales} sales</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">₹{(product.revenue / 1000).toFixed(0)}K</p>
                    <p className="text-gray-500 text-xs">{product.stock} in stock</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderQuickActions = () => (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <button 
          onClick={() => setActiveSection('products')}
          className="flex items-center gap-3 p-4 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span className="font-medium">Add Product</span>
        </button>
        
        <button 
          onClick={() => setActiveSection('orders')}
          className="flex items-center gap-3 p-4 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors"
        >
          <ShoppingBag className="w-5 h-5" />
          <span className="font-medium">View Orders</span>
        </button>
        
        <button 
          onClick={() => setActiveSection('customers')}
          className="flex items-center gap-3 p-4 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors"
        >
          <Users className="w-5 h-5" />
          <span className="font-medium">Manage Customers</span>
        </button>
        
        <button 
          onClick={() => setActiveSection('analytics')}
          className="flex items-center gap-3 p-4 bg-orange-50 text-orange-700 rounded-lg hover:bg-orange-100 transition-colors"
        >
          <Download className="w-5 h-5" />
          <span className="font-medium">Export Reports</span>
        </button>
      </div>
    </div>
  );

  const renderProductManagement = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Product Catalog</h3>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
            <Plus className="w-4 h-4" /> Add Product
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {topProducts.map(product => (
            <div key={product.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
              <h4 className="font-medium text-gray-900">{product.name}</h4>
              <p className="text-sm text-gray-600 mt-1">{product.sales} sales</p>
              <p className="text-lg font-semibold text-green-600 mt-2">₹{(product.revenue / 1000).toFixed(0)}K</p>
              <div className="flex justify-between items-center mt-3">
                <span className={`px-2 py-1 rounded-full text-xs ${
                  product.stock > 20 ? 'bg-green-100 text-green-800' :
                  product.stock > 10 ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {product.stock} in stock
                </span>
                <div className="flex gap-2">
                  <button className="p-1 text-gray-400 hover:text-blue-600"><Eye className="w-4 h-4" /></button>
                  <button className="p-1 text-gray-400 hover:text-green-600"><Edit3 className="w-4 h-4" /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderOrderManagement = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Recent Orders</h3>
          <div className="flex gap-2">
            <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              Export
            </button>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              Manage All
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-900">Order ID</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Customer</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Items</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Total</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Date</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map(order => {
                const status = statusConfig[order.status];
                return (
                  <tr key={order.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 font-mono text-sm">{order.id}</td>
                    <td className="py-3 px-4">{order.customer}</td>
                    <td className="py-3 px-4">{order.items}</td>
                    <td className="py-3 px-4 font-semibold">₹{order.total.toLocaleString()}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${status.bg} ${status.text}`}>
                        {status.label}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600">{order.date}</td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        <button className="p-1 text-gray-400 hover:text-blue-600"><Eye className="w-4 h-4" /></button>
                        <button className="p-1 text-gray-400 hover:text-green-600"><Edit3 className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderCustomerManagement = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Customer Overview</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">{shopStats.totalCustomers}</div>
            <div className="text-sm text-blue-700 mt-1">Total Customers</div>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">76%</div>
            <div className="text-sm text-green-700 mt-1">Repeat Customers</div>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">₹{shopStats.averageOrderValue.toLocaleString()}</div>
            <div className="text-sm text-purple-700 mt-1">Avg. Lifetime Value</div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderShopAnalytics = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Sales Trends</h3>
          <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
            <div className="text-center">
              <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-600">Sales chart visualization</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Breakdown</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Product Sales</span>
              <span className="font-semibold">₹{(shopStats.revenue * 0.8 / 100000).toFixed(1)}L</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Shipping</span>
              <span className="font-semibold">₹{(shopStats.revenue * 0.1 / 100000).toFixed(1)}L</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Tax</span>
              <span className="font-semibold">₹{(shopStats.revenue * 0.1 / 100000).toFixed(1)}L</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderShopSettings = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Store Configuration</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Store Name</label>
            <input type="text" defaultValue="IVOLEX Store" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Currency</label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
              <option value="INR">INR (₹)</option>
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tax Rate (%)</label>
            <input type="number" defaultValue="18" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Shipping Fee</label>
            <input type="number" defaultValue="100" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
          </div>
        </div>
        <div className="mt-6">
          <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Store className="w-8 h-8 text-blue-600" />
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Shop Management</h2>
            <p className="text-gray-600">Manage your online store and track performance</p>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8 overflow-x-auto">
          {sections.map((section) => {
            const Icon = section.icon;
            return (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`flex items-center gap-2 py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${
                  activeSection === section.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="w-4 h-4" />
                {section.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Content */}
      <motion.div
        key={activeSection}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="space-y-6"
      >
        {activeSection === 'overview' && (
          <>
            {renderOverview()}
            {renderQuickActions()}
          </>
        )}
        {activeSection === 'products' && renderProductManagement()}
        {activeSection === 'orders' && renderOrderManagement()}
        {activeSection === 'customers' && renderCustomerManagement()}
        {activeSection === 'analytics' && renderShopAnalytics()}
        {activeSection === 'settings' && renderShopSettings()}
      </motion.div>
    </div>
  );
};

export default ShopManagement;