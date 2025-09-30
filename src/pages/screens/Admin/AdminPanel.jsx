import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard,
  Package,
  Palette,
  Users,
  Settings,
  LogOut,
  Menu,
  X,
  Search,
  Shield,
  FileText,
  Warehouse,
  Truck,
  BarChart3,
  Brain,
  MapPin,
} from 'lucide-react'
import { useI18n } from '../../../contexts/I18nContext.jsx'
import { useSegment } from '../../../contexts/SegmentContext.jsx'
import { useAuth } from '../../../contexts/AuthContext.jsx'

import AdminRoute from '../../../components/common/AdminRoute.jsx'
import NotificationBell from '../../../components/ui/NotificationBell.jsx'
import {
  AdminDashboard,
  ProductCatalog,
  ThemeEditor,
  CustomizationRequests,
  UserManagement,
  IndiaAnalytics,
  RecommendationManagement,
} from './index.js'
import RoleManagement from './RoleManagement.jsx'
import AuditLogs from './AuditLogs.jsx'
import InventoryManagement from './InventoryManagement.jsx'
import ShippingManagement from './ShippingManagement.jsx'
import SessionManager from './Security/SessionManager.jsx'
import AdminActivityPage from './AdminActivityPage.jsx'
import IntelligenceDashboard from './IntelligenceDashboard.jsx'
import AdvancedSettings from './AdvancedSettings.jsx'

const ADMIN_MENU = [
  {
    id: 'dashboard',
    label: 'admin.dashboard',
    icon: LayoutDashboard,
    component: AdminDashboard,
  },
  {
    id: 'india-analytics',
    label: 'admin.indiaAnalytics',
    icon: MapPin,
    component: IndiaAnalytics,
  },
  {
    id: 'products',
    label: 'admin.products',
    icon: Package,
    component: ProductCatalog,
  },
  {
    id: 'recommendations',
    label: 'admin.recommendations',
    icon: Brain,
    component: RecommendationManagement,
  },
  {
    id: 'inventory',
    label: 'admin.inventory',
    icon: Warehouse,
    component: InventoryManagement,
  },
  {
    id: 'shipping',
    label: 'admin.shipping',
    icon: Truck,
    component: ShippingManagement,
  },
  {
    id: 'requests',
    label: 'admin.customizationRequests',
    icon: Settings,
    component: CustomizationRequests,
  },
  {
    id: 'theme',
    label: 'admin.themeEditor',
    icon: Palette,
    component: ThemeEditor,
  },
  {
    id: 'users',
    label: 'admin.userManagement',
    icon: Users,
    component: UserManagement,
  },
  {
    id: 'roles',
    label: 'admin.roleManagement',
    icon: Shield,
    component: RoleManagement,
  },
  {
    id: 'audit',
    label: 'admin.auditLogs',
    icon: FileText,
    component: AuditLogs,
  },
  {
    id: 'activity',
    label: 'admin.activityLog',
    icon: BarChart3,
    component: AdminActivityPage,
  },
  {
    id: 'intelligence',
    label: 'admin.intelligence',
    icon: Brain,
    component: IntelligenceDashboard,
  },
  {
    id: 'sessions',
    label: 'admin.sessionManager',
    icon: Shield,
    component: SessionManager,
  },
  {
    id: 'settings',
    label: 'admin.settings',
    icon: Settings,
    component: AdvancedSettings,
  },
]

const AdminPanelContent = () => {
  const [activeSection, setActiveSection] = useState('dashboard')
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const { logout } = useAuth()
  const { t, isRTL } = useI18n()
  const { theme } = useSegment()

  const ActiveComponent =
    ADMIN_MENU.find(item => item.id === activeSection)?.component ||
    AdminDashboard

  const handleLogout = () => {
    logout()
    // Navigation will be handled by the AdminRoute component
  }

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.aside
            initial={{ x: isRTL ? 300 : -300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: isRTL ? 300 : -300, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className={`w-64 bg-surface border-border shadow-lg flex flex-col ${
              isRTL ? 'border-l' : 'border-r'
            }`}
          >
            {/* Logo */}
            <div className="p-6 border-b border-border">
              <div
                className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}
              >
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold"
                  style={{ backgroundColor: theme.colors.primary }}
                >
                  I
                </div>
                <div>
                  <h1 className="font-bold text-foreground">IVOLEX</h1>
                  <p className="text-xs text-foreground/60">
                    {t('admin.panel', 'Admin Panel')}
                  </p>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4">
              <div className="space-y-2">
                {ADMIN_MENU.map(item => {
                  const Icon = item.icon
                  const isActive = activeSection === item.id

                  return (
                    <motion.button
                      key={item.id}
                      onClick={() => setActiveSection(item.id)}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${
                        isRTL ? 'flex-row-reverse text-right' : 'text-left'
                      } ${
                        isActive
                          ? 'text-white shadow-lg'
                          : 'text-foreground/70 hover:text-foreground hover:bg-background/50'
                      }`}
                      style={
                        isActive
                          ? { backgroundColor: theme.colors.primary }
                          : {}
                      }
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Icon size={20} />
                      <span className="font-medium">
                        {t(item.label, item.label.split('.')[1])}
                      </span>
                    </motion.button>
                  )
                })}
              </div>
            </nav>

            {/* User Section */}
            <div className="p-4 border-t border-border">
              <button
                onClick={handleLogout}
                className={`w-full flex items-center gap-3 px-3 py-2.5 text-foreground/70 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all ${
                  isRTL ? 'flex-row-reverse text-right' : 'text-left'
                }`}
              >
                <LogOut size={20} />
                <span className="font-medium">
                  {t('admin.logout', 'Logout')}
                </span>
              </button>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <header className="bg-surface border-b border-border px-6 py-4">
          <div
            className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}
          >
            <div
              className={`flex items-center gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}
            >
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 hover:bg-background rounded-lg transition-colors"
              >
                {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
              </button>

              <h2 className="text-xl font-semibold text-foreground">
                {t(
                  ADMIN_MENU.find(item => item.id === activeSection)?.label ||
                    'admin.dashboard',
                  'Dashboard'
                )}
              </h2>
            </div>

            <div
              className={`flex items-center gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}
            >
              {/* Search */}
              <div className="relative">
                <Search
                  className={`absolute top-1/2 transform -translate-y-1/2 text-foreground/40 ${
                    isRTL ? 'right-3' : 'left-3'
                  }`}
                  size={16}
                />
                <input
                  type="text"
                  placeholder={t('admin.search', 'Search...')}
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className={`bg-background border border-border rounded-lg text-foreground placeholder-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary ${
                    isRTL ? 'pr-10 pl-4 text-right' : 'pl-10 pr-4 text-left'
                  } py-2 w-64`}
                />
              </div>

              {/* Notifications */}
              <NotificationBell />

              {/* Profile */}
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-full"></div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 overflow-auto">
          <motion.div
            key={activeSection}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <ActiveComponent />
          </motion.div>
        </main>
      </div>
    </div>
  )
}

const AdminPanel = () => {
  return (
    <AdminRoute>
      <AdminPanelContent />
    </AdminRoute>
  )
}

export default AdminPanel
