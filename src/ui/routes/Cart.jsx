import Container from '../components/Container.jsx'
import { useCart } from '../contexts/CartContext.jsx'
import { LoadingSpinner } from '../components/LoadingStates.jsx'
import { Link } from 'react-router-dom'

export default function Cart() {
  const { items, total, setQty, remove, clear, isUpdating } = useCart()
  const hasItems = items.length > 0

  return (
    <section className="py-10">
      <Container>
        <h1 className="text-2xl mb-6">Your Cart</h1>

        {!hasItems ? (
          <div className="text-center py-20 text-stone-500">
            Cart is empty.{' '}
            <Link className="text-brand-600 underline" to="/shop">
              Continue shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              {items.map(({ id, item, qty }) => (
                <div
                  key={id}
                  className="flex items-center gap-4 p-4 rounded-2xl border bg-white"
                >
                  <img
                    src={item.image || item.img}
                    alt={item.name || item.title}
                    className="w-20 h-20 object-cover rounded-xl"
                  />
                  <div className="flex-1">
                    <div className="font-medium">{item.name || item.title}</div>
                    <div className="text-sm text-stone-500">
                      ${(item.price || 0).toFixed?.(2) || item.price}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      className="btn btn-outline px-3 disabled:opacity-50 disabled:cursor-not-allowed"
                      onClick={() => setQty(id, Math.max(0, qty - 1))}
                      disabled={isUpdating(id)}
                    >
                      {isUpdating(id) ? (
                        <LoadingSpinner size="sm" text="" />
                      ) : (
                        '-'
                      )}
                    </button>
                    <input
                      className="w-12 text-center border rounded-xl py-1 disabled:opacity-50"
                      type="number"
                      value={qty}
                      min={1}
                      onChange={e =>
                        setQty(id, parseInt(e.target.value || '1', 10))
                      }
                      disabled={isUpdating(id)}
                    />
                    <button
                      className="btn btn-outline px-3 disabled:opacity-50 disabled:cursor-not-allowed"
                      onClick={() => setQty(id, qty + 1)}
                      disabled={isUpdating(id)}
                    >
                      {isUpdating(id) ? (
                        <LoadingSpinner size="sm" text="" />
                      ) : (
                        '+'
                      )}
                    </button>
                  </div>
                  <button
                    className="text-stone-500 hover:text-stone-700"
                    onClick={() => remove(id)}
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button
                className="text-sm text-stone-500 hover:text-stone-700"
                onClick={clear}
              >
                Clear cart
              </button>
            </div>

            <div className="card p-6 h-fit">
              <div className="flex items-center justify-between mb-4">
                <span className="text-stone-600">Subtotal</span>
                <span className="font-semibold">${total.toFixed(2)}</span>
              </div>
              <Link to="/checkout" className="btn btn-primary w-full">
                Proceed to Checkout
              </Link>
            </div>
          </div>
        )}
      </Container>
    </section>
  )
}
