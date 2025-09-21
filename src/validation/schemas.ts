import { z } from 'zod'

// Newsletter subscription schema
export const newsletterSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
  terms: z
    .boolean()
    .refine(val => val, 'You must accept the terms and conditions'),
})

// Contact form schema
export const contactSchema = z.object({
  name: z
    .string()
    .min(1, 'Name is required')
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must be less than 50 characters'),
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
  subject: z
    .string()
    .min(1, 'Subject is required')
    .min(5, 'Subject must be at least 5 characters')
    .max(100, 'Subject must be less than 100 characters'),
  message: z
    .string()
    .min(1, 'Message is required')
    .min(10, 'Message must be at least 10 characters')
    .max(1000, 'Message must be less than 1000 characters'),
})

// Checkout form schema
export const checkoutSchema = z.object({
  // Personal Information
  firstName: z
    .string()
    .min(1, 'First name is required')
    .min(2, 'First name must be at least 2 characters'),
  lastName: z
    .string()
    .min(1, 'Last name is required')
    .min(2, 'Last name must be at least 2 characters'),
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
  phone: z
    .string()
    .min(1, 'Phone number is required')
    .regex(/^[+]?[(]?[\d\s\-\(\)]{10,}$/, 'Please enter a valid phone number'),
  
  // Shipping Address
  address: z
    .string()
    .min(1, 'Address is required')
    .min(5, 'Address must be at least 5 characters'),
  city: z
    .string()
    .min(1, 'City is required')
    .min(2, 'City must be at least 2 characters'),
  state: z
    .string()
    .min(1, 'State/Province is required'),
  zipCode: z
    .string()
    .min(1, 'ZIP/Postal code is required')
    .regex(/^[\d\w\s-]{3,10}$/, 'Please enter a valid ZIP/Postal code'),
  country: z
    .string()
    .min(1, 'Country is required'),
  
  // Payment Information
  cardNumber: z
    .string()
    .min(1, 'Card number is required')
    .regex(/^[\d\s]{13,19}$/, 'Please enter a valid card number'),
  expiryDate: z
    .string()
    .min(1, 'Expiry date is required')
    .regex(/^(0[1-9]|1[0-2])\/([0-9]{2})$/, 'Please enter a valid expiry date (MM/YY)'),
  cvv: z
    .string()
    .min(1, 'CVV is required')
    .regex(/^[0-9]{3,4}$/, 'Please enter a valid CVV'),
  cardholderName: z
    .string()
    .min(1, 'Cardholder name is required')
    .min(2, 'Cardholder name must be at least 2 characters'),
})

// Type exports
export type NewsletterFormData = z.infer<typeof newsletterSchema>
export type ContactFormData = z.infer<typeof contactSchema>
export type CheckoutFormData = z.infer<typeof checkoutSchema>