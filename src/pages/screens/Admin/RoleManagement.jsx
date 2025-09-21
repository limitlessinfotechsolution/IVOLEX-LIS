import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAudit, ROLES, PERMISSIONS, ROLE_PERMISSIONS, AUDIT_ACTIONS } from '../../../ui/contexts/AuditContext'
import { useI18n } from '../../../ui/contexts/I18nContext'
import { Shield, User, Lock, Edit3, Save, X, Check, AlertTriangle } from 'lucide-react'

const RoleManagement = () => {
  const { 
    hasPermission, 
    logAction,
    ROLES: AVAILABLE_ROLES 
  } = useAudit()
  const { t, language, isRTL } = useI18n()
  
  const [selectedUser, setSelectedUser] = useState(null)
  const [isEditing, setIsEditing] = useState(false)
  const [newRole, setNewRole] = useState('')
  const [showPermissions, setShowPermissions] = useState({})

  // Keep only super admin Faisal - other users will be loaded from API
  const [users] = useState([
    {
      id: '1',
      name: 'Faisal Khan',
      email: 'faisal@limitlessinfotech.com',
      role: ROLES.SUPER_ADMIN,
      avatar: null,
      lastLogin: new Date().toISOString(),
      status: 'active'
    }
  ])

  // Check if current user can manage roles
  const canManageRoles = hasPermission(PERMISSIONS.ROLES_MANAGE)
  const canViewUsers = hasPermission(PERMISSIONS.USERS_VIEW)

  if (!canViewUsers) {
    return (
      <div className="p-8 text-center">
        <AlertTriangle className="mx-auto h-12 w-12 text-red-500 mb-4" />
        <h3 className="text-lg font-semibold text-foreground mb-2">
          {t('roles.accessDenied', 'Access Denied')}
        </h3>
        <p className="text-foreground/60">
          {t('roles.noPermission', 'You do not have permission to view user roles')}
        </p>
      </div>
    )
  }

  const getRoleDisplayName = (role) => {
    const roleNames = {
      [ROLES.SUPER_ADMIN]: language === 'ar' ? 'مدير عام' : 'Super Admin',
      [ROLES.ADMIN]: language === 'ar' ? 'مدير' : 'Admin',
      [ROLES.MANAGER]: language === 'ar' ? 'مدير قسم' : 'Manager',
      [ROLES.MODERATOR]: language === 'ar' ? 'منسق' : 'Moderator',
      [ROLES.VIEWER]: language === 'ar' ? 'مشاهد' : 'Viewer',
      [ROLES.CUSTOMER]: language === 'ar' ? 'عميل' : 'Customer'
    }
    return roleNames[role] || role
  }

  const getRoleColor = (role) => {
    const colors = {
      [ROLES.SUPER_ADMIN]: 'bg-purple-100 text-purple-800 border-purple-200',
      [ROLES.ADMIN]: 'bg-red-100 text-red-800 border-red-200',
      [ROLES.MANAGER]: 'bg-blue-100 text-blue-800 border-blue-200',
      [ROLES.MODERATOR]: 'bg-green-100 text-green-800 border-green-200',
      [ROLES.VIEWER]: 'bg-gray-100 text-gray-800 border-gray-200',
      [ROLES.CUSTOMER]: 'bg-yellow-100 text-yellow-800 border-yellow-200'
    }
    return colors[role] || 'bg-gray-100 text-gray-800 border-gray-200'
  }

  const handleRoleChange = async (userId, oldRole, newRole) => {
    try {
      // Log the role change
      await logAction(AUDIT_ACTIONS.ROLE_CHANGE, `user:${userId}`, {
        oldRole,
        newRole,
        targetUserId: userId,
        success: true
      })

      // Here you would make API call to update role
      console.log(`Role changed for user ${userId}: ${oldRole} → ${newRole}`)
      
      setIsEditing(false)
      setSelectedUser(null)
    } catch (error) {
      console.error('Failed to change role:', error)
    }
  }

  const togglePermissionView = (role) => {
    setShowPermissions(prev => ({
      ...prev,
      [role]: !prev[role]
    }))
  }

  const formatLastLogin = (timestamp) => {
    const date = new Date(timestamp)
    return new Intl.DateTimeFormat(language === 'ar' ? 'ar-SA' : 'en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date)
  }

  const getPermissionDisplayName = (permission) => {
    const permissionNames = {
      // Product permissions
      'products:view': language === 'ar' ? 'عرض المنتجات' : 'View Products',
      'products:create': language === 'ar' ? 'إنشاء المنتجات' : 'Create Products',
      'products:edit': language === 'ar' ? 'تعديل المنتجات' : 'Edit Products',
      'products:delete': language === 'ar' ? 'حذف المنتجات' : 'Delete Products',
      
      // Order permissions
      'orders:view': language === 'ar' ? 'عرض الطلبات' : 'View Orders',
      'orders:edit': language === 'ar' ? 'تعديل الطلبات' : 'Edit Orders',
      'orders:refund': language === 'ar' ? 'استرداد الطلبات' : 'Refund Orders',
      
      // User permissions
      'users:view': language === 'ar' ? 'عرض المستخدمين' : 'View Users',
      'users:create': language === 'ar' ? 'إنشاء المستخدمين' : 'Create Users',
      'users:edit': language === 'ar' ? 'تعديل المستخدمين' : 'Edit Users',
      'users:delete': language === 'ar' ? 'حذف المستخدمين' : 'Delete Users',
      
      // Analytics permissions
      'analytics:view': language === 'ar' ? 'عرض التحليلات' : 'View Analytics',
      'analytics:export': language === 'ar' ? 'تصدير التحليلات' : 'Export Analytics',
      
      // Settings permissions
      'settings:view': language === 'ar' ? 'عرض الإعدادات' : 'View Settings',
      'settings:edit': language === 'ar' ? 'تعديل الإعدادات' : 'Edit Settings',
      
      // Security permissions
      'security:manage': language === 'ar' ? 'إدارة الأمان' : 'Manage Security',
      'roles:manage': language === 'ar' ? 'إدارة الأدوار' : 'Manage Roles'
    }
    return permissionNames[permission] || permission
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className={`mb-8 ${isRTL ? 'text-right' : 'text-left'}`}>
        <h1 className="text-3xl font-bold text-foreground mb-2 flex items-center gap-3">
          <Shield className="h-8 w-8 text-primary" />
          {t('roles.title', 'Role Management')}
        </h1>
        <p className="text-foreground/60">
          {t('roles.description', 'Manage user roles and permissions across the platform')}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Users List */}
        <div className="lg:col-span-2">
          <div className="bg-surface border border-border rounded-xl overflow-hidden">
            <div className="p-6 border-b border-border">
              <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
                <User className="h-5 w-5" />
                {t('roles.users', 'Users')}
              </h2>
            </div>

            <div className="divide-y divide-border">
              {users.map((user) => {
                const userPermissions = ROLE_PERMISSIONS[user.role] || []
                
                return (
                  <motion.div
                    key={user.id}
                    layout
                    className={`p-6 hover:bg-background/50 transition-colors cursor-pointer ${
                      selectedUser?.id === user.id ? 'bg-primary/5 border-primary/20' : ''
                    }`}
                    onClick={() => setSelectedUser(user)}
                  >
                    <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <div className={`flex items-center gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                        <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                          <User className="h-5 w-5 text-primary" />
                        </div>
                        <div className={isRTL ? 'text-right' : 'text-left'}>
                          <h3 className="font-semibold text-foreground">{user.name}</h3>
                          <p className="text-sm text-foreground/60">{user.email}</p>
                          <p className="text-xs text-foreground/50 mt-1">
                            {t('roles.lastLogin', 'Last login')}: {formatLastLogin(user.lastLogin)}
                          </p>
                        </div>
                      </div>

                      <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                        <span className={`px-3 py-1 text-xs font-medium rounded-full border ${getRoleColor(user.role)}`}>
                          {getRoleDisplayName(user.role)}
                        </span>
                        <span className={`w-2 h-2 rounded-full ${
                          user.status === 'active' ? 'bg-green-500' : 'bg-gray-400'
                        }`}></span>
                        {canManageRoles && (
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={(e) => {
                              e.stopPropagation()
                              setSelectedUser(user)
                              setNewRole(user.role)
                              setIsEditing(true)
                            }}
                            className="p-1 text-foreground/40 hover:text-primary transition-colors"
                          >
                            <Edit3 className="h-4 w-4" />
                          </motion.button>
                        )}
                      </div>
                    </div>

                    <div className={`mt-4 text-sm text-foreground/60 ${isRTL ? 'text-right' : 'text-left'}`}>
                      <span className="font-medium">
                        {t('roles.permissions', 'Permissions')}: {userPermissions.length}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          togglePermissionView(user.role)
                        }}
                        className={`text-primary hover:text-primary/80 font-medium ${
                          isRTL ? 'mr-2' : 'ml-2'
                        }`}
                      >
                        {showPermissions[user.role] 
                          ? t('roles.hidePermissions', 'Hide') 
                          : t('roles.showPermissions', 'Show')
                        }
                      </button>
                    </div>

                    <AnimatePresence>
                      {showPermissions[user.role] && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="mt-4 pt-4 border-t border-border"
                        >
                          <div className="grid grid-cols-2 gap-2">
                            {userPermissions.map((permission) => (
                              <div
                                key={permission}
                                className={`flex items-center gap-2 text-xs text-foreground/70 ${
                                  isRTL ? 'flex-row-reverse text-right' : ''
                                }`}
                              >
                                <Check className="h-3 w-3 text-green-500 flex-shrink-0" />
                                <span>{getPermissionDisplayName(permission)}</span>
                              </div>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Role Editor */}
        <div className="lg:col-span-1">
          <div className="bg-surface border border-border rounded-xl p-6 sticky top-6">
            <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <Lock className="h-5 w-5" />
              {selectedUser ? t('roles.editRole', 'Edit Role') : t('roles.selectUser', 'Select User')}
            </h3>

            {selectedUser ? (
              <div className="space-y-4">
                <div className={isRTL ? 'text-right' : 'text-left'}>
                  <p className="text-sm text-foreground/60 mb-1">
                    {t('roles.selectedUser', 'Selected User')}
                  </p>
                  <p className="font-medium text-foreground">{selectedUser.name}</p>
                  <p className="text-sm text-foreground/60">{selectedUser.email}</p>
                </div>

                {isEditing && canManageRoles ? (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        {t('roles.selectNewRole', 'Select New Role')}
                      </label>
                      <select
                        value={newRole}
                        onChange={(e) => setNewRole(e.target.value)}
                        className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground"
                      >
                        {Object.values(AVAILABLE_ROLES)
                          .filter(role => role !== ROLES.CUSTOMER) // Don't allow setting customer role
                          .map((role) => (
                            <option key={role} value={role}>
                              {getRoleDisplayName(role)}
                            </option>
                          ))}
                      </select>
                    </div>

                    <div className={`flex gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleRoleChange(selectedUser.id, selectedUser.role, newRole)}
                        className="flex-1 bg-primary text-primary-foreground px-4 py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
                      >
                        <Save className="h-4 w-4" />
                        {t('roles.saveChanges', 'Save Changes')}
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => {
                          setIsEditing(false)
                          setNewRole('')
                        }}
                        className="px-4 py-2 border border-border rounded-lg text-foreground hover:bg-background/50 transition-colors"
                      >
                        <X className="h-4 w-4" />
                      </motion.button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div>
                      <span className="text-sm text-foreground/60">
                        {t('roles.currentRole', 'Current Role')}
                      </span>
                      <div className={`mt-1 px-3 py-2 rounded-lg border ${getRoleColor(selectedUser.role)}`}>
                        {getRoleDisplayName(selectedUser.role)}
                      </div>
                    </div>

                    {canManageRoles && (
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => {
                          setNewRole(selectedUser.role)
                          setIsEditing(true)
                        }}
                        className="w-full bg-surface border border-border text-foreground px-4 py-2 rounded-lg font-medium hover:bg-background/50 transition-colors flex items-center justify-center gap-2"
                      >
                        <Edit3 className="h-4 w-4" />
                        {t('roles.editRole', 'Edit Role')}
                      </motion.button>
                    )}

                    <div className="pt-4 border-t border-border">
                      <h4 className="text-sm font-medium text-foreground mb-3">
                        {t('roles.rolePermissions', 'Role Permissions')}
                      </h4>
                      <div className="space-y-2 max-h-40 overflow-y-auto">
                        {(ROLE_PERMISSIONS[selectedUser.role] || []).map((permission) => (
                          <div
                            key={permission}
                            className={`flex items-center gap-2 text-xs text-foreground/70 ${
                              isRTL ? 'flex-row-reverse text-right' : ''
                            }`}
                          >
                            <Check className="h-3 w-3 text-green-500 flex-shrink-0" />
                            <span>{getPermissionDisplayName(permission)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8">
                <User className="mx-auto h-12 w-12 text-foreground/30 mb-4" />
                <p className="text-foreground/60">
                  {t('roles.selectUserToEdit', 'Select a user to view or edit their role')}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default RoleManagement