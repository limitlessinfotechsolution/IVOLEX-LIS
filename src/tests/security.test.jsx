import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { sanitization, validation } from '../config/security.js'
import {
  SafeHTML,
  SafeText,
  SafeLink,
  sanitizeUtils,
} from '../components/SafeComponents.jsx'
import {
  SecurityProvider,
  SecurityValidator,
} from '../components/SecurityProvider.jsx'

describe('Security Configuration', () => {
  describe('Input Sanitization', () => {
    it('should sanitize HTML input', () => {
      const maliciousInput = '<script>alert("xss")</script><p>Safe content</p>'
      const sanitized = sanitization.html(maliciousInput)

      expect(sanitized).not.toContain('<script>')
      expect(sanitized).not.toContain('alert')
    })

    it('should sanitize text input', () => {
      const maliciousInput = '<script>alert("xss")</script>Hello World"<>'
      const sanitized = sanitization.text(maliciousInput)

      expect(sanitized).not.toContain('<')
      expect(sanitized).not.toContain('>')
      expect(sanitized).not.toContain('"')
      expect(sanitized).toBe('Hello World')
    })

    it('should validate email addresses', () => {
      expect(sanitization.email('test@example.com')).toBe('test@example.com')
      expect(sanitization.email('invalid-email')).toBe('')
      expect(sanitization.email('test@')).toBe('')
      expect(sanitization.email('<script>alert(1)</script>@test.com')).toBe('')
    })

    it('should sanitize phone numbers', () => {
      expect(sanitization.phone('+1-234-567-8900')).toBe('+1-234-567-8900')
      expect(sanitization.phone('phone<script>')).toBe('phone')
      expect(sanitization.phone('1234567890abcd!@#')).toBe('1234567890')
    })

    it('should sanitize search queries', () => {
      const maliciousQuery = 'search term<script>alert(1)</script>&dangerous'
      const sanitized = sanitization.search(maliciousQuery)

      expect(sanitized).toBe('search termalert(1)dangerous')
      expect(sanitized.length).toBeLessThanOrEqual(100)
    })

    it('should validate URLs', () => {
      expect(sanitization.url('https://example.com')).toBe(
        'https://example.com/'
      )
      expect(sanitization.url('http://example.com')).toBe('http://example.com/')
      expect(sanitization.url('javascript:alert(1)')).toBe('')
      expect(sanitization.url('ftp://example.com')).toBe('')
      expect(sanitization.url('invalid-url')).toBe('')
    })
  })

  describe('Security Validation', () => {
    it('should detect suspicious patterns', () => {
      expect(validation.checkSuspiciousPatterns('normal text')).toBe(true)
      expect(
        validation.checkSuspiciousPatterns('<script>alert(1)</script>')
      ).toBe(false)
      expect(validation.checkSuspiciousPatterns('javascript:alert(1)')).toBe(
        false
      )
      expect(validation.checkSuspiciousPatterns('onclick="malicious()"')).toBe(
        false
      )
    })

    it('should validate file uploads', () => {
      const validFile = new File([''], 'test.jpg', {
        type: 'image/jpeg',
        size: 1024,
      })
      const invalidTypeFile = new File([''], 'test.exe', {
        type: 'application/x-executable',
      })
      const oversizeFile = new File(
        ['x'.repeat(6 * 1024 * 1024)],
        'large.jpg',
        { type: 'image/jpeg' }
      )

      expect(validation.validateFile(validFile).isValid).toBe(true)
      expect(validation.validateFile(invalidTypeFile).isValid).toBe(false)
      expect(validation.validateFile(oversizeFile).isValid).toBe(false)
    })

    it('should validate JSON input', () => {
      expect(validation.validateJSON('{"key": "value"}')).toBe(true)
      expect(validation.validateJSON('{"__proto__": "dangerous"}')).toBe(false)
      expect(validation.validateJSON('invalid json')).toBe(false)
      expect(validation.validateJSON('{"key": "\\u0000"}')).toBe(false)
    })
  })
})

