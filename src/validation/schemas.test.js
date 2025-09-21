import { describe, it, expect } from 'vitest'
import { newsletterSchema, contactSchema, checkoutSchema } from './schemas'

describe('Form Validation Schemas', () => {
  describe('Newsletter Schema', () => {
    it('validates valid newsletter data', () => {
      const validData = {
        email: 'test@example.com',
        terms: true,
      }
      
      const result = newsletterSchema.safeParse(validData)
      expect(result.success).toBe(true)
    })

    it('rejects invalid email', () => {
      const invalidData = {
        email: 'invalid-email',
        terms: true,
      }
      
      const result = newsletterSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
      expect(result.error?.issues[0].message).toContain('valid email')
    })

    it('requires terms acceptance', () => {
      const invalidData = {
        email: 'test@example.com',
        terms: false,
      }
      
      const result = newsletterSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
      expect(result.error?.issues[0].message).toContain('terms and conditions')
    })
  })

  describe('Contact Schema', () => {
    it('validates valid contact data', () => {
      const validData = {
        name: 'John Doe',
        email: 'john@example.com',
        subject: 'Test Subject',
        message: 'This is a test message that is long enough.',
      }
      
      const result = contactSchema.safeParse(validData)
      expect(result.success).toBe(true)
    })

    it('rejects short names', () => {
      const invalidData = {
        name: 'J',
        email: 'john@example.com',
        subject: 'Test Subject',
        message: 'This is a test message that is long enough.',
      }
      
      const result = contactSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
      expect(result.error?.issues[0].message).toContain('at least 2 characters')
    })
  })

  describe('Checkout Schema', () => {
    it('validates valid checkout data', () => {
      const validData = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        phone: '+1234567890',
        address: '123 Main Street',
        city: 'New York',
        state: 'NY',
        zipCode: '10001',
        country: 'United States',
        cardNumber: '1234 5678 9012 3456',
        expiryDate: '12/25',
        cvv: '123',
        cardholderName: 'John Doe',
      }
      
      const result = checkoutSchema.safeParse(validData)
      expect(result.success).toBe(true)
    })

    it('validates phone number format', () => {
      const invalidData = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        phone: '123',
        address: '123 Main Street',
        city: 'New York',
        state: 'NY',
        zipCode: '10001',
        country: 'United States',
        cardNumber: '1234 5678 9012 3456',
        expiryDate: '12/25',
        cvv: '123',
        cardholderName: 'John Doe',
      }
      
      const result = checkoutSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
      expect(result.error?.issues[0].message).toContain('valid phone number')
    })
  })
})