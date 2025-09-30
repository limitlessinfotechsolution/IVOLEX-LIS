import { useState } from 'react'
import Container from '../common/Container.jsx'
import { useCart } from '../contexts/CartContext.jsx'
import { Link } from 'react-router-dom'

export default function Checkout() {
  const { items, total, clear } = useCart()
  const hasItems = items.length > 0
  const [isPlacingOrder, setIsPlacingOrder] = useState(false)

  const handlePlaceOrder = async e => {
    e.preventDefault()
    setIsPlacingOrder(true)
    // Simulate order processing
    await new Promise(resolve => setTimeout(resolve, 2000))
    clear()
    alert('Order placed! (demo)')
    setIsPlacingOrder(false)
  }

  return (
    <section className="py-10">
      <Container>
        <h1 className="text-2xl mb-6">Checkout</h1>
        {!hasItems ? (
          <div className="text-center py-20 text-stone-500">
            No items to checkout.{' '}
            <Link className="text-brand-600 underline" to="/shop">
              Go back to shop
            </Link>
          </div>
        ) : (
          <form
            onSubmit={handlePlaceOrder}
            className="grid grid-cols-1 lg:grid-cols-3 gap-8"
          >
            <div className="lg:col-span-2 space-y-6">
              <div className="card p-6">
                <h2 className="text-lg mb-4">Shipping Details</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    className="border rounded-xl px-3 py-2"
                    placeholder="Full Name"
                    required
                  />
                  <input
                    className="border rounded-xl px-3 py-2"
                    placeholder="Email"
                    type="email"
                    required
                  />
                  <input
                    className="border rounded-xl px-3 py-2 md:col-span-2"
                    placeholder="Address"
                    required
                  />
                  <input
                    className="border rounded-xl px-3 py-2"
                    placeholder="City"
                    required
                  />
                  <input
                    className="border rounded-xl px-3 py-2"
                    placeholder="Country"
                    required
                  />
                </div>
              </div>
              <div className="card p-6">
                <h2 className="text-lg mb-4">Payment</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    className="border rounded-xl px-3 py-2"
                    placeholder="Card Number"
                    required
                  />
                  <input
                    className="border rounded-xl px-3 py-2"
                    placeholder="Name on Card"
                    required
                  />
                  <input
                    className="border rounded-xl px-3 py-2"
                    placeholder="Expiry (MM/YY)"
                    required
                  />
                  <input
                    className="border rounded-xl px-3 py-2"
                    placeholder="CVC"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="card p-6 h-fit">
              <h2 className="text-lg mb-4">Order Summary</h2>
              <div className="space-y-3 mb-4">
                {items.map(({ id, item, qty }) => (
                  <div
                    key={id}
                    className="flex items-center justify-between text-sm"
                  >
                    <span>
                      {item.name || item.title} × {qty}
                    </span>
                    <span>${((item.price || 0) * qty).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-between font-semibold mb-6">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
              <button
                type="submit"
                className="btn btn-primary w-full"
                disabled={isPlacingOrder}
              >
                {isPlacingOrder ? 'Processing...' : 'Place Order'}
              </button>
            </div>
          </form>
        )}
      </Container>
    </section>
  )
}
