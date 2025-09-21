import { test, expect } from '@playwright/test'

test.describe('Homepage', () => {
  test('loads successfully', async ({ page }) => {
    await page.goto('/')
    
    // Check that the page title is correct
    await expect(page).toHaveTitle(/IVolex/i)
    
    // Check for main navigation elements
    await expect(page.locator('nav')).toBeVisible()
    await expect(page.getByRole('banner')).toBeVisible()
  })

  test('navigation works correctly', async ({ page }) => {
    await page.goto('/')
    
    // Test shop navigation
    await page.getByRole('link', { name: /shop/i }).click()
    await expect(page).toHaveURL(/\/shop/)
    
    // Navigate back to home
    await page.getByRole('link', { name: /ivolex/i }).click()
    await expect(page).toHaveURL('/')
  })

  test('hero section is visible', async ({ page }) => {
    await page.goto('/')
    
    // Check hero section elements
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
    await expect(page.getByRole('button', { name: /shop now/i })).toBeVisible()
  })

  test('categories section displays correctly', async ({ page }) => {
    await page.goto('/')
    
    // Scroll to categories section
    await page.locator('[data-testid="categories-section"]').scrollIntoViewIfNeeded()
    
    // Check that categories are visible
    await expect(page.getByText(/bags/i)).toBeVisible()
    await expect(page.getByText(/belts/i)).toBeVisible()
    await expect(page.getByText(/wallets/i)).toBeVisible()
  })

  test('responsive design works on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('/')
    
    // Check mobile navigation
    await expect(page.getByRole('button', { name: /menu/i })).toBeVisible()
    
    // Check that content is visible and properly sized
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
  })
})