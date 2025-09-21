// Mock data for testing
export const mockProducts = [
  {
    id: 'test-product-1',
    name: 'Test Leather Bag',
    price: 99.99,
    category: 'bags',
    image: '/test-image.jpg',
    rating: 4.5,
    short: 'A test leather bag for testing purposes.',
  },
  {
    id: 'test-product-2',
    name: 'Test Leather Belt',
    price: 49.99,
    category: 'belts',
    image: '/test-belt.jpg',
    rating: 4.2,
    short: 'A test leather belt for testing purposes.',
  },
]

export const mockCartItem = {
  id: 'test-product-1',
  item: mockProducts[0],
  qty: 2,
}

export const mockLocation = {
  country: 'United States',
  region: 'Americas',
  currency: 'USD',
  loading: false,
  error: null,
}
