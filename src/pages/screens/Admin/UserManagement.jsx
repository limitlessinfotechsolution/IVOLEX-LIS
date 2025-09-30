import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Users,
  Search,
  Edit,
  Shield,
  ShieldCheck,
  Eye,
  CheckCircle,
} from 'lucide-react'
import { useI18n } from '../../../contexts/I18nContext.jsx'

const MOCK_USERS = [
  {
    id: 1,
    name: 'Faisal Khan',
    nameAr: 'فيصل خان',
    email: 'faisal@limitlessinfotech.com',
    phone: '+966501234567',
    role: 'super_admin',
    status: 'active',
    joinDate: '2023-01-01T00:00:00Z',
    lastLogin: new Date().toISOString(),
    orders: 0,
    totalSpent: 0,
    avatar: '/api/placeholder/40/40',
  },
]

const ROLE_CONFIG = {
  super_admin: {
    label: 'Super Admin',
    labelAr: 'مدير عام',
    color: 'bg-purple-100 text-purple-800',
    icon: ShieldCheck,
  },
  admin: {
    label: 'Admin',
    labelAr: 'مدير',
    color: 'bg-red-100 text-red-800',
    icon: ShieldCheck,
  },
  moderator: {
    label: 'Moderator',
    labelAr: 'مشرف',
    color: 'bg-blue-100 text-blue-800',
    icon: Shield,
  },
  customer: {
    label: 'Customer',
    labelAr: 'عميل',
    color: 'bg-green-100 text-green-800',
    icon: Users,
  },
}

const STATUS_CONFIG = {
  active: {
    label: 'Active',
    labelAr: 'نشط',
    color: 'bg-green-100 text-green-800',
  },
  inactive: {
    label: 'Inactive',
    labelAr: 'غير نشط',
    color: 'bg-gray-100 text-gray-800',
  },
  suspended: {
    label: 'Suspended',
    labelAr: 'معلق',
    color: 'bg-red-100 text-red-800',
  },
}

