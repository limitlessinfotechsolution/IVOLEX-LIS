import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  Palette,
  Save,
  RotateCcw,
  Eye,
  Download,
  Upload,
  Type,
  Layout,
  Zap,
  Monitor,
  Smartphone,
  Tablet,
  Sun,
  Moon,
  Shuffle,
  Check,
  X,
} from 'lucide-react'
import { useI18n } from '../../../ui/contexts/I18nContext.jsx'
import { useSegment } from '../../../ui/contexts/SegmentContext.jsx'

// Color palette presets
const COLOR_PRESETS = {
  leather: {
    name: 'Leather Premium',
    primary: '#8B4513',
    secondary: '#D2691E',
    accent: '#CD853F',
    background: '#FDF5E6',
    surface: '#FFFFFF',
    foreground: '#2C1810',
  },
  electronics: {
    name: 'Tech Blue',
    primary: '#1E40AF',
    secondary: '#3B82F6',
    accent: '#06B6D4',
    background: '#F8FAFC',
    surface: '#FFFFFF',
    foreground: '#0F172A',
  },
  furniture: {
    name: 'Natural Wood',
    primary: '#92400E',
    secondary: '#D97706',
    accent: '#F59E0B',
    background: '#FFFBEB',
    surface: '#FFFFFF',
    foreground: '#1C1917',
  },
  modern: {
    name: 'Modern Dark',
    primary: '#6366F1',
    secondary: '#8B5CF6',
    accent: '#EC4899',
    background: '#0F172A',
    surface: '#1E293B',
    foreground: '#F1F5F9',
  },
  nature: {
    name: 'Nature Green',
    primary: '#059669',
    secondary: '#10B981',
    accent: '#34D399',
    background: '#F0FDF4',
    surface: '#FFFFFF',
    foreground: '#064E3B',
  },
}

// Typography presets
const TYPOGRAPHY_PRESETS = {
  modern: {
    name: 'Modern Sans',
    headings: 'Inter',
    body: 'Inter',
    accent: 'Poppins',
  },
  classic: {
    name: 'Classic Serif',
    headings: 'Playfair Display',
    body: 'Source Sans Pro',
    accent: 'Playfair Display',
  },
  minimal: {
    name: 'Minimal',
    headings: 'Roboto',
    body: 'Roboto',
    accent: 'Roboto Mono',
  },
  elegant: {
    name: 'Elegant',
    headings: 'Merriweather',
    body: 'Open Sans',
    accent: 'Dancing Script',
  },
}

// Spacing and layout presets
const LAYOUT_PRESETS = {
  compact: {
    name: 'Compact',
    containerPadding: '1rem',
    sectionSpacing: '2rem',
    cardPadding: '1rem',
    borderRadius: '0.5rem',
  },
  comfortable: {
    name: 'Comfortable',
    containerPadding: '1.5rem',
    sectionSpacing: '3rem',
    cardPadding: '1.5rem',
    borderRadius: '0.75rem',
  },
  spacious: {
    name: 'Spacious',
    containerPadding: '2rem',
    sectionSpacing: '4rem',
    cardPadding: '2rem',
    borderRadius: '1rem',
  },
}

