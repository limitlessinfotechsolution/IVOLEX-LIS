import Container from '../../../ui/components/Container.jsx'
import { useCart } from '../../../ui/contexts/CartContext.jsx'
import { Link } from 'react-router-dom'
import { SEO } from '../../../components/SEO'
import { Trash2, Plus, Minus, ShoppingBag } from 'lucide-react'
import toast from 'react-hot-toast'

export default function CartScreen() {
  const { items, total, setQty, remove, clear } = useCart()
  const hasItems = items.length > 0
  const itemCount = items.reduce((sum, item) => sum + item.qty, 0)

  const handleRemoveItem = (id, itemName) => {
    remove(id)
    toast.success(`${itemName} removed from cart`)
  }

  const handleClearCart = () => {
    if (window.confirm('Are you sure you want to clear your cart?')) {
      clear()
      toast.success('Cart cleared')
    }
  }

  const handleQuantityChange = (id, newQty) => {
    if (newQty < 1) return
    setQty(id, newQty)
  }

  return (
    <>
      <SEO
        title={`Shopping Cart (${itemCount}) - IVOLEX`}
        description="Review your selected items and proceed to checkout for a seamless shopping experience."
        keywords="shopping cart, checkout, e-commerce, buy online"
      />
      <section className="py-10">
        <Container>
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-semibold">Your Cart</h1>
            {hasItems && (
              <button
                onClick={handleClearCart}
                className="text-sm text-stone-500 hover:text-stone-700 transition-colors"
              >
                Clear cart
              </button>
            )}
          </div>

          {!hasItems ? (
            <div className="text-center py-20">
              <div className="w-24 h-24 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <ShoppingBag size={32} className="text-stone-400" />
              </div>
              <h2 className="text-xl font-medium mb-2">Your cart is empty</h2>
              <p className="text-stone-600 mb-6">
                Looks like you haven&apos;t added anything to your cart yet.
              </p>
              <Link className="btn btn-primary" to="/shop">
                Continue shopping
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-4">
                {items.map(({ id, item, qty }) => (
                  <div
                    key={id}
                    className="flex items-center gap-4 p-4 rounded-2xl border bg-white shadow-sm hover:shadow-md transition-shadow"
                  >
                    <Link to={`/product/${item.id}`} className="flex-shrink-0">
                      <img
                        src={item.image || item.img}
                        alt={item.name || item.title}
                        className="w-20 h-20 object-cover rounded-xl hover:scale-105 transition-transform"
                      />
                    </Link>

                    <div className="flex-1 min-w-0">
                      <Link
                        to={`/product/${item.id}`}
                        className="font-medium hover:text-brand-600 transition-colors block"
                      >
                        {item.name || item.title}
                      </Link>
                      <div className="text-sm text-stone-500 mt-1">
                        ${(item.price || 0).toFixed?.(2) || item.price} each
                      </div>
                      <div className="text-sm text-stone-600 mt-2">
                        Subtotal: ${((item.price || 0) * qty).toFixed(2)}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        className="w-8 h-8 flex items-center justify-center border rounded-lg hover:bg-stone-50 transition-colors"
                        onClick={() => handleQuantityChange(id, qty - 1)}
                        disabled={qty <= 1}
                      >
                        <Minus size={14} />
                      </button>
                      <input
                        className="w-16 text-center border rounded-lg py-1 text-sm"
                        type="number"
                        value={qty}
                        min={1}
                        max={99}
                        onChange={e =>
                          handleQuantityChange(
                            id,
                            parseInt(e.target.value || '1', 10)
                          )
                        }
                      />
                      <button
                        className="w-8 h-8 flex items-center justify-center border rounded-lg hover:bg-stone-50 transition-colors"
                        onClick={() => handleQuantityChange(id, qty + 1)}
                      >
                        <Plus size={14} />
                      </button>
                    </div>

                    <button
                      className="p-2 text-stone-400 hover:text-red-500 transition-colors"
                      onClick={() =>
                        handleRemoveItem(id, item.name || item.title)
                      }
                      aria-label={`Remove ${item.name || item.title} from cart`}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>

              <div className="lg:col-span-1">
                <div className="card p-6 sticky top-6">
                  <h2 className="text-lg font-semibold mb-4">Order Summary</h2>

                  <div className="space-y-3 mb-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-stone-600">
                        Subtotal ({itemCount}{' '}
                        {itemCount === 1 ? 'item' : 'items'})
                      </span>
                      <span>${total.toFixed(2)}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-stone-600">Shipping</span>
                      <span>{total >= 50 ? 'Free' : '$5.99'}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-stone-600">Tax</span>
                      <span>${(total * 0.08).toFixed(2)}</span>
                    </div>
                    <hr className="my-4" />
                    <div className="flex items-center justify-between font-semibold">
                      <span>Total</span>
                      <span className="text-lg">
                        $
                        {(
                          total +
                          (total >= 50 ? 0 : 5.99) +
                          total * 0.08
                        ).toFixed(2)}
                      </span>
                    </div>
                  </div>

                  {total < 50 && (
                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mb-4">
                      <p className="text-sm text-amber-800">
                        Add ${(50 - total).toFixed(2)} more for free shipping!
                      </p>
                    </div>
                  )}

                  <Link to="/checkout" className="btn btn-primary w-full mb-3">
                    Proceed to Checkout
                  </Link>

                  <Link to="/shop" className="btn btn-outline w-full text-sm">
                    Continue Shopping
                  </Link>

                  <div className="mt-6 text-xs text-stone-500">
                    <p>🔒 Secure checkout</p>
                    <p>📦 Free returns within 30 days</p>
                    <p>🚚 Fast delivery available</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </Container>
      </section>
    </>
  )
}
