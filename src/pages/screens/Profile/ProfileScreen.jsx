import { useState } from 'react'
import Container from '../../../ui/components/Container.jsx'
import { SEO } from '../../../components/SEO'
import { LoadingButton } from '../../../ui/components/LoadingStates.jsx'
import {
  User,
  Package,
  Heart,
  Settings,
  Shield,
  CreditCard,
  Edit2,
  Save,
} from 'lucide-react'
import CurrencySelector from '../../../ui/components/CurrencySelector.jsx'
import toast from 'react-hot-toast'

export default function ProfileScreen() {
  const [activeTab, setActiveTab] = useState('profile')
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [profileData, setProfileData] = useState({
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
    address: '123 Main St',
    city: 'New York',
    country: 'United States',
    postalCode: '10001',
  })

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'orders', label: 'Orders', icon: Package },
    { id: 'wishlist', label: 'Wishlist', icon: Heart },
    { id: 'payments', label: 'Payment Methods', icon: CreditCard },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'settings', label: 'Settings', icon: Settings },
  ]

  const orders = [
    {
      id: 'ORD-001',
      date: '2024-01-15',
      status: 'Delivered',
      total: 129.99,
      items: 3,
    },
    {
      id: 'ORD-002',
      date: '2024-01-10',
      status: 'In Transit',
      total: 89.5,
      items: 2,
    },
    {
      id: 'ORD-003',
      date: '2024-01-05',
      status: 'Processing',
      total: 199.99,
      items: 1,
    },
  ]

  const handleInputChange = e => {
    const { name, value } = e.target
    setProfileData(prev => ({ ...prev, [name]: value }))
  }

  const handleSaveProfile = async () => {
    setIsSaving(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))
    toast.success('Profile updated successfully!')
    setIsEditing(false)
    setIsSaving(false)
  }

  const renderProfileTab = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Profile Information</h2>
        <button
          onClick={() => (isEditing ? handleSaveProfile() : setIsEditing(true))}
          className="btn btn-outline flex items-center gap-2"
        >
          {isEditing ? <Save size={16} /> : <Edit2 size={16} />}
          {isEditing ? 'Save Changes' : 'Edit Profile'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium mb-2">First Name</label>
          <input
            type="text"
            name="firstName"
            value={profileData.firstName}
            onChange={handleInputChange}
            disabled={!isEditing}
            className="w-full border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-500 disabled:bg-stone-50"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Last Name</label>
          <input
            type="text"
            name="lastName"
            value={profileData.lastName}
            onChange={handleInputChange}
            disabled={!isEditing}
            className="w-full border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-500 disabled:bg-stone-50"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Email</label>
          <input
            type="email"
            name="email"
            value={profileData.email}
            onChange={handleInputChange}
            disabled={!isEditing}
            className="w-full border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-500 disabled:bg-stone-50"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Phone</label>
          <input
            type="tel"
            name="phone"
            value={profileData.phone}
            onChange={handleInputChange}
            disabled={!isEditing}
            className="w-full border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-500 disabled:bg-stone-50"
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-2">Address</label>
          <input
            type="text"
            name="address"
            value={profileData.address}
            onChange={handleInputChange}
            disabled={!isEditing}
            className="w-full border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-500 disabled:bg-stone-50"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">City</label>
          <input
            type="text"
            name="city"
            value={profileData.city}
            onChange={handleInputChange}
            disabled={!isEditing}
            className="w-full border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-500 disabled:bg-stone-50"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Country</label>
          <input
            type="text"
            name="country"
            value={profileData.country}
            onChange={handleInputChange}
            disabled={!isEditing}
            className="w-full border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-500 disabled:bg-stone-50"
          />
        </div>
      </div>

      {isEditing && (
        <div className="flex gap-3">
          <LoadingButton
            onClick={handleSaveProfile}
            loading={isSaving}
            className="btn btn-primary"
            disabled={isSaving}
          >
            Save Changes
          </LoadingButton>
          <button
            onClick={() => setIsEditing(false)}
            className="btn btn-outline"
            disabled={isSaving}
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  )

  const renderOrdersTab = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Order History</h2>
      <div className="space-y-4">
        {orders.map(order => (
          <div key={order.id} className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-semibold">{order.id}</h3>
                <p className="text-sm text-stone-600">Placed on {order.date}</p>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  order.status === 'Delivered'
                    ? 'bg-green-100 text-green-800'
                    : order.status === 'In Transit'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-amber-100 text-amber-800'
                }`}
              >
                {order.status}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-stone-600">{order.items} items</p>
              <div className="text-right">
                <p className="font-semibold">${order.total}</p>
                <button className="text-brand-600 hover:text-brand-700 text-sm">
                  View Details
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )

  const renderWishlistTab = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Wishlist</h2>
      <div className="text-center py-12">
        <Heart size={48} className="mx-auto text-stone-300 mb-4" />
        <h3 className="text-lg font-medium mb-2">Your wishlist is empty</h3>
        <p className="text-stone-600 mb-6">Save items you love for later</p>
        <a href="/shop" className="btn btn-primary">
          Start Shopping
        </a>
      </div>
    </div>
  )

  const renderPaymentsTab = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Payment Methods</h2>
        <button className="btn btn-outline">Add Payment Method</button>
      </div>
      <div className="card p-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
            <span className="text-white text-xs font-bold">VISA</span>
          </div>
          <div className="flex-1">
            <p className="font-medium">•••• •••• •••• 4242</p>
            <p className="text-sm text-stone-600">Expires 12/25</p>
          </div>
          <button className="text-stone-400 hover:text-stone-600">
            <Edit2 size={16} />
          </button>
        </div>
      </div>
    </div>
  )

  const renderSecurityTab = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Security Settings</h2>
      <div className="space-y-4">
        <div className="card p-6">
          <h3 className="font-medium mb-2">Password</h3>
          <p className="text-stone-600 mb-4">Last changed 30 days ago</p>
          <button className="btn btn-outline">Change Password</button>
        </div>
        <div className="card p-6">
          <h3 className="font-medium mb-2">Two-Factor Authentication</h3>
          <p className="text-stone-600 mb-4">
            Add an extra layer of security to your account
          </p>
          <button className="btn btn-outline">Enable 2FA</button>
        </div>
      </div>
    </div>
  )

  const renderSettingsTab = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Settings</h2>
      <div className="space-y-4">
        {/* Currency & Region Settings */}
        <div className="card p-6">
          <h3 className="font-medium mb-4">Regional Preferences</h3>
          <p className="text-stone-600 text-sm mb-4">
            Configure your preferred currency and region for localized pricing
            and content.
          </p>
          <CurrencySelector variant="profile" showRegion={true} />
        </div>

        <div className="card p-6">
          <h3 className="font-medium mb-4">Notifications</h3>
          <div className="space-y-3">
            <label className="flex items-center justify-between">
              <span>Email notifications</span>
              <input type="checkbox" defaultChecked className="toggle" />
            </label>
            <label className="flex items-center justify-between">
              <span>Order updates</span>
              <input type="checkbox" defaultChecked className="toggle" />
            </label>
            <label className="flex items-center justify-between">
              <span>Marketing emails</span>
              <input type="checkbox" className="toggle" />
            </label>
          </div>
        </div>
        <div className="card p-6">
          <h3 className="font-medium mb-4">Privacy</h3>
          <div className="space-y-3">
            <label className="flex items-center justify-between">
              <span>Make profile public</span>
              <input type="checkbox" className="toggle" />
            </label>
            <label className="flex items-center justify-between">
              <span>Show online status</span>
              <input type="checkbox" defaultChecked className="toggle" />
            </label>
          </div>
        </div>
      </div>
    </div>
  )

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return renderProfileTab()
      case 'orders':
        return renderOrdersTab()
      case 'wishlist':
        return renderWishlistTab()
      case 'payments':
        return renderPaymentsTab()
      case 'security':
        return renderSecurityTab()
      case 'settings':
        return renderSettingsTab()
      default:
        return renderProfileTab()
    }
  }

  return (
    <>
      <SEO
        title="My Profile - IVOLEX"
        description="Manage your IVOLEX account settings, view order history, and update your profile information."
        keywords="profile, account, orders, settings, ivolex"
      />
      <section className="py-10">
        <Container>
          <div className="max-w-6xl mx-auto">
            <div className="mb-8">
              <h1 className="text-2xl font-bold mb-2">My Account</h1>
              <p className="text-stone-600">
                Manage your profile and account settings
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              {/* Sidebar */}
              <div className="lg:col-span-1">
                <div className="card p-6">
                  <div className="text-center mb-6">
                    <div className="w-20 h-20 bg-brand-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <User size={32} className="text-brand-600" />
                    </div>
                    <h3 className="font-semibold">
                      {profileData.firstName} {profileData.lastName}
                    </h3>
                    <p className="text-stone-600 text-sm">
                      {profileData.email}
                    </p>
                  </div>

                  <nav className="space-y-1">
                    {tabs.map(tab => {
                      const Icon = tab.icon
                      return (
                        <button
                          key={tab.id}
                          onClick={() => setActiveTab(tab.id)}
                          className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-left transition-colors ${
                            activeTab === tab.id
                              ? 'bg-brand-50 text-brand-700'
                              : 'text-stone-600 hover:bg-stone-50'
                          }`}
                        >
                          <Icon size={18} />
                          {tab.label}
                        </button>
                      )
                    })}
                  </nav>
                </div>
              </div>

              {/* Content */}
              <div className="lg:col-span-3">
                <div className="card p-8">{renderTabContent()}</div>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </>
  )
}
