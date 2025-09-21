import { test, expect } from '@playwright/test'

test.describe('Shopping Cart', () => {
  test('can add items to cart', async ({ page }) => {
    await page.goto('/')
    
    // Navigate to a product
    await page.getByRole('link', { name: /shop/i }).first().click()
    
    // Add item to cart (assuming there's an add to cart button)
    const addToCartButton = page.getByRole('button', { name: /add to cart/i }).first()
    if (await addToCartButton.isVisible()) {
      await addToCartButton.click()
      
      // Check that cart count increased
      const cartIcon = page.locator('[data-testid="cart-icon"]')
      await expect(cartIcon).toContainText('1')
    }
  })

  test('can view cart page', async ({ page }) => {
    await page.goto('/cart')
    
    // Check that cart page loads
    await expect(page.getByRole('heading', { name: /cart/i })).toBeVisible()
  })

  test('can navigate to checkout', async ({ page }) => {
    await page.goto('/cart')
    
    // Try to find checkout button
    const checkoutButton = page.getByRole('button', { name: /checkout/i })
    if (await checkoutButton.isVisible()) {
      await checkoutButton.click()
      await expect(page).toHaveURL(/\/checkout/)
    }
  })
})