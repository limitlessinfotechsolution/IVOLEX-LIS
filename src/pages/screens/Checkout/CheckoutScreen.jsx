import { useState } from 'react'
import Container from '../../../components/common/Container.jsx'
import { useCart } from '../../../contexts/CartContext.jsx'
import { useOrder } from '../../../contexts/OrderContext.jsx'
import { useI18n } from '../../../contexts/I18nContext.jsx'
import { Link, useNavigate } from 'react-router-dom'
import { SEO } from '../../../components/SEO'
import { CreditCard, Lock, Truck, CheckCircle } from 'lucide-react'
import toast from 'react-hot-toast'

export default function CheckoutScreen() {
  const { items, total, clear } = useCart()
  useOrder()
  const { formatCurrency } = useI18n()
  const navigate = useNavigate()
  const hasItems = items.length > 0
  const [isProcessing, setIsProcessing] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    country: '',
    postalCode: '',
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvc: '',
  })

  const subtotal = total
  const shipping = total >= 500 ? 0 : 50 // Free shipping over ₹500, otherwise ₹50
  const tax = total * 0.18 // 18% GST for India
  const finalTotal = subtotal + shipping + tax

  const handleInputChange = e => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }))
  }

  const handlePlaceOrder = async e => {
    e.preventDefault()
    setIsProcessing(true)

    // Simulate payment processing
    try {
      await new Promise(resolve => setTimeout(resolve, 2000))

      // Create order data
      const orderData = {
        orderNumber: 'ORD-' + Date.now(),
        items: items.map(({ item, qty }) => ({
          id: item.id,
          name: item.name || item.title,
          price: item.price,
          qty: qty,
          image: item.image || item.img,
        })),
        customer: {
          email: formData.email,
          firstName: formData.firstName,
          lastName: formData.lastName,
        },
        shipping: {
          address: formData.address,
          city: formData.city,
          country: formData.country,
          postalCode: formData.postalCode,
        },
        payment: {
          method: formData.paymentMethod,
          cardNumber:
            formData.paymentMethod === 'card'
              ? formData.cardNumber.slice(-4)
              : null,
          cardName:
            formData.paymentMethod === 'card' ? formData.cardName : null,
          upiId: formData.paymentMethod === 'upi' ? formData.upiId : null,
          bankAccount:
            formData.paymentMethod === 'bank'
              ? formData.bankAccount.slice(-4)
              : null,
          ifscCode:
            formData.paymentMethod === 'bank' ? formData.ifscCode : null,
        },
        totals: {
          subtotal: subtotal,
          shipping: shipping,
          tax: tax,
          total: finalTotal,
        },
      }

      // Clear cart and redirect
      clear()
      toast.success('Order placed successfully!')
      navigate('/order-confirmation', {
        state: orderData,
      })
    } catch {
      toast.error('Payment failed. Please try again.')
    } finally {
      setIsProcessing(false)
    }
  }

  if (!hasItems) {
    return (
      <>
        <SEO
          title="Checkout - IVOLEX"
          description="Complete your purchase securely with our streamlined checkout process."
        />
        <Container>
          <div className="text-center py-20">
            <h1 className="text-2xl font-semibold mb-2">
              No items to checkout
            </h1>
            <p className="text-stone-600 mb-6">
              Your cart is empty. Add some items to proceed with checkout.
            </p>
            <Link className="btn btn-primary" to="/shop">
              Go back to shop
            </Link>
          </div>
        </Container>
      </>
    )
  }

  return (
    <>
      <SEO
        title="Checkout - IVOLEX"
        description="Complete your purchase securely with our streamlined checkout process."
        keywords="checkout, payment, secure shopping, buy online"
      />
      <section className="py-10">
        <Container>
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center gap-2 mb-8">
              <Lock size={20} className="text-green-600" />
              <h1 className="text-2xl font-semibold">Secure Checkout</h1>
            </div>

            <form
              onSubmit={handlePlaceOrder}
              className="grid grid-cols-1 lg:grid-cols-3 gap-8"
            >
              <div className="lg:col-span-2 space-y-6">
                {/* Contact Information */}
                <div className="card p-6">
                  <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <span className="w-6 h-6 bg-brand-600 text-white rounded-full flex items-center justify-center text-sm">
                      1
                    </span>
                    Contact Information
                  </h2>
                  <div className="space-y-4">
                    <input
                      className="w-full border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-500"
                      placeholder="Email address"
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                {/* Shipping Details */}
                <div className="card p-6">
                  <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <span className="w-6 h-6 bg-brand-600 text-white rounded-full flex items-center justify-center text-sm">
                      2
                    </span>
                    Shipping Details
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      className="border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-500"
                      placeholder="First Name"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      required
                    />
                    <input
                      className="border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-500"
                      placeholder="Last Name"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      required
                    />
                    <input
                      className="border rounded-xl px-4 py-3 md:col-span-2 focus:outline-none focus:ring-2 focus:ring-brand-500"
                      placeholder="Street Address"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      required
                    />
                    <input
                      className="border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-500"
                      placeholder="City"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      required
                    />
                    <input
                      className="border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-500"
                      placeholder="Country"
                      name="country"
                      value={formData.country}
                      onChange={handleInputChange}
                      required
                    />
                    <input
                      className="border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-500"
                      placeholder="Postal Code"
                      name="postalCode"
                      value={formData.postalCode}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                {/* Payment Information */}
                <div className="card p-6">
                  <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <span className="w-6 h-6 bg-brand-600 text-white rounded-full flex items-center justify-center text-sm">
                      3
                    </span>
                    Payment Information
                  </h2>

                  {/* Payment Method Selection */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium mb-3">
                      Choose Payment Method
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {/* Cash on Delivery */}
                      <label
                        className={`border-2 rounded-xl p-4 cursor-pointer transition-all ${
                          formData.paymentMethod === 'cod'
                            ? 'border-brand-500 bg-brand-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="cod"
                          checked={formData.paymentMethod === 'cod'}
                          onChange={handleInputChange}
                          className="sr-only"
                        />
                        <div className="text-center">
                          <div className="text-2xl mb-2">💵</div>
                          <div className="font-medium">Cash on Delivery</div>
                          <div className="text-xs text-gray-500 mt-1">
                            Pay when you receive
                          </div>
                        </div>
                      </label>

                      {/* UPI */}
                      <label
                        className={`border-2 rounded-xl p-4 cursor-pointer transition-all ${
                          formData.paymentMethod === 'upi'
                            ? 'border-brand-500 bg-brand-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="upi"
                          checked={formData.paymentMethod === 'upi'}
                          onChange={handleInputChange}
                          className="sr-only"
                        />
                        <div className="text-center">
                          <div className="text-2xl mb-2">📱</div>
                          <div className="font-medium">UPI Payment</div>
                          <div className="text-xs text-gray-500 mt-1">
                            GooglePay, PhonePe, Paytm
                          </div>
                        </div>
                      </label>

                      {/* Bank Transfer */}
                      <label
                        className={`border-2 rounded-xl p-4 cursor-pointer transition-all ${
                          formData.paymentMethod === 'bank'
                            ? 'border-brand-500 bg-brand-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="bank"
                          checked={formData.paymentMethod === 'bank'}
                          onChange={handleInputChange}
                          className="sr-only"
                        />
                        <div className="text-center">
                          <div className="text-2xl mb-2">🏦</div>
                          <div className="font-medium">Bank Transfer</div>
                          <div className="text-xs text-gray-500 mt-1">
                            Direct bank transfer
                          </div>
                        </div>
                      </label>
                    </div>
                  </div>

                  {/* UPI Payment Details */}
                  {formData.paymentMethod === 'upi' && (
                    <div className="border rounded-xl p-4 bg-blue-50 mb-4">
                      <label className="block text-sm font-medium mb-2">
                        UPI ID
                      </label>
                      <input
                        className="w-full border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-500"
                        placeholder="yourname@paytm / yourname@phonepe"
                        name="upiId"
                        value={formData.upiId}
                        onChange={handleInputChange}
                        required={formData.paymentMethod === 'upi'}
                      />
                      <p className="text-xs text-gray-600 mt-2">
                        Enter your UPI ID for payment processing
                      </p>
                    </div>
                  )}

                  {/* Bank Transfer Details */}
                  {formData.paymentMethod === 'bank' && (
                    <div className="border rounded-xl p-4 bg-green-50 space-y-4 mb-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-2">
                            Account Number
                          </label>
                          <input
                            className="w-full border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-500"
                            placeholder="Bank Account Number"
                            name="bankAccount"
                            value={formData.bankAccount}
                            onChange={handleInputChange}
                            required={formData.paymentMethod === 'bank'}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">
                            IFSC Code
                          </label>
                          <input
                            className="w-full border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-500"
                            placeholder="IFSC Code"
                            name="ifscCode"
                            value={formData.ifscCode}
                            onChange={handleInputChange}
                            required={formData.paymentMethod === 'bank'}
                          />
                        </div>
                      </div>
                      <p className="text-xs text-gray-600">
                        Bank transfer details will be provided after order
                        confirmation
                      </p>
                    </div>
                  )}

                  {/* Credit/Debit Card (Optional) */}
                  {formData.paymentMethod === 'card' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <input
                        className="border rounded-xl px-4 py-3 md:col-span-2 focus:outline-none focus:ring-2 focus:ring-brand-500"
                        placeholder="Card Number"
                        name="cardNumber"
                        value={formData.cardNumber}
                        onChange={handleInputChange}
                        maxLength={19}
                        required={formData.paymentMethod === 'card'}
                      />
                      <input
                        className="border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-500"
                        placeholder="Name on Card"
                        name="cardName"
                        value={formData.cardName}
                        onChange={handleInputChange}
                        required={formData.paymentMethod === 'card'}
                      />
                      <div className="grid grid-cols-2 gap-4">
                        <input
                          className="border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-500"
                          placeholder="MM/YY"
                          name="expiryDate"
                          value={formData.expiryDate}
                          onChange={handleInputChange}
                          maxLength={5}
                          required={formData.paymentMethod === 'card'}
                        />
                        <input
                          className="border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-500"
                          placeholder="CVC"
                          name="cvc"
                          value={formData.cvc}
                          onChange={handleInputChange}
                          maxLength={4}
                          required={formData.paymentMethod === 'card'}
                        />
                      </div>
                    </div>
                  )}

                  <div className="mt-4 flex items-center gap-2 text-sm text-stone-600">
                    <CreditCard size={16} />
                    <span>
                      {formData.paymentMethod === 'cod' &&
                        'Pay cash when your order arrives'}
                      {formData.paymentMethod === 'upi' &&
                        'Secure UPI payment through trusted providers'}
                      {formData.paymentMethod === 'bank' &&
                        'Safe and secure bank transfer'}
                      {formData.paymentMethod === 'card' &&
                        'We accept all major credit and debit cards'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <div className="card p-6 sticky top-6">
                  <h2 className="text-lg font-semibold mb-4">Order Summary</h2>

                  <div className="space-y-3 mb-4 max-h-60 overflow-y-auto">
                    {items.map(({ id, item, qty }) => (
                      <div key={id} className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg overflow-hidden bg-stone-100 flex-shrink-0">
                          <img
                            src={item.image || item.img}
                            alt={item.name || item.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium truncate">
                            {item.name || item.title}
                          </div>
                          <div className="text-xs text-stone-500">
                            Qty: {qty} × {formatCurrency(item.price || 0)}
                          </div>
                        </div>
                        <div className="text-sm font-medium">
                          {formatCurrency((item.price || 0) * qty)}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-2 py-4 border-t">
                    <div className="flex justify-between text-sm">
                      <span>Subtotal</span>
                      <span>{formatCurrency(subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Shipping</span>
                      <span>
                        {shipping === 0 ? 'Free' : formatCurrency(shipping)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Tax</span>
                      <span>{formatCurrency(tax)}</span>
                    </div>
                    <div className="flex justify-between font-semibold text-lg pt-2 border-t">
                      <span>Total</span>
                      <span>{formatCurrency(finalTotal)}</span>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="btn btn-primary w-full mb-4"
                    disabled={isProcessing}
                  >
                    {isProcessing ? (
                      <span className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Processing...
                      </span>
                    ) : (
                      `Place Order - ${formatCurrency(finalTotal)}`
                    )}
                  </button>

                  <div className="space-y-2 text-xs text-stone-500">
                    <div className="flex items-center gap-2">
                      <Lock size={12} />
                      <span>SSL encrypted checkout</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Truck size={12} />
                      <span>
                        Free delivery on orders over {formatCurrency(500)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle size={12} />
                      <span>30-day money-back guarantee</span>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </Container>
      </section>
    </>
  )
}
