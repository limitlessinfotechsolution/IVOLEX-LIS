import { useState } from 'react'
import { motion } from 'framer-motion'
import { useNotifications } from '../../contexts/NotificationContext'
import { useI18n } from '../../contexts/I18nContext'

const NotificationSettings = () => {
  const { preferences, updatePreferences } = useNotifications()
  const { t, isRTL } = useI18n()
  const [saving, setSaving] = useState(false)

  const handlePreferenceChange = async (channel, type, value) => {
    setSaving(true)

    const newPreferences = {
      ...preferences,
      [channel]: {
        ...preferences[channel],
        [type]: value,
      },
    }

    updatePreferences(newPreferences)

    // Simulate API call
    setTimeout(() => setSaving(false), 500)
  }

  const notificationTypes = [
    {
      key: 'orderUpdates',
      label: t('notifications.orderUpdates', 'Order Updates'),
      labelAr: 'تحديثات الطلبات',
      description: t(
        'notifications.orderUpdatesDesc',
        'Receive updates about your orders, payments, and shipping'
      ),
      descriptionAr: 'احصل على تحديثات حول طلباتك والمدفوعات والشحن',
    },
    {
      key: 'customizationUpdates',
      label: t('notifications.customizationUpdates', 'Customization Updates'),
      labelAr: 'تحديثات التخصيص',
      description: t(
        'notifications.customizationUpdatesDesc',
        'Get notified about your custom requests progress'
      ),
      descriptionAr: 'احصل على إشعارات حول تقدم طلبات التخصيص الخاصة بك',
    },
    {
      key: 'promotions',
      label: t('notifications.promotions', 'Promotions & Offers'),
      labelAr: 'العروض والخصومات',
      description: t(
        'notifications.promotionsDesc',
        'Receive promotional offers and discounts'
      ),
      descriptionAr: 'احصل على العروض الترويجية والخصومات',
    },
    {
      key: 'newsletter',
      label: t('notifications.newsletter', 'Newsletter'),
      labelAr: 'النشرة الإخبارية',
      description: t(
        'notifications.newsletterDesc',
        'Stay updated with IVOLEX news and trends'
      ),
      descriptionAr: 'ابق على اطلاع بأخبار وتطورات IVOLEX',
    },
  ]

  const channels = [
    {
      key: 'email',
      label: t('notifications.email', 'Email'),
      icon: '📧',
      description: t('notifications.emailDesc', 'Email notifications'),
      types: [
        'orderUpdates',
        'customizationUpdates',
        'promotions',
        'newsletter',
      ],
    },
    {
      key: 'sms',
      label: t('notifications.sms', 'SMS'),
      icon: '📱',
      description: t('notifications.smsDesc', 'Text message notifications'),
      types: ['orderUpdates', 'customizationUpdates', 'promotions'],
    },
    {
      key: 'whatsapp',
      label: t('notifications.whatsapp', 'WhatsApp'),
      icon: '💬',
      description: t('notifications.whatsappDesc', 'WhatsApp notifications'),
      types: ['orderUpdates', 'customizationUpdates', 'promotions'],
    },
  ]

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className={`mb-8 ${isRTL ? 'text-right' : 'text-left'}`}>
        <h1 className="text-3xl font-bold text-foreground mb-2">
          {t('notifications.settings', 'Notification Settings')}
        </h1>
        <p className="text-foreground/60">
          {t(
            'notifications.settingsDesc',
            'Manage how you receive notifications from IVOLEX'
          )}
        </p>
      </div>

      {saving && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg"
        >
          <div
            className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}
          >
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-green-500 border-t-transparent"></div>
            <span className="text-green-700 font-medium">
              {t('notifications.saving', 'Saving preferences...')}
            </span>
          </div>
        </motion.div>
      )}

      <div className="space-y-8">
        {channels.map(channel => (
          <motion.div
            key={channel.key}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-surface border border-border rounded-xl p-6"
          >
            <div
              className={`flex items-center gap-4 mb-6 ${isRTL ? 'flex-row-reverse' : ''}`}
            >
              <span className="text-2xl">{channel.icon}</span>
              <div className={isRTL ? 'text-right' : 'text-left'}>
                <h3 className="text-xl font-semibold text-foreground">
                  {channel.label}
                </h3>
                <p className="text-foreground/60">{channel.description}</p>
              </div>
            </div>

            <div className="space-y-4">
              {channel.types.map(type => {
                const notificationType = notificationTypes.find(
                  nt => nt.key === type
                )
                if (!notificationType) return null

                const isEnabled = preferences[channel.key]?.[type] || false

                return (
                  <div
                    key={type}
                    className={`flex items-center justify-between p-4 bg-background/50 rounded-lg ${
                      isRTL ? 'flex-row-reverse' : ''
                    }`}
                  >
                    <div className={isRTL ? 'text-right' : 'text-left'}>
                      <h4 className="font-medium text-foreground">
                        {isRTL
                          ? notificationType.labelAr
                          : notificationType.label}
                      </h4>
                      <p className="text-sm text-foreground/60">
                        {isRTL
                          ? notificationType.descriptionAr
                          : notificationType.description}
                      </p>
                    </div>

                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={() =>
                        handlePreferenceChange(channel.key, type, !isEnabled)
                      }
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20 ${
                        isEnabled ? 'bg-primary' : 'bg-gray-300'
                      }`}
                    >
                      <motion.span
                        animate={{
                          x: isEnabled ? (isRTL ? -20 : 20) : isRTL ? -4 : 4,
                        }}
                        className="inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform"
                      />
                    </motion.button>
                  </div>
                )
              })}
            </div>
          </motion.div>
        ))}

        {/* In-App Notifications */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-surface border border-border rounded-xl p-6"
        >
          <div
            className={`flex items-center gap-4 mb-6 ${isRTL ? 'flex-row-reverse' : ''}`}
          >
            <span className="text-2xl">🔔</span>
            <div className={isRTL ? 'text-right' : 'text-left'}>
              <h3 className="text-xl font-semibold text-foreground">
                {t('notifications.inApp', 'In-App Notifications')}
              </h3>
              <p className="text-foreground/60">
                {t(
                  'notifications.inAppDesc',
                  'Notifications shown within the IVOLEX app'
                )}
              </p>
            </div>
          </div>

          <div
            className={`flex items-center justify-between p-4 bg-background/50 rounded-lg ${
              isRTL ? 'flex-row-reverse' : ''
            }`}
          >
            <div className={isRTL ? 'text-right' : 'text-left'}>
              <h4 className="font-medium text-foreground">
                {t('notifications.allInApp', 'All In-App Notifications')}
              </h4>
              <p className="text-sm text-foreground/60">
                {t(
                  'notifications.allInAppDesc',
                  'Receive all notifications within the app interface'
                )}
              </p>
            </div>

            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() =>
                handlePreferenceChange('inApp', 'all', !preferences.inApp?.all)
              }
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20 ${
                preferences.inApp?.all ? 'bg-primary' : 'bg-gray-300'
              }`}
            >
              <motion.span
                animate={{
                  x: preferences.inApp?.all
                    ? isRTL
                      ? -20
                      : 20
                    : isRTL
                      ? -4
                      : 4,
                }}
                className="inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform"
              />
            </motion.button>
          </div>
        </motion.div>
      </div>

      {/* Contact Information */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-8 p-6 bg-primary/5 border border-primary/20 rounded-xl"
      >
        <h3
          className={`text-lg font-semibold text-foreground mb-3 ${isRTL ? 'text-right' : 'text-left'}`}
        >
          {t('notifications.contactInfo', 'Contact Information')}
        </h3>
        <p
          className={`text-foreground/70 mb-4 ${isRTL ? 'text-right' : 'text-left'}`}
        >
          {t(
            'notifications.contactInfoDesc',
            'Update your contact details to receive notifications'
          )}
        </p>
        <div
          className={`flex gap-4 ${isRTL ? 'flex-row-reverse justify-end' : ''}`}
        >
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
          >
            {t('notifications.updateEmail', 'Update Email')}
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="px-4 py-2 bg-surface border border-border text-foreground rounded-lg font-medium hover:bg-surface/80 transition-colors"
          >
            {t('notifications.updatePhone', 'Update Phone')}
          </motion.button>
        </div>
      </motion.div>
    </div>
  )
}

export default NotificationSettings
