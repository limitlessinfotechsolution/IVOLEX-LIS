import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Globe,
  Plus,
  Edit3,
  Trash2,
  Download,
  Upload,
  Check,
  X,
  Search,
  RefreshCw,
  Copy,
  AlertCircle,
  CheckCircle,
  Languages,
} from 'lucide-react'

const LanguageManager = () => {
  const [languages, setLanguages] = useState([
    {
      code: 'en',
      name: 'English',
      nativeName: 'English',
      flag: '🇺🇸',
      isDefault: true,
      isActive: true,
      progress: 100,
      lastUpdated: '2024-01-20',
      translationCount: 1247,
    },
    {
      code: 'ar',
      name: 'Arabic',
      nativeName: 'العربية',
      flag: '🇸🇦',
      isDefault: false,
      isActive: true,
      progress: 95,
      direction: 'rtl',
      lastUpdated: '2024-01-18',
      translationCount: 1185,
    },
    {
      code: 'hi',
      name: 'Hindi',
      nativeName: 'हिन्दी',
      flag: '🇮🇳',
      isDefault: false,
      isActive: true,
      progress: 87,
      lastUpdated: '2024-01-15',
      translationCount: 1085,
    },
  ])

  const [translations, setTranslations] = useState({
    en: {
      'common.hello': 'Hello',
      'common.welcome': 'Welcome',
      'common.save': 'Save',
      'common.cancel': 'Cancel',
      'common.delete': 'Delete',
      'admin.dashboard': 'Dashboard',
      'admin.products': 'Products',
      'admin.orders': 'Orders',
      'admin.customers': 'Customers',
      'admin.settings': 'Settings',
    },
    ar: {
      'common.hello': 'مرحبا',
      'common.welcome': 'أهلا وسهلا',
      'common.save': 'حفظ',
      'common.cancel': 'إلغاء',
      'common.delete': 'حذف',
      'admin.dashboard': 'لوحة التحكم',
      'admin.products': 'المنتجات',
      'admin.orders': 'الطلبات',
      'admin.customers': 'العملاء',
      'admin.settings': 'الإعدادات',
    },
    hi: {
      'common.hello': 'नमस्ते',
      'common.welcome': 'स्वागत है',
      'common.save': 'सहेजें',
      'common.cancel': 'रद्द करें',
      'common.delete': 'हटाएं',
      'admin.dashboard': 'डैशबोर्ड',
      'admin.products': 'उत्पाद',
      'admin.orders': 'आदेश',
      'admin.customers': 'ग्राहक',
      'admin.settings': 'सेटिंग्स',
    },
  })

  const [selectedLanguage, setSelectedLanguage] = useState('en')
  const [editingKey, setEditingKey] = useState(null)
  const [editValue, setEditValue] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [showAddLanguage, setShowAddLanguage] = useState(false)
  const [newLanguage, setNewLanguage] = useState({
    code: '',
    name: '',
    nativeName: '',
    flag: '',
    direction: 'ltr',
  })

  const availableLanguages = [
    { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸' },
    { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷' },
    { code: 'de', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪' },
    { code: 'it', name: 'Italian', nativeName: 'Italiano', flag: '🇮🇹' },
    { code: 'pt', name: 'Portuguese', nativeName: 'Português', flag: '🇵🇹' },
    { code: 'ru', name: 'Russian', nativeName: 'Русский', flag: '🇷🇺' },
    { code: 'ja', name: 'Japanese', nativeName: '日本語', flag: '🇯🇵' },
    { code: 'ko', name: 'Korean', nativeName: '한국어', flag: '🇰🇷' },
    { code: 'zh', name: 'Chinese', nativeName: '中文', flag: '🇨🇳' },
    {
      code: 'ur',
      name: 'Urdu',
      nativeName: 'اردو',
      flag: '🇵🇰',
      direction: 'rtl',
    },
  ]

  const filteredTranslations = Object.entries(
    translations[selectedLanguage] || {}
  ).filter(
    ([key, value]) =>
      key.toLowerCase().includes(searchQuery.toLowerCase()) ||
      value.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const getMissingTranslations = langCode => {
    const englishKeys = Object.keys(translations.en || {})
    const langKeys = Object.keys(translations[langCode] || {})
    return englishKeys.filter(key => !langKeys.includes(key))
  }

  const addLanguage = () => {
    if (!newLanguage.code || !newLanguage.name) return

    const language = {
      ...newLanguage,
      isDefault: false,
      isActive: true,
      progress: 0,
      lastUpdated: new Date().toISOString().split('T')[0],
      translationCount: 0,
    }

    setLanguages(prev => [...prev, language])
    setTranslations(prev => ({ ...prev, [newLanguage.code]: {} }))
    setNewLanguage({
      code: '',
      name: '',
      nativeName: '',
      flag: '',
      direction: 'ltr',
    })
    setShowAddLanguage(false)
  }

  const removeLanguage = langCode => {
    if (langCode === 'en') return // Can't remove default language

    setLanguages(prev => prev.filter(lang => lang.code !== langCode))
    setTranslations(prev => {
      const updated = { ...prev }
      delete updated[langCode]
      return updated
    })

    if (selectedLanguage === langCode) {
      setSelectedLanguage('en')
    }
  }

  const startEditing = (key, value) => {
    setEditingKey(key)
    setEditValue(value)
  }

  const saveTranslation = () => {
    if (!editingKey) return

    setTranslations(prev => ({
      ...prev,
      [selectedLanguage]: {
        ...prev[selectedLanguage],
        [editingKey]: editValue,
      },
    }))

    // Update language progress
    const totalKeys = Object.keys(translations.en).length
    const translatedKeys = Object.keys({
      ...translations[selectedLanguage],
      [editingKey]: editValue,
    }).length
    const progress = Math.round((translatedKeys / totalKeys) * 100)

    setLanguages(prev =>
      prev.map(lang =>
        lang.code === selectedLanguage
          ? {
              ...lang,
              progress,
              translationCount: translatedKeys,
              lastUpdated: new Date().toISOString().split('T')[0],
            }
          : lang
      )
    )

    setEditingKey(null)
    setEditValue('')
  }

  const cancelEditing = () => {
    setEditingKey(null)
    setEditValue('')
  }

  const exportTranslations = langCode => {
    const data = {
      language: languages.find(l => l.code === langCode),
      translations: translations[langCode],
      exportDate: new Date().toISOString(),
      version: '1.0',
    }

    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: 'application/json',
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `translations-${langCode}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const importTranslations = event => {
    const file = event.target.files[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = e => {
      try {
        const data = JSON.parse(e.target.result)
        if (data.language && data.translations) {
          setTranslations(prev => ({
            ...prev,
            [data.language.code]: data.translations,
          }))

          if (!languages.find(l => l.code === data.language.code)) {
            setLanguages(prev => [...prev, data.language])
          }
        }
      } catch (error) {
        console.error('Failed to import translations:', error)
      }
    }
    reader.readAsText(file)
  }

  const autoTranslate = async langCode => {
    // Simulate auto-translation API call
    const missingKeys = getMissingTranslations(langCode)
    const newTranslations = {}

    for (const key of missingKeys.slice(0, 5)) {
      // Limit for demo
      // Simulate translation
      newTranslations[key] = `[AUTO] ${translations.en[key]}`
    }

    setTranslations(prev => ({
      ...prev,
      [langCode]: { ...prev[langCode], ...newTranslations },
    }))

    // Update progress
    const totalKeys = Object.keys(translations.en).length
    const translatedKeys = Object.keys({
      ...translations[langCode],
      ...newTranslations,
    }).length
    const progress = Math.round((translatedKeys / totalKeys) * 100)

    setLanguages(prev =>
      prev.map(lang =>
        lang.code === langCode
          ? {
              ...lang,
              progress,
              translationCount: translatedKeys,
              lastUpdated: new Date().toISOString().split('T')[0],
            }
          : lang
      )
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Languages className="w-8 h-8 text-blue-600" />
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Language Manager
            </h2>
            <p className="text-gray-600">
              Manage translations and multi-language support
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
            <Upload className="w-4 h-4" />
            Import
            <input
              type="file"
              accept=".json"
              onChange={importTranslations}
              className="hidden"
            />
          </label>

          <button
            onClick={() => setShowAddLanguage(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Language
          </button>
        </div>
      </div>

      {/* Language Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {languages.map(language => (
          <motion.div
            key={language.code}
            className={`bg-white rounded-lg shadow-sm border p-4 cursor-pointer transition-all ${
              selectedLanguage === language.code
                ? 'ring-2 ring-blue-500 border-blue-200'
                : 'hover:border-gray-300'
            }`}
            onClick={() => setSelectedLanguage(language.code)}
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{language.flag}</span>
                <div>
                  <h3 className="font-medium text-gray-900">{language.name}</h3>
                  <p className="text-sm text-gray-600">{language.nativeName}</p>
                </div>
              </div>

              <div className="flex items-center gap-1">
                {language.isDefault && (
                  <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                    Default
                  </span>
                )}
                {language.isActive ? (
                  <CheckCircle className="w-4 h-4 text-green-600" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-gray-400" />
                )}
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Progress</span>
                <span className="font-medium">{language.progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${language.progress}%` }}
                />
              </div>
              <div className="flex justify-between text-xs text-gray-500">
                <span>{language.translationCount} translations</span>
                <span>Updated {language.lastUpdated}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-100">
              <button
                onClick={e => {
                  e.stopPropagation()
                  exportTranslations(language.code)
                }}
                className="flex items-center gap-1 px-2 py-1 text-xs text-gray-600 hover:text-gray-800 transition-colors"
              >
                <Download className="w-3 h-3" />
                Export
              </button>

              {language.progress < 100 && (
                <button
                  onClick={e => {
                    e.stopPropagation()
                    autoTranslate(language.code)
                  }}
                  className="flex items-center gap-1 px-2 py-1 text-xs text-blue-600 hover:text-blue-800 transition-colors"
                >
                  <RefreshCw className="w-3 h-3" />
                  Auto-translate
                </button>
              )}

              {!language.isDefault && (
                <button
                  onClick={e => {
                    e.stopPropagation()
                    removeLanguage(language.code)
                  }}
                  className="flex items-center gap-1 px-2 py-1 text-xs text-red-600 hover:text-red-800 transition-colors"
                >
                  <Trash2 className="w-3 h-3" />
                  Remove
                </button>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Translation Editor */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-2xl">
                {languages.find(l => l.code === selectedLanguage)?.flag}
              </span>
              <div>
                <h3 className="font-medium text-gray-900">
                  {languages.find(l => l.code === selectedLanguage)?.name}{' '}
                  Translations
                </h3>
                <p className="text-sm text-gray-600">
                  {filteredTranslations.length} of{' '}
                  {Object.keys(translations.en).length} translations
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search translations..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="max-h-96 overflow-y-auto">
          {filteredTranslations.map(([key, value]) => (
            <div
              key={key}
              className="p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors"
            >
              {editingKey === key ? (
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Translation Key
                    </label>
                    <div className="text-sm text-gray-600 bg-gray-100 p-2 rounded">
                      {key}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Original (English)
                    </label>
                    <div className="text-sm text-gray-600 bg-gray-100 p-2 rounded">
                      {translations.en[key]}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Translation (
                      {languages.find(l => l.code === selectedLanguage)?.name})
                    </label>
                    <textarea
                      value={editValue}
                      onChange={e => setEditValue(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      rows={3}
                      dir={
                        languages.find(l => l.code === selectedLanguage)
                          ?.direction || 'ltr'
                      }
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={saveTranslation}
                      className="flex items-center gap-2 px-3 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      <Check className="w-4 h-4" />
                      Save
                    </button>
                    <button
                      onClick={cancelEditing}
                      className="flex items-center gap-2 px-3 py-1.5 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                    >
                      <X className="w-4 h-4" />
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-start justify-between">
                  <div className="flex-1 space-y-2">
                    <div className="text-sm font-medium text-gray-900">
                      {key}
                    </div>
                    <div className="text-sm text-gray-600">
                      {translations.en[key]}
                    </div>
                    <div
                      className="text-sm text-gray-900 font-medium"
                      dir={
                        languages.find(l => l.code === selectedLanguage)
                          ?.direction || 'ltr'
                      }
                    >
                      {value || (
                        <span className="text-red-500 italic">
                          Missing translation
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => navigator.clipboard.writeText(value)}
                      className="p-1.5 hover:bg-gray-200 rounded transition-colors"
                      title="Copy translation"
                    >
                      <Copy className="w-4 h-4 text-gray-500" />
                    </button>
                    <button
                      onClick={() => startEditing(key, value || '')}
                      className="p-1.5 hover:bg-gray-200 rounded transition-colors"
                      title="Edit translation"
                    >
                      <Edit3 className="w-4 h-4 text-gray-500" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {filteredTranslations.length === 0 && (
          <div className="p-8 text-center text-gray-500">
            <Globe className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No translations found matching your search</p>
          </div>
        )}
      </div>

      {/* Add Language Modal */}
      <AnimatePresence>
        {showAddLanguage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-lg p-6 max-w-md w-full mx-4"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900">
                  Add New Language
                </h3>
                <button
                  onClick={() => setShowAddLanguage(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Language
                  </label>
                  <select
                    value={newLanguage.code}
                    onChange={e => {
                      const selected = availableLanguages.find(
                        l => l.code === e.target.value
                      )
                      if (selected) {
                        setNewLanguage(selected)
                      }
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Choose a language</option>
                    {availableLanguages
                      .filter(
                        lang => !languages.find(l => l.code === lang.code)
                      )
                      .map(lang => (
                        <option key={lang.code} value={lang.code}>
                          {lang.flag} {lang.name} ({lang.nativeName})
                        </option>
                      ))}
                  </select>
                </div>

                {newLanguage.code && (
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-2xl">{newLanguage.flag}</span>
                      <div>
                        <div className="font-medium">{newLanguage.name}</div>
                        <div className="text-sm text-gray-600">
                          {newLanguage.nativeName}
                        </div>
                      </div>
                    </div>
                    {newLanguage.direction === 'rtl' && (
                      <div className="text-xs text-orange-600 bg-orange-100 px-2 py-1 rounded">
                        Right-to-left language
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => setShowAddLanguage(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={addLanguage}
                  disabled={!newLanguage.code}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  Add Language
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default LanguageManager
