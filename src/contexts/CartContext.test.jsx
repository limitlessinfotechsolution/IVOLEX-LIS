import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@/test/test-utils'
import { useCart } from '@/ui/contexts/CartContext'
import { mockProducts } from '@/test/mocks'

// Test component to use the Cart context
function TestCartComponent() {
  const { items, count, total, add, remove, setQty, clear } = useCart()

  return (
    <div>
      <div data-testid="cart-count">{count}</div>
      <div data-testid="cart-total">{total.toFixed(2)}</div>
      <div data-testid="cart-items">{items.length}</div>
      <button data-testid="add-item" onClick={() => add(mockProducts[0], 1)}>
        Add Item
      </button>
      <button
        data-testid="remove-item"
        onClick={() => remove(mockProducts[0].id)}
      >
        Remove Item
      </button>
      <button
        data-testid="set-qty"
        onClick={() => setQty(mockProducts[0].id, 3)}
      >
        Set Quantity to 3
      </button>
      <button data-testid="clear-cart" onClick={clear}>
        Clear Cart
      </button>
    </div>
  )
}

describe('CartContext', () => {
  beforeEach(() => {
    // Reset any mocks if needed
  })

  it('initializes with empty cart', () => {
    render(<TestCartComponent />)

    expect(screen.getByTestId('cart-count')).toHaveTextContent('0')
    expect(screen.getByTestId('cart-total')).toHaveTextContent('0.00')
    expect(screen.getByTestId('cart-items')).toHaveTextContent('0')
  })

  it('adds items to cart', () => {
    render(<TestCartComponent />)

    fireEvent.click(screen.getByTestId('add-item'))

    expect(screen.getByTestId('cart-count')).toHaveTextContent('1')
    expect(screen.getByTestId('cart-total')).toHaveTextContent('99.99')
    expect(screen.getByTestId('cart-items')).toHaveTextContent('1')
  })

  it('removes items from cart', () => {
    render(<TestCartComponent />)

    // Add item first
    fireEvent.click(screen.getByTestId('add-item'))
    expect(screen.getByTestId('cart-count')).toHaveTextContent('1')

    // Remove item
    fireEvent.click(screen.getByTestId('remove-item'))
    expect(screen.getByTestId('cart-count')).toHaveTextContent('0')
  })

  it('updates item quantity', () => {
    render(<TestCartComponent />)

    // Add item first
    fireEvent.click(screen.getByTestId('add-item'))

    // Set quantity to 3
    fireEvent.click(screen.getByTestId('set-qty'))

    expect(screen.getByTestId('cart-count')).toHaveTextContent('3')
    expect(screen.getByTestId('cart-total')).toHaveTextContent('299.97')
  })

  it('clears the cart', () => {
    render(<TestCartComponent />)

    // Add item first
    fireEvent.click(screen.getByTestId('add-item'))
    expect(screen.getByTestId('cart-count')).toHaveTextContent('1')

    // Clear cart
    fireEvent.click(screen.getByTestId('clear-cart'))
    expect(screen.getByTestId('cart-count')).toHaveTextContent('0')
  })
})