describe('Safe Components', () => {
  describe('SafeHTML', () => {
    it('should render safe HTML', () => {
      const safeContent = '<p>Safe <strong>content</strong></p>'
      render(<SafeHTML html={safeContent} />)

      expect(screen.getByText(/Safe/)).toBeInTheDocument()
      expect(screen.getByText(/content/)).toBeInTheDocument()
    })

    it('should strip dangerous HTML', () => {
      const dangerousContent =
        '<p>Safe content</p><script>alert("xss")</script>'
      const { container } = render(<SafeHTML html={dangerousContent} />)

      expect(container.innerHTML).not.toContain('<script>')
      expect(container.innerHTML).toContain('Safe content')
    })
  })

  describe('SafeText', () => {
    it('should render plain text safely', () => {
      const text = 'Safe text content'
      render(<SafeText text={text} />)

      expect(screen.getByText('Safe text content')).toBeInTheDocument()
    })

    it('should strip HTML from text', () => {
      const htmlText = '<script>alert(1)</script>Plain text<p>more</p>'
      render(<SafeText text={htmlText} />)

      const element = screen.getByText(/Plain text/)
      expect(element.textContent).not.toContain('<script>')
      expect(element.textContent).not.toContain('<p>')
    })

    it('should truncate long text', () => {
      const longText = 'a'.repeat(100)
      render(<SafeText text={longText} maxLength={10} />)

      const element = screen.getByText(/a{1,10}\.\.\./)
      expect(element.textContent).toMatch(/^a{10}\.\.\./)
    })
  })

  describe('SafeLink', () => {
    it('should render safe links', () => {
      render(<SafeLink href="https://example.com">Safe Link</SafeLink>)

      const link = screen.getByRole('link', { name: 'Safe Link' })
      expect(link).toHaveAttribute('href', 'https://example.com/')
    })

    it('should add security attributes to external links', () => {
      render(
        <SafeLink href="https://example.com" external>
          External Link
        </SafeLink>
      )

      const link = screen.getByRole('link', { name: 'External Link' })
      expect(link).toHaveAttribute('target', '_blank')
      expect(link).toHaveAttribute('rel', 'noopener noreferrer')
    })

    it('should reject dangerous URLs', () => {
      render(<SafeLink href="javascript:alert(1)">Dangerous Link</SafeLink>)

      expect(screen.queryByRole('link')).not.toBeInTheDocument()
      expect(screen.getByText('Dangerous Link')).toBeInTheDocument()
    })
  })
})

describe('Security Provider', () => {
  beforeEach(() => {
    vi.spyOn(console, 'warn').mockImplementation(() => {})
  })

  it('should wrap children components', () => {
    render(
      <SecurityProvider>
        <div>Test Content</div>
      </SecurityProvider>
    )

    expect(screen.getByText('Test Content')).toBeInTheDocument()
  })
})

describe('Security Validator', () => {
  it('should prevent XSS in input fields', () => {
    const mockOnViolation = vi.fn()

    render(
      <SecurityValidator onViolation={mockOnViolation}>
        <input data-testid="test-input" />
      </SecurityValidator>
    )

    const input = screen.getByTestId('test-input')
    fireEvent.change(input, { target: { value: '<script>alert(1)</script>' } })

    expect(input.value).not.toContain('<script>')
  })
})

describe('Sanitize Utils', () => {
  describe('displayText', () => {
    it('should sanitize display text', () => {
      const result = sanitizeUtils.displayText('<script>alert(1)</script>Hello')
      expect(result).toBe('Hello')
    })
  })

  describe('htmlContent', () => {
    it('should allow specified HTML tags', () => {
      const html =
        '<p>Paragraph</p><script>alert(1)</script><strong>Bold</strong>'
      const result = sanitizeUtils.htmlContent(html, ['p', 'strong'])

      expect(result).toContain('<p>Paragraph</p>')
      expect(result).toContain('<strong>Bold</strong>')
      expect(result).not.toContain('<script>')
    })
  })

  describe('url', () => {
    it('should validate and return safe URLs', () => {
      expect(sanitizeUtils.url('https://example.com')).toBe(
        'https://example.com/'
      )
      expect(sanitizeUtils.url('javascript:alert(1)')).toBe('')
      expect(sanitizeUtils.url('ftp://example.com')).toBe('')
    })
  })

  describe('searchQuery', () => {
    it('should sanitize search queries', () => {
      const malicious = 'search<script>alert(1)</script>&dangerous"'
      const result = sanitizeUtils.searchQuery(malicious)

      expect(result).toBe('searchalert(1)dangerous')
      expect(result).not.toContain('<')
      expect(result).not.toContain('&')
      expect(result).not.toContain('"')
    })
  })

  describe('formData', () => {
    it('should sanitize form data object', () => {
      const data = {
        name: '<script>alert(1)</script>John',
        email: 'test@example.com',
        age: 25,
        bio: 'Hello <strong>world</strong>',
      }

      const sanitized = sanitizeUtils.formData(data)

      expect(sanitized.name).toBe('John')
      expect(sanitized.email).toBe('test@example.com')
      expect(sanitized.age).toBe(25)
      expect(sanitized.bio).toBe('Hello world')
    })
  })
})
