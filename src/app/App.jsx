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
} from '../components/SecurityProvider.jsx'
import { SecurityValidator } from '../components/SecurityComponents.jsx'
import { RecommendationProvider } from '../contexts/RecommendationContext.jsx'
import { SearchProvider } from '../contexts/SearchContext.jsx'
import SkipToContent from '../components/common/SkipToContent.jsx'
import ErrorBoundary from '../components/common/ErrorBoundary.jsx'
import ToastProvider from '../components/common/ToastProvider'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Suspense, lazy } from 'react'
import { usePerformance } from '../hooks/usePerformance'
import { SEOProvider } from '../components/SEO'
import MinimalLayout from '../layouts/MinimalLayout.jsx'

// Lazy load route components for better performance
const Home = lazy(() => import('../pages/screens/Home'))
const CategoryScreen = lazy(() => import('../pages/screens/Category/CategoryScreen'))
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
                                      v7_partialHydration: true,
                                    }}
                                  >
                                    <SearchProvider>
                                      <SecurityValidator>
                                        <Routes>
                                          {/* Minimal layout for auth pages - no header/footer */}
                                          <Route element={<MinimalLayout />}>
                                            <Route path="/login" element={<Login />} />
                                            <Route path="/register" element={<Register />} />
                                            <Route path="/auth" element={<AuthScreen />} />
                                            <Route path="/admin/login" element={<AdminLogin />} />
                                          </Route>
                                          
                                          {/* Full layout with header and footer */}
                                          <Route
                                            path="/"
                                            element={
                                              <div className="min-h-screen w-full h-full transition-all duration-500 flex flex-col">
                                                <SkipToContent />
                                                <FloatingNavbar />
                                                <main
                                                  id="main"
                                                  className="w-full flex-grow min-w-0 pt-0 pb-0"
                                                >
                                                  <ErrorBoundary>
                                                    <Suspense
                                                      fallback={<LoadingSpinner />}
                                                    >
                                                      <Home />
                                                    </Suspense>
                                                  </ErrorBoundary>
                                                </main>
                                                <Footer />
                                                <ToastProvider />
                                              </div>
                                            }
                                          />
                                          <Route
                                            path="/leather"
                                            element={
                                              <div className="min-h-screen w-full h-full transition-all duration-500 flex flex-col">
                                                <SkipToContent />
                                                <FloatingNavbar />
                                                <main
                                                  id="main"
                                                  className="w-full flex-grow min-w-0 pt-0 pb-0"
                                                >
                                                  <ErrorBoundary>
                                                    <Suspense
                                                      fallback={<LoadingSpinner />}
                                                    >
                                                      <Home />
                                                    </Suspense>
                                                  </ErrorBoundary>
                                                </main>
                                                <Footer />
                                                <ToastProvider />
                                              </div>
                                            }
                                          />
                                          <Route
                                            path="/electronics"
                                            element={
                                              <div className="min-h-screen w-full h-full transition-all duration-500 flex flex-col">
                                                <SkipToContent />
                                                <FloatingNavbar />
                                                <main
                                                  id="main"
                                                  className="w-full flex-grow min-w-0 pt-0 pb-0"
                                                >
                                                  <ErrorBoundary>
                                                    <Suspense
                                                      fallback={<LoadingSpinner />}
                                                    >
                                                      <Home />
                                                    </Suspense>
                                                  </ErrorBoundary>
                                                </main>
                                                <Footer />
                                                <ToastProvider />
                                              </div>
                                            }
                                          />
                                          <Route
                                            path="/furniture"
                                            element={
                                              <div className="min-h-screen w-full h-full transition-all duration-500 flex flex-col">
                                                <SkipToContent />
                                                <FloatingNavbar />
                                                <main
                                                  id="main"
                                                  className="w-full flex-grow min-w-0 pt-0 pb-0"
                                                >
                                                  <ErrorBoundary>
                                                    <Suspense
                                                      fallback={<LoadingSpinner />}
                                                    >
                                                      <Home />
                                                    </Suspense>
                                                  </ErrorBoundary>
                                                </main>
                                                <Footer />
                                                <ToastProvider />
                                              </div>
                                            }
                                          />
                                          <Route
                                            path="/shop"
                                            element={
                                              <div className="min-h-screen w-full h-full transition-all duration-500 flex flex-col">
                                                <SkipToContent />
                                                <FloatingNavbar />
                                                <main
                                                  id="main"
                                                  className="w-full flex-grow min-w-0 pt-0 pb-0"
                                                >
                                                  <ErrorBoundary>
                                                    <Suspense
                                                      fallback={<LoadingSpinner />}
                                                    >
                                                      <Shop />
                                                    </Suspense>
                                                  </ErrorBoundary>
                                                </main>
                                                <Footer />
                                                <ToastProvider />
                                              </div>
                                            }
                                          />
                                          <Route
                                            path="/categories"
                                            element={
                                              <div className="min-h-screen w-full h-full transition-all duration-500 flex flex-col">
                                                <SkipToContent />
                                                <FloatingNavbar />
                                                <main
                                                  id="main"
                                                  className="w-full flex-grow min-w-0 pt-0 pb-0"
                                                >
                                                  <ErrorBoundary>
                                                    <Suspense
                                                      fallback={<LoadingSpinner />}
                                                    >
                                                      <CategoryScreen />
                                                    </Suspense>
                                                  </ErrorBoundary>
                                                </main>
                                                <Footer />
                                                <ToastProvider />
                                              </div>
                                            }
                                          />
                                          <Route
                                            path="/category/:segment"
                                            element={
                                              <div className="min-h-screen w-full h-full transition-all duration-500 flex flex-col">
                                                <SkipToContent />
                                                <FloatingNavbar />
                                                <main
                                                  id="main"
                                                  className="w-full flex-grow min-w-0 pt-0 pb-0"
                                                >
                                                  <ErrorBoundary>
                                                    <Suspense
                                                      fallback={<LoadingSpinner />}
                                                    >
                                                      <CategoryScreen />
                                                    </Suspense>
                                                  </ErrorBoundary>
                                                </main>
                                                <Footer />
                                                <ToastProvider />
                                              </div>
                                            }
                                          />
                                          <Route
                                            path="/product/:id"
                                            element={
                                              <div className="min-h-screen w-full h-full transition-all duration-500 flex flex-col">
                                                <SkipToContent />
                                                <FloatingNavbar />
                                                <main
                                                  id="main"
                                                  className="w-full flex-grow min-w-0 pt-0 pb-0"
                                                >
                                                  <ErrorBoundary>
                                                    <Suspense
                                                      fallback={<LoadingSpinner />}
                                                    >
                                                      <Product />
                                                    </Suspense>
                                                  </ErrorBoundary>
                                                </main>
                                                <Footer />
                                                <ToastProvider />
                                              </div>
                                            }
                                          />
                                          <Route
                                            path="/cart"
                                            element={
                                              <div className="min-h-screen w-full h-full transition-all duration-500 flex flex-col">
                                                <SkipToContent />
                                                <FloatingNavbar />
                                                <main
                                                  id="main"
                                                  className="w-full flex-grow min-w-0 pt-0 pb-0"
                                                >
                                                  <ErrorBoundary>
                                                    <Suspense
                                                      fallback={<LoadingSpinner />}
                                                    >
                                                      <Cart />
                                                    </Suspense>
                                                  </ErrorBoundary>
                                                </main>
                                                <Footer />
                                                <ToastProvider />
                                              </div>
                                            }
                                          />
                                          <Route
                                            path="/checkout"
                                            element={
                                              <div className="min-h-screen w-full h-full transition-all duration-500 flex flex-col">
                                                <SkipToContent />
                                                <FloatingNavbar />
                                                <main
                                                  id="main"
                                                  className="w-full flex-grow min-w-0 pt-0 pb-0"
                                                >
                                                  <ErrorBoundary>
                                                    <Suspense
                                                      fallback={<LoadingSpinner />}
                                                    >
                                                      <Checkout />
                                                    </Suspense>
                                                  </ErrorBoundary>
                                                </main>
                                                <Footer />
                                                <ToastProvider />
                                              </div>
                                            }
                                          />
                                          <Route
                                            path="/customize"
                                            element={
                                              <div className="min-h-screen w-full h-full transition-all duration-500 flex flex-col">
                                                <SkipToContent />
                                                <FloatingNavbar />
                                                <main
                                                  id="main"
                                                  className="w-full flex-grow min-w-0 pt-0 pb-0"
                                                >
                                                  <ErrorBoundary>
                                                    <Suspense
                                                      fallback={<LoadingSpinner />}
                                                    >
                                                      <Customize />
                                                    </Suspense>
                                                  </ErrorBoundary>
                                                </main>
                                                <Footer />
                                                <ToastProvider />
                                              </div>
                                            }
                                          />
                                          <Route
                                            path="/about"
                                            element={
                                              <div className="min-h-screen w-full h-full transition-all duration-500 flex flex-col">
                                                <SkipToContent />
                                                <FloatingNavbar />
                                                <main
                                                  id="main"
                                                  className="w-full flex-grow min-w-0 pt-0 pb-0"
                                                >
                                                  <ErrorBoundary>
                                                    <Suspense
                                                      fallback={<LoadingSpinner />}
                                                    >
                                                      <About />
                                                    </Suspense>
                                                  </ErrorBoundary>
                                                </main>
                                                <Footer />
                                                <ToastProvider />
                                              </div>
                                            }
                                          />
                                          <Route
                                            path="/contact"
                                            element={
                                              <div className="min-h-screen w-full h-full transition-all duration-500 flex flex-col">
                                                <SkipToContent />
                                                <FloatingNavbar />
                                                <main
                                                  id="main"
                                                  className="w-full flex-grow min-w-0 pt-0 pb-0"
                                                >
                                                  <ErrorBoundary>
                                                    <Suspense
                                                      fallback={<LoadingSpinner />}
                                                    >
                                                      <Contact />
                                                    </Suspense>
                                                  </ErrorBoundary>
                                                </main>
                                                <Footer />
                                                <ToastProvider />
                                              </div>
                                            }
                                          />
                                          <Route
                                            path="/profile"
                                            element={
                                              <div className="min-h-screen w-full h-full transition-all duration-500 flex flex-col">
                                                <SkipToContent />
                                                <FloatingNavbar />
                                                <main
                                                  id="main"
                                                  className="w-full flex-grow min-w-0 pt-0 pb-0"
                                                >
                                                  <ErrorBoundary>
                                                    <Suspense
                                                      fallback={<LoadingSpinner />}
                                                    >
                                                      <Profile />
                                                    </Suspense>
                                                  </ErrorBoundary>
                                                </main>
                                                <Footer />
                                                <ToastProvider />
                                              </div>
                                            }
                                          />
                                          <Route
                                            path="/account/*"
                                            element={
                                              <div className="min-h-screen w-full h-full transition-all duration-500 flex flex-col">
                                                <SkipToContent />
                                                <FloatingNavbar />
                                                <main
                                                  id="main"
                                                  className="w-full flex-grow min-w-0 pt-0 pb-0"
                                                >
                                                  <ErrorBoundary>
                                                    <Suspense
                                                      fallback={<LoadingSpinner />}
                                                    >
                                                      <MyAccount />
                                                    </Suspense>
                                                  </ErrorBoundary>
                                                </main>
                                                <Footer />
                                                <ToastProvider />
                                              </div>
                                            }
                                          />
                                          <Route
                                            path="/track/:requestId"
                                            element={
                                              <div className="min-h-screen w-full h-full transition-all duration-500 flex flex-col">
                                                <SkipToContent />
                                                <FloatingNavbar />
                                                <main
                                                  id="main"
                                                  className="w-full flex-grow min-w-0 pt-0 pb-0"
                                                >
                                                  <ErrorBoundary>
                                                    <Suspense
                                                      fallback={<LoadingSpinner />}
                                                    >
                                                      <RequestTracking />
                                                    </Suspense>
                                                  </ErrorBoundary>
                                                </main>
                                                <Footer />
                                                <ToastProvider />
                                              </div>
                                            }
                                          />
                                          <Route
                                            path="/track-shipment"
                                            element={
                                              <div className="min-h-screen w-full h-full transition-all duration-500 flex flex-col">
                                                <SkipToContent />
                                                <FloatingNavbar />
                                                <main
                                                  id="main"
                                                  className="w-full flex-grow min-w-0 pt-0 pb-0"
                                                >
                                                  <ErrorBoundary>
                                                    <Suspense
                                                      fallback={<LoadingSpinner />}
                                                    >
                                                      <TrackingPage />
                                                    </Suspense>
                                                  </ErrorBoundary>
                                                </main>
                                                <Footer />
                                                <ToastProvider />
                                              </div>
                                            }
                                          />
                                          <Route
                                            path="/order-confirmation"
                                            element={
                                              <div className="min-h-screen w-full h-full transition-all duration-500 flex flex-col">
                                                <SkipToContent />
                                                <FloatingNavbar />
                                                <main
                                                  id="main"
                                                  className="w-full flex-grow min-w-0 pt-0 pb-0"
                                                >
                                                  <ErrorBoundary>
                                                    <Suspense
                                                      fallback={<LoadingSpinner />}
                                                    >
                                                      <OrderConfirmation />
                                                    </Suspense>
                                                  </ErrorBoundary>
                                                </main>
                                                <Footer />
                                                <ToastProvider />
                                              </div>
                                            }
                                          />
                                          <Route
                                            path="/admin/*"
                                            element={
                                              <div className="min-h-screen w-full h-full transition-all duration-500 flex flex-col">
                                                <SkipToContent />
                                                <FloatingNavbar />
                                                <main
                                                  id="main"
                                                  className="w-full flex-grow min-w-0 pt-0 pb-0"
                                                >
                                                  <ErrorBoundary>
                                                    <Suspense
                                                      fallback={<LoadingSpinner />}
                                                    >
                                                      <AdminPanel />
                                                    </Suspense>
                                                  </ErrorBoundary>
                                                </main>
                                                <Footer />
                                                <ToastProvider />
                                              </div>
                                            }
                                          />
                                          {/* 404 Catch-all route - must be last */}
                                          <Route
                                            path="*"
                                            element={
                                              <div className="min-h-screen w-full h-full transition-all duration-500 flex flex-col">
                                                <SkipToContent />
                                                <FloatingNavbar />
                                                <main
                                                  id="main"
                                                  className="w-full flex-grow min-w-0 pt-0 pb-0"
                                                >
                                                  <ErrorBoundary>
                                                    <Suspense
                                                      fallback={<LoadingSpinner />}
                                                    >
                                                      <NotFound />
                                                    </Suspense>
                                                  </ErrorBoundary>
                                                </main>
                                                <Footer />
                                                <ToastProvider />
                                              </div>
                                            }
                                          />
                                        </Routes>
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