export default function ThemeEditor() {
  const [selectedPreset, setSelectedPreset] = useState('leather')
  const [customColors, setCustomColors] = useState(COLOR_PRESETS.leather)
  const [selectedTypography, setSelectedTypography] = useState('modern')
  const [selectedLayout, setSelectedLayout] = useState('comfortable')
  const [previewMode, setPreviewMode] = useState('desktop') // desktop, tablet, mobile
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [showColorPicker, setShowColorPicker] = useState(null)

  const { t } = useI18n()
  const { currentSegment } = useSegment()

  useEffect(() => {
    setHasUnsavedChanges(true)
  }, [customColors, selectedTypography, selectedLayout, isDarkMode])

  const handleColorChange = (colorKey, value) => {
    setCustomColors(prev => ({
      ...prev,
      [colorKey]: value,
    }))
  }

  const handlePresetSelect = presetKey => {
    setSelectedPreset(presetKey)
    setCustomColors(COLOR_PRESETS[presetKey])
  }

  const handleSaveTheme = () => {
    // Save theme configuration
    const themeConfig = {
      colors: customColors,
      typography: TYPOGRAPHY_PRESETS[selectedTypography],
      layout: LAYOUT_PRESETS[selectedLayout],
      darkMode: isDarkMode,
      segment: currentSegment,
    }

    console.log('Saving theme configuration:', themeConfig)
    setHasUnsavedChanges(false)
    // Here you would typically save to backend/localStorage
  }

  const handleResetTheme = () => {
    setCustomColors(COLOR_PRESETS[selectedPreset])
    setSelectedTypography('modern')
    setSelectedLayout('comfortable')
    setIsDarkMode(false)
    setHasUnsavedChanges(false)
  }

  const handleGenerateTheme = async () => {
    setIsGenerating(true)

    // Simulate AI theme generation
    await new Promise(resolve => setTimeout(resolve, 2000))

    const randomPreset =
      Object.keys(COLOR_PRESETS)[
        Math.floor(Math.random() * Object.keys(COLOR_PRESETS).length)
      ]
    setCustomColors(COLOR_PRESETS[randomPreset])
    setSelectedPreset(randomPreset)

    setIsGenerating(false)
  }

  const ColorPicker = ({ label, colorKey, value }) => (
    <div className="space-y-2">
      <label className="text-sm font-medium text-foreground">{label}</label>
      <div className="relative">
        <button
          onClick={() =>
            setShowColorPicker(showColorPicker === colorKey ? null : colorKey)
          }
          className="w-full h-10 rounded-lg border border-border flex items-center gap-3 px-3 hover:border-primary transition-colors"
        >
          <div
            className="w-6 h-6 rounded border border-border"
            style={{ backgroundColor: value }}
          />
          <span className="font-mono text-sm text-foreground">{value}</span>
        </button>

        {showColorPicker === colorKey && (
          <div className="absolute top-full mt-2 z-50 bg-surface border border-border rounded-lg p-4 shadow-lg">
            <input
              type="color"
              value={value}
              onChange={e => handleColorChange(colorKey, e.target.value)}
              className="w-full h-32 border border-border rounded cursor-pointer"
            />
            <div className="mt-3 space-y-2">
              <input
                type="text"
                value={value}
                onChange={e => handleColorChange(colorKey, e.target.value)}
                className="w-full px-3 py-2 border border-border rounded text-sm font-mono"
                placeholder="#000000"
              />
              <div className="flex gap-2">
                <button
                  onClick={() => setShowColorPicker(null)}
                  className="flex-1 px-3 py-1.5 bg-primary text-white rounded text-sm hover:bg-primary/90 transition-colors"
                >
                  <Check size={14} className="inline mr-1" />
                  Done
                </button>
                <button
                  onClick={() => setShowColorPicker(null)}
                  className="px-3 py-1.5 border border-border rounded text-sm hover:bg-background transition-colors"
                >
                  <X size={14} />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )

  const PreviewComponent = () => (
    <div
      className="space-y-4 p-6"
      style={{
        backgroundColor: customColors.background,
        color: customColors.foreground,
      }}
    >
      {/* Header Preview */}
      <div
        className="flex items-center justify-between p-4 rounded-lg"
        style={{ backgroundColor: customColors.surface }}
      >
        <h1
          className="text-xl font-bold"
          style={{ color: customColors.primary }}
        >
          IVOLEX
        </h1>
        <div className="flex gap-2">
          <button
            className="px-4 py-2 rounded text-sm"
            style={{
              backgroundColor: customColors.primary,
              color: customColors.background,
            }}
          >
            Primary
          </button>
          <button
            className="px-4 py-2 rounded text-sm border"
            style={{
              borderColor: customColors.secondary,
              color: customColors.secondary,
            }}
          >
            Secondary
          </button>
        </div>
      </div>

      {/* Content Preview */}
      <div
        className="p-4 rounded-lg"
        style={{ backgroundColor: customColors.surface }}
      >
        <h2
          className="text-lg font-semibold mb-2"
          style={{ color: customColors.foreground }}
        >
          Sample Content
        </h2>
        <p
          className="text-sm mb-4"
          style={{ color: customColors.foreground + '99' }}
        >
          This is how your content will look with the selected theme colors and
          typography.
        </p>
        <div
          className="inline-block px-3 py-1 rounded-full text-xs font-medium"
          style={{
            backgroundColor: customColors.accent + '20',
            color: customColors.accent,
          }}
        >
          Accent Badge
        </div>
      </div>

      {/* Cards Preview */}
      <div className="grid grid-cols-2 gap-4">
        <div
          className="p-4 rounded-lg border"
          style={{
            backgroundColor: customColors.surface,
            borderColor: customColors.primary + '20',
          }}
        >
          <div
            className="w-full h-20 rounded mb-3"
            style={{ backgroundColor: customColors.primary + '10' }}
          ></div>
          <h3
            className="font-medium"
            style={{ color: customColors.foreground }}
          >
            Product Card
          </h3>
          <p className="text-sm mt-1" style={{ color: customColors.accent }}>
            $99.99
          </p>
        </div>
        <div
          className="p-4 rounded-lg border"
          style={{
            backgroundColor: customColors.surface,
            borderColor: customColors.secondary + '20',
          }}
        >
          <div
            className="w-full h-20 rounded mb-3"
            style={{ backgroundColor: customColors.secondary + '10' }}
          ></div>
          <h3
            className="font-medium"
            style={{ color: customColors.foreground }}
          >
            Another Card
          </h3>
          <p className="text-sm mt-1" style={{ color: customColors.accent }}>
            $149.99
          </p>
        </div>
      </div>
    </div>
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            {t('admin.themeEditor', 'Theme Editor')}
          </h1>
          <p className="text-foreground/60">
            {t(
              'admin.themeEditorSubtitle',
              'Customize the visual appearance of your store'
            )}
          </p>
        </div>

        <div className="flex items-center gap-3">
          {hasUnsavedChanges && (
            <span className="text-xs text-yellow-600 bg-yellow-100 px-2 py-1 rounded-full">
              {t('admin.unsavedChanges', 'Unsaved changes')}
            </span>
          )}

          <motion.button
            onClick={() => setShowPreview(!showPreview)}
            className="flex items-center gap-2 px-4 py-2 border border-border rounded-xl hover:bg-background transition-colors"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Eye size={16} />
            {t('admin.preview', 'Preview')}
          </motion.button>

          <motion.button
            onClick={handleSaveTheme}
            disabled={!hasUnsavedChanges}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl hover:bg-primary/90 transition-colors disabled:opacity-50"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Save size={16} />
            {t('common.save', 'Save')}
          </motion.button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Theme Controls */}
        <div className="lg:col-span-1 space-y-6">
          {/* Color Presets */}
          <div className="bg-surface border border-border rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-foreground flex items-center gap-2">
                <Palette size={20} />
                {t('admin.colorPresets', 'Color Presets')}
              </h3>
              <button
                onClick={handleGenerateTheme}
                disabled={isGenerating}
                className="p-2 hover:bg-background rounded-lg transition-colors disabled:opacity-50"
                title={t('admin.generateTheme', 'Generate AI Theme')}
              >
                {isGenerating ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                ) : (
                  <Shuffle size={16} />
                )}
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-4">
              {Object.entries(COLOR_PRESETS).map(([key, preset]) => (
                <button
                  key={key}
                  onClick={() => handlePresetSelect(key)}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    selectedPreset === key
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <div className="flex gap-1 mb-2">
                    <div
                      className="w-4 h-4 rounded"
                      style={{ backgroundColor: preset.primary }}
                    ></div>
                    <div
                      className="w-4 h-4 rounded"
                      style={{ backgroundColor: preset.secondary }}
                    ></div>
                    <div
                      className="w-4 h-4 rounded"
                      style={{ backgroundColor: preset.accent }}
                    ></div>
                  </div>
                  <div className="text-xs font-medium text-foreground">
                    {preset.name}
                  </div>
                </button>
              ))}
            </div>

            {/* Custom Colors */}
            <div className="space-y-4">
              <h4 className="font-medium text-foreground">
                {t('admin.customColors', 'Custom Colors')}
              </h4>
              <ColorPicker
                label={t('admin.primaryColor', 'Primary')}
                colorKey="primary"
                value={customColors.primary}
              />
              <ColorPicker
                label={t('admin.secondaryColor', 'Secondary')}
                colorKey="secondary"
                value={customColors.secondary}
              />
              <ColorPicker
                label={t('admin.accentColor', 'Accent')}
                colorKey="accent"
                value={customColors.accent}
              />
              <ColorPicker
                label={t('admin.backgroundColor', 'Background')}
                colorKey="background"
                value={customColors.background}
              />
              <ColorPicker
                label={t('admin.surfaceColor', 'Surface')}
                colorKey="surface"
                value={customColors.surface}
              />
              <ColorPicker
                label={t('admin.textColor', 'Text')}
                colorKey="foreground"
                value={customColors.foreground}
              />
            </div>
          </div>

          {/* Typography */}
          <div className="bg-surface border border-border rounded-xl p-6">
            <h3 className="font-semibold text-foreground flex items-center gap-2 mb-4">
              <Type size={20} />
              {t('admin.typography', 'Typography')}
            </h3>

            <div className="space-y-3">
              {Object.entries(TYPOGRAPHY_PRESETS).map(([key, preset]) => (
                <button
                  key={key}
                  onClick={() => setSelectedTypography(key)}
                  className={`w-full p-3 rounded-lg border text-left transition-all ${
                    selectedTypography === key
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <div className="font-medium text-foreground">
                    {preset.name}
                  </div>
                  <div className="text-xs text-foreground/60 mt-1">
                    {preset.headings} / {preset.body}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Layout */}
          <div className="bg-surface border border-border rounded-xl p-6">
            <h3 className="font-semibold text-foreground flex items-center gap-2 mb-4">
              <Layout size={20} />
              {t('admin.layout', 'Layout')}
            </h3>

            <div className="space-y-3">
              {Object.entries(LAYOUT_PRESETS).map(([key, preset]) => (
                <button
                  key={key}
                  onClick={() => setSelectedLayout(key)}
                  className={`w-full p-3 rounded-lg border text-left transition-all ${
                    selectedLayout === key
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <div className="font-medium text-foreground">
                    {preset.name}
                  </div>
                  <div className="text-xs text-foreground/60 mt-1">
                    Spacing: {preset.sectionSpacing} | Radius:{' '}
                    {preset.borderRadius}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="bg-surface border border-border rounded-xl p-6">
            <h3 className="font-semibold text-foreground flex items-center gap-2 mb-4">
              <Zap size={20} />
              {t('admin.actions', 'Actions')}
            </h3>

            <div className="space-y-3">
              <button
                onClick={handleResetTheme}
                className="w-full flex items-center gap-2 px-4 py-2 border border-border rounded-lg hover:bg-background transition-colors"
              >
                <RotateCcw size={16} />
                {t('admin.resetTheme', 'Reset to Default')}
              </button>

              <button className="w-full flex items-center gap-2 px-4 py-2 border border-border rounded-lg hover:bg-background transition-colors">
                <Download size={16} />
                {t('admin.exportTheme', 'Export Theme')}
              </button>

              <button className="w-full flex items-center gap-2 px-4 py-2 border border-border rounded-lg hover:bg-background transition-colors">
                <Upload size={16} />
                {t('admin.importTheme', 'Import Theme')}
              </button>
            </div>
          </div>
        </div>

        {/* Preview Panel */}
        <div className="lg:col-span-2">
          <div className="bg-surface border border-border rounded-xl overflow-hidden">
            {/* Preview Controls */}
            <div className="border-b border-border p-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-foreground">
                  {t('admin.livePreview', 'Live Preview')}
                </h3>

                <div className="flex items-center gap-2">
                  {/* Device Preview Toggle */}
                  <div className="flex bg-background border border-border rounded-lg overflow-hidden">
                    <button
                      onClick={() => setPreviewMode('desktop')}
                      className={`p-2 transition-colors ${
                        previewMode === 'desktop'
                          ? 'bg-primary text-white'
                          : 'text-foreground/60 hover:text-foreground'
                      }`}
                    >
                      <Monitor size={16} />
                    </button>
                    <button
                      onClick={() => setPreviewMode('tablet')}
                      className={`p-2 transition-colors ${
                        previewMode === 'tablet'
                          ? 'bg-primary text-white'
                          : 'text-foreground/60 hover:text-foreground'
                      }`}
                    >
                      <Tablet size={16} />
                    </button>
                    <button
                      onClick={() => setPreviewMode('mobile')}
                      className={`p-2 transition-colors ${
                        previewMode === 'mobile'
                          ? 'bg-primary text-white'
                          : 'text-foreground/60 hover:text-foreground'
                      }`}
                    >
                      <Smartphone size={16} />
                    </button>
                  </div>

                  {/* Dark Mode Toggle */}
                  <button
                    onClick={() => setIsDarkMode(!isDarkMode)}
                    className="p-2 border border-border rounded-lg hover:bg-background transition-colors"
                  >
                    {isDarkMode ? <Sun size={16} /> : <Moon size={16} />}
                  </button>
                </div>
              </div>
            </div>

            {/* Preview Content */}
            <div
              className={`${
                previewMode === 'desktop'
                  ? 'w-full'
                  : previewMode === 'tablet'
                    ? 'w-[768px] mx-auto'
                    : 'w-[375px] mx-auto'
              } transition-all duration-300`}
            >
              <PreviewComponent />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
