import { motion } from 'framer-motion'
import { Search, Home, ArrowLeft, FileQuestion } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { SEO } from '../../../components/SEO'
import { useI18n } from '../../../ui/contexts/I18nContext'
import Container from '../../../ui/components/Container'

const NotFoundScreen = () => {
  const navigate = useNavigate()
  const { t, isRTL } = useI18n()

  const suggestions = [
    { label: t('nav.home', 'Home'), path: '/', icon: Home },
    { label: t('nav.products', 'Products'), path: '/shop', icon: Search },
    { label: t('nav.about', 'About'), path: '/about', icon: FileQuestion }
  ]

  return (
    <>
      <SEO 
        title={t('error.404.title', 'Page Not Found - 404')}
        description={t('error.404.description', 'The page you are looking for could not be found.')}
        noindex={true}
      />
      
      <section className="py-20">
        <Container>
          <div className="max-w-2xl mx-auto text-center">
            {/* 404 Animation */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, type: 'spring', stiffness: 200 }}
              className="mb-8"
            >
              <div className="text-8xl md:text-9xl font-bold text-brand-600 mb-4">
                404
              </div>
              <motion.div
                initial={{ rotate: 0 }}
                animate={{ rotate: [0, -5, 5, 0] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                className="w-24 h-24 mx-auto bg-brand-100 rounded-full flex items-center justify-center"
              >
                <FileQuestion size={40} className="text-brand-600" />
              </motion.div>
            </motion.div>

            {/* Error Message */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className={isRTL ? 'text-right' : 'text-left'}
            >
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                {t('error.404.heading', 'Oops! Page Not Found')}
              </h1>
              <p className="text-lg text-foreground/70 mb-8">
                {t('error.404.message', "The page you're looking for doesn't exist or has been moved. Let's get you back on track!")}
              </p>
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className={`flex flex-col sm:flex-row gap-4 justify-center mb-12 ${isRTL ? 'sm:flex-row-reverse' : ''}`}
            >
              <button
                onClick={() => navigate(-1)}
                className={`flex items-center gap-2 px-6 py-3 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition-colors ${isRTL ? 'flex-row-reverse' : ''}`}
              >
                <ArrowLeft size={18} />
                {t('common.back', 'Go Back')}
              </button>
              <Link
                to="/"
                className={`flex items-center gap-2 px-6 py-3 border-2 border-brand-600 text-brand-600 rounded-lg hover:bg-brand-50 transition-colors ${isRTL ? 'flex-row-reverse' : ''}`}
              >
                <Home size={18} />
                {t('nav.home', 'Home')}
              </Link>
            </motion.div>

            {/* Helpful Links */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-background/50 border border-border rounded-xl p-6"
            >
              <h3 className="text-lg font-semibold text-foreground mb-4">
                {t('error.404.suggestions', 'Try these popular pages:')}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {suggestions.map(({ label, path, icon: Icon }) => (
                  <motion.div key={path}>
                    <Link
                      to={path}
                      className={`flex items-center gap-3 p-4 bg-white border border-border rounded-lg hover:shadow-lg hover:border-brand-200 transition-all group ${isRTL ? 'flex-row-reverse text-right' : ''}`}
                    >
                      <div className="w-10 h-10 bg-brand-100 rounded-lg flex items-center justify-center group-hover:bg-brand-200 transition-colors">
                        <Icon size={20} className="text-brand-600" />
                      </div>
                      <span className="font-medium text-foreground group-hover:text-brand-600 transition-colors">
                        {label}
                      </span>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Search Suggestion */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="mt-8 text-sm text-foreground/60"
            >
              {t('error.404.searchHint', 'Looking for something specific? Try using our search feature in the navigation.')}
            </motion.div>
          </div>
        </Container>
      </section>
    </>
  )
}

export default NotFoundScreen