export default function UserManagement() {
  const [users, setUsers] = useState(MOCK_USERS)
  const [filteredUsers, setFilteredUsers] = useState(MOCK_USERS)
  const [searchQuery, setSearchQuery] = useState('')
  const [roleFilter, setRoleFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  // Removed unused state variables

  const { t, isRTL, formatCurrency } = useI18n()

  useEffect(() => {
    let filtered = users

    if (searchQuery) {
      filtered = filtered.filter(
        user =>
          user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.nameAr.includes(searchQuery) ||
          user.email.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    if (roleFilter !== 'all') {
      filtered = filtered.filter(user => user.role === roleFilter)
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(user => user.status === statusFilter)
    }

    setFilteredUsers(filtered)
  }, [users, searchQuery, roleFilter, statusFilter])

  // Removed unused getRoleBadge function

  const getStatusBadge = status => {
    const config = STATUS_CONFIG[status]

    return (
      <span
        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${config.color}`}
      >
        {isRTL ? config.labelAr : config.label}
      </span>
    )
  }

  const handleStatusChange = (userId, newStatus) => {
    setUsers(prev =>
      prev.map(user =>
        user.id === userId ? { ...user, status: newStatus } : user
      )
    )
  }

  const handleRoleChange = (userId, newRole) => {
    setUsers(prev =>
      prev.map(user => (user.id === userId ? { ...user, role: newRole } : user))
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div
        className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}
      >
        <div className={isRTL ? 'text-right' : 'text-left'}>
          <h1 className="text-2xl font-bold text-foreground">
            {t('admin.userManagement', 'User Management')}
          </h1>
          <p className="text-foreground/60">
            {t('admin.userSubtitle', 'Manage users, roles, and permissions')}
          </p>
        </div>

        {/* Add User functionality will be implemented with backend API */}
        <div className="text-sm text-foreground/60">
          {t('admin.addUser', 'Add User')} - Available after backend integration
        </div>
      </div>

      {/* Filters */}
      <div className="bg-surface border border-border rounded-xl p-4">
        <div
          className={`flex items-center gap-4 flex-wrap ${isRTL ? 'flex-row-reverse' : ''}`}
        >
          <div className="relative flex-1 min-w-[300px]">
            <Search
              className={`absolute top-1/2 transform -translate-y-1/2 text-foreground/40 ${isRTL ? 'right-3' : 'left-3'}`}
              size={20}
            />
            <input
              type="text"
              placeholder={t('admin.searchUsers', 'Search users...')}
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className={`w-full bg-background border border-border rounded-lg text-foreground py-2 ${
                isRTL ? 'pr-10 pl-4 text-right' : 'pl-10 pr-4 text-left'
              }`}
            />
          </div>

          <select
            value={roleFilter}
            onChange={e => setRoleFilter(e.target.value)}
            className="px-3 py-2 bg-background border border-border rounded-lg text-foreground"
          >
            <option value="all">{t('admin.allRoles', 'All Roles')}</option>
            {Object.entries(ROLE_CONFIG).map(([key, config]) => (
              <option key={key} value={key}>
                {isRTL ? config.labelAr : config.label}
              </option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-background border border-border rounded-lg text-foreground"
          >
            <option value="all">
              {t('admin.allStatuses', 'All Statuses')}
            </option>
            {Object.entries(STATUS_CONFIG).map(([key, config]) => (
              <option key={key} value={key}>
                {isRTL ? config.labelAr : config.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-surface border border-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-background border-b border-border">
              <tr>
                <th
                  className={`p-4 font-medium text-foreground ${isRTL ? 'text-right' : 'text-left'}`}
                >
                  {t('admin.user', 'User')}
                </th>
                <th
                  className={`p-4 font-medium text-foreground ${isRTL ? 'text-right' : 'text-left'}`}
                >
                  {t('admin.role', 'Role')}
                </th>
                <th
                  className={`p-4 font-medium text-foreground ${isRTL ? 'text-right' : 'text-left'}`}
                >
                  {t('admin.status', 'Status')}
                </th>
                <th
                  className={`p-4 font-medium text-foreground ${isRTL ? 'text-right' : 'text-left'}`}
                >
                  {t('admin.activity', 'Activity')}
                </th>
                <th
                  className={`p-4 font-medium text-foreground ${isRTL ? 'text-right' : 'text-left'}`}
                >
                  {t('admin.actions', 'Actions')}
                </th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {filteredUsers.map(user => (
                  <motion.tr
                    key={user.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="hover:bg-background/50 transition-colors border-b border-border last:border-0"
                  >
                    <td className="p-4">
                      <div
                        className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}
                      >
                        <img
                          src={user.avatar}
                          alt={isRTL ? user.nameAr : user.name}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                        <div className={isRTL ? 'text-right' : 'text-left'}>
                          <div className="font-medium text-foreground">
                            {isRTL ? user.nameAr : user.name}
                          </div>
                          <div className="text-sm text-foreground/60">
                            {user.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <select
                        value={user.role}
                        onChange={e =>
                          handleRoleChange(user.id, e.target.value)
                        }
                        className="px-2 py-1 text-xs border border-border rounded bg-background"
                      >
                        {Object.entries(ROLE_CONFIG).map(([key, config]) => (
                          <option key={key} value={key}>
                            {isRTL ? config.labelAr : config.label}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="p-4">{getStatusBadge(user.status)}</td>
                    <td className="p-4">
                      <div
                        className={`text-sm ${isRTL ? 'text-right' : 'text-left'}`}
                      >
                        <div className="text-foreground">
                          {user.orders} orders
                        </div>
                        <div className="text-foreground/60">
                          {formatCurrency(user.totalSpent)}
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div
                        className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}
                      >
                        <button className="p-2 hover:bg-background rounded-lg transition-colors">
                          <Eye size={16} />
                        </button>
                        <button className="p-2 hover:bg-background rounded-lg transition-colors">
                          <Edit size={16} />
                        </button>
                        <select
                          value={user.status}
                          onChange={e =>
                            handleStatusChange(user.id, e.target.value)
                          }
                          className="px-2 py-1 text-xs border border-border rounded bg-background"
                        >
                          {Object.entries(STATUS_CONFIG).map(
                            ([key, config]) => (
                              <option key={key} value={key}>
                                {isRTL ? config.labelAr : config.label}
                              </option>
                            )
                          )}
                        </select>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        {filteredUsers.length === 0 && (
          <div className="py-12 text-center">
            <Users size={48} className="mx-auto text-foreground/30 mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">
              No users found
            </h3>
            <p className="text-foreground/60">
              Try adjusting your search criteria
            </p>
          </div>
        )}
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-surface border border-border rounded-xl p-4">
          <div
            className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}
          >
            <div className="p-2 bg-blue-100 rounded-lg">
              <Users className="text-blue-600" size={20} />
            </div>
            <div className={isRTL ? 'text-right' : 'text-left'}>
              <div className="text-sm text-foreground/60">
                {t('admin.totalUsers', 'Total Users')}
              </div>
              <div className="text-xl font-bold text-foreground">
                {users.length}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-surface border border-border rounded-xl p-4">
          <div
            className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}
          >
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="text-green-600" size={20} />
            </div>
            <div className={isRTL ? 'text-right' : 'text-left'}>
              <div className="text-sm text-foreground/60">
                {t('admin.activeUsers', 'Active Users')}
              </div>
              <div className="text-xl font-bold text-foreground">
                {users.filter(u => u.status === 'active').length}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-surface border border-border rounded-xl p-4">
          <div
            className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}
          >
            <div className="p-2 bg-red-100 rounded-lg">
              <ShieldCheck className="text-red-600" size={20} />
            </div>
            <div className={isRTL ? 'text-right' : 'text-left'}>
              <div className="text-sm text-foreground/60">
                {t('admin.adminUsers', 'Admins')}
              </div>
              <div className="text-xl font-bold text-foreground">
                {users.filter(u => u.role === 'admin').length}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-surface border border-border rounded-xl p-4">
          <div
            className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}
          >
            <div className="p-2 bg-green-100 rounded-lg">
              <Users className="text-green-600" size={20} />
            </div>
            <div className={isRTL ? 'text-right' : 'text-left'}>
              <div className="text-sm text-foreground/60">
                {t('admin.customers', 'Customers')}
              </div>
              <div className="text-xl font-bold text-foreground">
                {users.filter(u => u.role === 'customer').length}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
