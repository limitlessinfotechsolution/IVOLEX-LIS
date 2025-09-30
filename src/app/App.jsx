import FloatingNavbar from '../components/navigation/FloatingNavbar.jsx'
import Footer from '../components/layout/Footer.jsx'
import { LocationProvider } from '../contexts/LocationContext.jsx'
import { CartProvider } from '../contexts/CartContext.jsx'
import { AuthProvider } from '../contexts/AuthContext.jsx'
import { OrderProvider } from '../contexts/OrderContext.jsx'
import { NotificationProvider } from '../contexts/NotificationContext.jsx'
import { AuditProvider } from '../contexts/AuditContext.jsx'
import { InventoryProvider } from '../contexts/InventoryContext.jsx'
import ShippingProvider from '../contexts/ShippingContext.jsx'
import { SegmentProvider } from '../contexts/SegmentContext.jsx'
import { ThemeProvider } from '../contexts/ThemeContext.jsx'
import { I18nProvider } from '../contexts/I18nContext.jsx'
import {
  SecurityProvider,
  RateLimitProvider,
  SecurityValidator,
} from '../components/SecurityProvider.jsx'
import { RecommendationProvider } from '../contexts/RecommendationContext.jsx'
import { SearchProvider } from '../contexts/SearchContext.jsx'
import SkipToContent from '../components/common/SkipToContent.jsx'
import ErrorBoundary from '../components/common/ErrorBoundary.jsx'
import ToastProvider from '../components/common/ToastProvider'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Suspense, lazy } from 'react'
import { usePerformance } from '../hooks/usePerformance'
import { SEOProvider } from '../components/SEO'

// Lazy load route components for better performance
const Home = lazy(() => import('../pages/screens/Home'))
const Category = lazy(() => import('../pages/screens/Category'))
const Shop = lazy(() => import('../pages/screens/Shop'))
const Product = lazy(() => import('../pages/screens/Product'))
const Cart = lazy(() => import('../pages/screens/Cart'))
const Checkout = lazy(() => import('../pages/screens/Checkout'))
const Customize = lazy(() => import('../pages/screens/Customize'))
const About = lazy(() => import('../pages/screens/About'))
const Contact = lazy(() => import('../pages/screens/Contact'))
const Login = lazy(() => import('../pages/screens/Login'))
const Register = lazy(() => import('../pages/screens/Register'))
const Profile = lazy(() => import('../pages/screens/Profile'))
const OrderConfirmation = lazy(
  () => import('../pages/screens/OrderConfirmation')
)
const MyAccount = lazy(() => import('../pages/screens/Account'))
const RequestTracking = lazy(() => import('../pages/screens/Tracking'))
const TrackingPage = lazy(() => import('../pages/screens/TrackingPage'))
const AdminPanel = lazy(() => import('../pages/screens/Admin/AdminPanel'))
const AdminLogin = lazy(() => import('../pages/screens/Admin/AdminLogin'))
const AuthScreen = lazy(() => import('../pages/screens/Auth/AuthScreen'))
const NotFound = lazy(() => import('../pages/screens/NotFound'))

// Loading component
function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-600"></div>
      <span className="ml-3 text-stone-600 dark:text-stone-400">
        Loading...
      </span>
    </div>
  )
}

export default function App() {
  // Monitor performance in development
  usePerformance()

  return (
    <SecurityProvider>
      <RateLimitProvider>
        <I18nProvider>
          <RecommendationProvider>
            <SegmentProvider>
              <ThemeProvider>
                <SEOProvider>
                  <LocationProvider>
                    <AuthProvider>
                      <NotificationProvider>
                        <AuditProvider>
                          <InventoryProvider>
                            <ShippingProvider>
                              <OrderProvider>
                                <CartProvider>
                                  <BrowserRouter
                                    future={{
                                      v7_startTransition: true,
                                      v7_relativeSplatPath: true,
                                    }}
                                  >
                                    <SearchProvider>
                                      <SecurityValidator>
                                        <div className="min-h-screen w-full h-full transition-all duration-500 flex flex-col">
                                          <SkipToContent />
                                          <FloatingNavbar />
                                          <main
                                            id="main"
                                            className="pt-14 w-full h-full flex-grow"
                                          >
                                            <ErrorBoundary>
                                              <Suspense
                                                fallback={<LoadingSpinner />}
                                              >
                                                <Routes>
                                                  <Route
                                                    path="/"
                                                    element={<Home />}
                                                  />
                                                  <Route
                                                    path="/leather"
                                                    element={<Home />}
                                                  />
                                                  <Route
                                                    path="/electronics"
                                                    element={<Home />}
                                                  />
                                                  <Route
                                                    path="/furniture"
                                                    element={<Home />}
                                                  />
                                                  <Route
                                                    path="/shop"
                                                    element={<Shop />}
                                                  />
                                                  <Route
                                                    path="/category/:category"
                                                    element={<Category />}
                                                  />
                                                  <Route
                                                    path="/product/:id"
                                                    element={<Product />}
                                                  />
                                                  <Route
                                                    path="/cart"
                                                    element={<Cart />}
                                                  />
                                                  <Route
                                                    path="/checkout"
                                                    element={<Checkout />}
                                                  />
                                                  <Route
                                                    path="/customize"
                                                    element={<Customize />}
                                                  />
                                                  <Route
                                                    path="/about"
                                                    element={<About />}
                                                  />
                                                  <Route
                                                    path="/contact"
                                                    element={<Contact />}
                                                  />
                                                  <Route
                                                    path="/login"
                                                    element={<Login />}
                                                  />
                                                  <Route
                                                    path="/register"
                                                    element={<Register />}
                                                  />
                                                  <Route
                                                    path="/auth"
                                                    element={<AuthScreen />}
                                                  />
                                                  <Route
                                                    path="/profile"
                                                    element={<Profile />}
                                                  />
                                                  <Route
                                                    path="/account/*"
                                                    element={<MyAccount />}
                                                  />
                                                  <Route
                                                    path="/track/:requestId"
                                                    element={
                                                      <RequestTracking />
                                                    }
                                                  />
                                                  <Route
                                                    path="/track-shipment"
                                                    element={<TrackingPage />}
                                                  />
                                                  <Route
                                                    path="/order-confirmation"
                                                    element={
                                                      <OrderConfirmation />
                                                    }
                                                  />
                                                  <Route
                                                    path="/admin/login"
                                                    element={<AdminLogin />}
                                                  />
                                                  <Route
                                                    path="/admin/*"
                                                    element={<AdminPanel />}
                                                  />
                                                  {/* 404 Catch-all route - must be last */}
                                                  <Route
                                                    path="*"
                                                    element={<NotFound />}
                                                  />
                                                </Routes>
                                              </Suspense>
                                            </ErrorBoundary>
                                          </main>
                                          <Footer />
                                          <ToastProvider />
                                        </div>
                                      </SecurityValidator>
                                    </SearchProvider>
                                  </BrowserRouter>
                                </CartProvider>
                              </OrderProvider>
                            </ShippingProvider>
                          </InventoryProvider>
                        </AuditProvider>
                      </NotificationProvider>
                    </AuthProvider>
                  </LocationProvider>
                </SEOProvider>
              </ThemeProvider>
            </SegmentProvider>
          </RecommendationProvider>
        </I18nProvider>
      </RateLimitProvider>
    </SecurityProvider>
  )
}
