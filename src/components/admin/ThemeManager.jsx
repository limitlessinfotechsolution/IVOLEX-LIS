import { useState, useEffect, useCallback, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Sun,
  Moon,
  Monitor,
  Palette,
  Settings,
  Download,
  Upload,
  Save,
  Check,
  Copy,
  Smartphone,
  Tablet,
} from 'lucide-react'

const ThemeManager = () => {
  const [currentTheme, setCurrentTheme] = useState('light')
  const [customThemes, setCustomThemes] = useState([])
  const [isCreating, setIsCreating] = useState(false)
  const [selectedDevice, setSelectedDevice] = useState('desktop')

  const [themeEditor, setThemeEditor] = useState({
    name: '',
    colors: {
      primary: '#3b82f6',
      secondary: '#64748b',
      background: '#ffffff',
      surface: '#f8fafc',
      text: '#1e293b',
      textSecondary: '#64748b',
      border: '#e2e8f0',
      success: '#10b981',
      warning: '#f59e0b',
      error: '#ef4444',
    },
    typography: {
      fontFamily: 'Inter',
      fontSize: 14,
      fontWeight: 400,
      lineHeight: 1.5,
    },
    spacing: {
      unit: 8,
      container: 1200,
    },
    borderRadius: {
      sm: 4,
      md: 8,
      lg: 12,
      xl: 16,
    },
    shadows: {
      sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
      md: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
      lg: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
    },
  })

  const builtInThemes = useMemo(
    () => [
      {
        id: 'light',
        name: 'Light',
        icon: Sun,
        colors: {
          primary: '#3b82f6',
          secondary: '#64748b',
          background: '#ffffff',
          surface: '#f8fafc',
          text: '#1e293b',
          textSecondary: '#64748b',
          border: '#e2e8f0',
          success: '#10b981',
          warning: '#f59e0b',
          error: '#ef4444',
        },
      },
      {
        id: 'dark',
        name: 'Dark',
        icon: Moon,
        colors: {
          primary: '#60a5fa',
          secondary: '#94a3b8',
          background: '#0f172a',
          surface: '#1e293b',
          text: '#f1f5f9',
          textSecondary: '#94a3b8',
          border: '#334155',
          success: '#34d399',
          warning: '#fbbf24',
          error: '#f87171',
        },
      },
      {
        id: 'system',
        name: 'System',
        icon: Monitor,
        colors: {
          primary: '#6366f1',
          secondary: '#6b7280',
          background: '#ffffff',
          surface: '#f9fafb',
          text: '#111827',
          textSecondary: '#6b7280',
          border: '#d1d5db',
          success: '#059669',
          warning: '#d97706',
          error: '#dc2626',
        },
      },
    ],
    []
  )

  const colorPresets = [
    { name: 'Blue', primary: '#3b82f6', secondary: '#1e40af' },
    { name: 'Purple', primary: '#8b5cf6', secondary: '#7c3aed' },
    { name: 'Green', primary: '#10b981', secondary: '#059669' },
    { name: 'Orange', primary: '#f59e0b', secondary: '#d97706' },
    { name: 'Red', primary: '#ef4444', secondary: '#dc2626' },
    { name: 'Pink', primary: '#ec4899', secondary: '#db2777' },
    { name: 'Indigo', primary: '#6366f1', secondary: '#4f46e5' },
    { name: 'Teal', primary: '#14b8a6', secondary: '#0d9488' },
  ]

  useEffect(() => {
    // Load saved theme from localStorage
    const savedTheme = localStorage.getItem('ivolex-theme')
    if (savedTheme) {
      setCurrentTheme(savedTheme)
      applyTheme(savedTheme)
    } else {
      // Detect system preference
      const prefersDark = window.matchMedia(
        '(prefers-color-scheme: dark)'
      ).matches
      const initialTheme = prefersDark ? 'dark' : 'light'
      setCurrentTheme(initialTheme)
      applyTheme(initialTheme)
    }

    // Load custom themes
    const savedCustomThemes = localStorage.getItem('ivolex-custom-themes')
    if (savedCustomThemes) {
      setCustomThemes(JSON.parse(savedCustomThemes))
    }
  }, [applyTheme])

  const applyTheme = useCallback(
    themeId => {
      const theme = [...builtInThemes, ...customThemes].find(
        t => t.id === themeId
      )
      if (!theme) return

      const root = document.documentElement

      // Apply CSS custom properties
      Object.entries(theme.colors).forEach(([key, value]) => {
        root.style.setProperty(`--color-${key}`, value)
      })

      // Apply additional theme properties if available
      if (theme.typography) {
        root.style.setProperty('--font-family', theme.typography.fontFamily)
        root.style.setProperty('--font-size', `${theme.typography.fontSize}px`)
      }

      if (theme.borderRadius) {
        Object.entries(theme.borderRadius).forEach(([key, value]) => {
          root.style.setProperty(`--radius-${key}`, `${value}px`)
        })
      }

      // Update body class for dark/light mode
      document.body.className = document.body.className.replace(
        /theme-\w+/g,
        ''
      )
      document.body.classList.add(`theme-${themeId}`)
    },
    [builtInThemes, customThemes]
  )

  const handleThemeChange = themeId => {
    setCurrentTheme(themeId)
    applyTheme(themeId)
    localStorage.setItem('ivolex-theme', themeId)
  }

  const createCustomTheme = () => {
    if (!themeEditor.name.trim()) return

    const newTheme = {
      id: `custom-${Date.now()}`,
      name: themeEditor.name,
      colors: { ...themeEditor.colors },
      typography: { ...themeEditor.typography },
      spacing: { ...themeEditor.spacing },
      borderRadius: { ...themeEditor.borderRadius },
      shadows: { ...themeEditor.shadows },
      isCustom: true,
    }

    const updatedCustomThemes = [...customThemes, newTheme]
    setCustomThemes(updatedCustomThemes)
    localStorage.setItem(
      'ivolex-custom-themes',
      JSON.stringify(updatedCustomThemes)
    )

    setIsCreating(false)
    setThemeEditor({ ...themeEditor, name: '' })
    handleThemeChange(newTheme.id)
  }

  const exportTheme = theme => {
    const exportData = {
      ...theme,
      exportDate: new Date().toISOString(),
      version: '1.0',
    }

    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: 'application/json',
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `theme-${theme.name.toLowerCase().replace(/\s+/g, '-')}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const importTheme = event => {
    const file = event.target.files[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = e => {
      try {
        const importedTheme = JSON.parse(e.target.result)
        const newTheme = {
          ...importedTheme,
          id: `imported-${Date.now()}`,
          isCustom: true,
        }

        const updatedCustomThemes = [...customThemes, newTheme]
        setCustomThemes(updatedCustomThemes)
        localStorage.setItem(
          'ivolex-custom-themes',
          JSON.stringify(updatedCustomThemes)
        )
      } catch (error) {
        console.error('Failed to import theme:', error)
      }
    }
    reader.readAsText(file)
  }

  const copyThemeCode = theme => {
    const css = Object.entries(theme.colors)
      .map(([key, value]) => `  --color-${key}: ${value};`)
      .join('\n')

    const fullCSS = `:root {\n${css}\n}`
    navigator.clipboard.writeText(fullCSS)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Palette className="w-8 h-8 text-blue-600" />
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Theme Manager</h2>
            <p className="text-gray-600">
              Customize appearance and create custom themes
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
            <Upload className="w-4 h-4" />
            Import Theme
            <input
              type="file"
              accept=".json"
              onChange={importTheme}
              className="hidden"
            />
          </label>

          <button
            onClick={() => setIsCreating(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Palette className="w-4 h-4" />
            Create Theme
          </button>
        </div>
      </div>

      {/* Theme Selection */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Current Theme
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
          {builtInThemes.map(theme => {
            const Icon = theme.icon
            const isActive = currentTheme === theme.id

            return (
              <motion.button
                key={theme.id}
                onClick={() => handleThemeChange(theme.id)}
                className={`p-4 rounded-lg border-2 transition-all text-left ${
                  isActive
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300 bg-white'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center justify-between mb-3">
                  <Icon className="w-6 h-6 text-gray-600" />
                  {isActive && <Check className="w-5 h-5 text-blue-600" />}
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium text-gray-900">{theme.name}</h4>

                  <div className="flex gap-1">
                    {Object.entries(theme.colors)
                      .slice(0, 4)
                      .map(([key, color]) => (
                        <div
                          key={key}
                          className="w-4 h-4 rounded border border-gray-200"
                          style={{ backgroundColor: color }}
                        />
                      ))}
                  </div>
                </div>
              </motion.button>
            )
          })}
        </div>

        {/* Custom Themes */}
        {customThemes.length > 0 && (
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Custom Themes</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {customThemes.map(theme => {
                const isActive = currentTheme === theme.id

                return (
                  <div
                    key={theme.id}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      isActive
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <Palette className="w-6 h-6 text-gray-600" />
                      <div className="flex items-center gap-1">
                        {isActive && (
                          <Check className="w-4 h-4 text-blue-600" />
                        )}
                        <button
                          onClick={() => copyThemeCode(theme)}
                          className="p-1 hover:bg-gray-200 rounded transition-colors"
                          title="Copy CSS"
                        >
                          <Copy className="w-3 h-3 text-gray-500" />
                        </button>
                        <button
                          onClick={() => exportTheme(theme)}
                          className="p-1 hover:bg-gray-200 rounded transition-colors"
                          title="Export theme"
                        >
                          <Download className="w-3 h-3 text-gray-500" />
                        </button>
                      </div>
                    </div>

                    <button
                      onClick={() => handleThemeChange(theme.id)}
                      className="w-full text-left"
                    >
                      <h4 className="font-medium text-gray-900 mb-2">
                        {theme.name}
                      </h4>
                      <div className="flex gap-1">
                        {Object.entries(theme.colors)
                          .slice(0, 4)
                          .map(([key, color]) => (
                            <div
                              key={key}
                              className="w-4 h-4 rounded border border-gray-200"
                              style={{ backgroundColor: color }}
                            />
                          ))}
                      </div>
                    </button>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>

      {/* Theme Creator Modal */}
      <AnimatePresence>
        {isCreating && (
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
              className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900">
                  Create Custom Theme
                </h3>
                <button
                  onClick={() => setIsCreating(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  ✕
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Theme Editor */}
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Theme Name
                    </label>
                    <input
                      type="text"
                      value={themeEditor.name}
                      onChange={e =>
                        setThemeEditor(prev => ({
                          ...prev,
                          name: e.target.value,
                        }))
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="My Custom Theme"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Color Palette
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      {Object.entries(themeEditor.colors).map(
                        ([key, value]) => (
                          <div key={key} className="flex items-center gap-2">
                            <input
                              type="color"
                              value={value}
                              onChange={e =>
                                setThemeEditor(prev => ({
                                  ...prev,
                                  colors: {
                                    ...prev.colors,
                                    [key]: e.target.value,
                                  },
                                }))
                              }
                              className="w-8 h-8 rounded border border-gray-300"
                            />
                            <div className="flex-1">
                              <div className="text-sm font-medium text-gray-900 capitalize">
                                {key.replace(/([A-Z])/g, ' $1').trim()}
                              </div>
                              <div className="text-xs text-gray-500">
                                {value}
                              </div>
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Quick Presets
                    </label>
                    <div className="grid grid-cols-4 gap-2">
                      {colorPresets.map(preset => (
                        <button
                          key={preset.name}
                          onClick={() =>
                            setThemeEditor(prev => ({
                              ...prev,
                              colors: {
                                ...prev.colors,
                                primary: preset.primary,
                                secondary: preset.secondary,
                              },
                            }))
                          }
                          className="p-2 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors"
                        >
                          <div
                            className="w-full h-6 rounded mb-1"
                            style={{ backgroundColor: preset.primary }}
                          />
                          <div className="text-xs text-gray-600">
                            {preset.name}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Preview */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-gray-900">Preview</h4>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setSelectedDevice('desktop')}
                        className={`p-1.5 rounded ${selectedDevice === 'desktop' ? 'bg-blue-100 text-blue-600' : 'text-gray-500'}`}
                      >
                        <Monitor className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setSelectedDevice('tablet')}
                        className={`p-1.5 rounded ${selectedDevice === 'tablet' ? 'bg-blue-100 text-blue-600' : 'text-gray-500'}`}
                      >
                        <Tablet className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setSelectedDevice('mobile')}
                        className={`p-1.5 rounded ${selectedDevice === 'mobile' ? 'bg-blue-100 text-blue-600' : 'text-gray-500'}`}
                      >
                        <Smartphone className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="border border-gray-200 rounded-lg overflow-hidden">
                    <div
                      className="p-4 space-y-4"
                      style={{
                        backgroundColor: themeEditor.colors.background,
                        color: themeEditor.colors.text,
                        width:
                          selectedDevice === 'mobile'
                            ? '375px'
                            : selectedDevice === 'tablet'
                              ? '768px'
                              : '100%',
                      }}
                    >
                      {/* Preview Header */}
                      <div
                        className="p-3 rounded-lg flex items-center justify-between"
                        style={{ backgroundColor: themeEditor.colors.surface }}
                      >
                        <div className="flex items-center gap-2">
                          <div
                            className="w-6 h-6 rounded"
                            style={{
                              backgroundColor: themeEditor.colors.primary,
                            }}
                          />
                          <span className="font-medium">IVOLEX Admin</span>
                        </div>
                        <Settings
                          className="w-4 h-4"
                          style={{ color: themeEditor.colors.textSecondary }}
                        />
                      </div>

                      {/* Preview Cards */}
                      <div className="grid grid-cols-2 gap-3">
                        <div
                          className="p-3 rounded-lg"
                          style={{
                            backgroundColor: themeEditor.colors.surface,
                          }}
                        >
                          <div
                            className="text-sm"
                            style={{ color: themeEditor.colors.textSecondary }}
                          >
                            Revenue
                          </div>
                          <div className="text-xl font-bold">₹2.4M</div>
                          <div
                            className="text-sm"
                            style={{ color: themeEditor.colors.success }}
                          >
                            +15.2%
                          </div>
                        </div>

                        <div
                          className="p-3 rounded-lg"
                          style={{
                            backgroundColor: themeEditor.colors.surface,
                          }}
                        >
                          <div
                            className="text-sm"
                            style={{ color: themeEditor.colors.textSecondary }}
                          >
                            Orders
                          </div>
                          <div className="text-xl font-bold">1,834</div>
                          <div
                            className="text-sm"
                            style={{ color: themeEditor.colors.success }}
                          >
                            +8.7%
                          </div>
                        </div>
                      </div>

                      {/* Preview Button */}
                      <button
                        className="w-full p-2 rounded-lg text-white font-medium"
                        style={{ backgroundColor: themeEditor.colors.primary }}
                      >
                        Primary Action
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-200">
                <button
                  onClick={() => setIsCreating(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={createCustomTheme}
                  disabled={!themeEditor.name.trim()}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  Create Theme
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default ThemeManager
