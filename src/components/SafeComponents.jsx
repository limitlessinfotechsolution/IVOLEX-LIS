import DOMPurify from 'dompurify'

// Safe HTML rendering component
export function SafeHTML({ html, className = '', tag = 'div', ...props }) {
  const purifyConfig = {
    ALLOWED_TAGS: [
      'b',
      'i',
      'u',
      'strong',
      'em',
      'mark',
      'small',
      'del',
      'ins',
      'sub',
      'sup',
      'p',
      'h1',
      'h2',
      'h3',
      'h4',
      'h5',
      'h6',
      'ul',
      'ol',
      'li',
      'dl',
      'dt',
      'dd',
      'blockquote',
      'div',
      'span',
      'br',
      'hr',
    ],
    ALLOWED_ATTR: ['class', 'id', 'style'],
    FORBID_TAGS: ['script', 'iframe', 'object', 'embed', 'link', 'meta'],
    FORBID_ATTR: ['onclick', 'onload', 'onmouseover', 'onfocus', 'onblur'],
    ALLOW_DATA_ATTR: false,
  }

  const sanitizedHTML = DOMPurify.sanitize(html, purifyConfig)
  const Tag = tag

  return (
    <Tag
      className={className}
      dangerouslySetInnerHTML={{ __html: sanitizedHTML }}
      {...props}
    />
  )
}

// Safe text rendering (strips all HTML)
export function SafeText({ text, maxLength = null, className = '', ...props }) {
  if (!text || typeof text !== 'string') return null

  // Strip all HTML and sanitize
  const cleanText = DOMPurify.sanitize(text, { ALLOWED_TAGS: [] })
  const truncatedText =
    maxLength && cleanText.length > maxLength
      ? `${cleanText.substring(0, maxLength)}...`
      : cleanText

  return (
    <span className={className} {...props}>
      {truncatedText}
    </span>
  )
}

// Safe link component
export function SafeLink({
  href,
  children,
  className = '',
  external = false,
  ...props
}) {
  if (!href || typeof href !== 'string') return null

  // Validate URL
  let safeHref
  try {
    const url = new URL(href, window.location.origin)
    // Only allow http, https, and mailto protocols
    if (['http:', 'https:', 'mailto:'].includes(url.protocol)) {
      safeHref = url.toString()
    } else {
      return <span className={className}>{children}</span>
    }
  } catch {
    return <span className={className}>{children}</span>
  }

  const linkProps = {
    href: safeHref,
    className,
    ...props,
  }

  // Add security attributes for external links
  if (external || safeHref.startsWith('http')) {
    linkProps.target = '_blank'
    linkProps.rel = 'noopener noreferrer'
  }

  return <a {...linkProps}>{children}</a>
}

// Safe image component
export function SafeImage({
  src,
  alt = '',
  className = '',
  fallback = null,
  ...props
}) {
  if (!src || typeof src !== 'string') {
    return fallback
  }

  // Validate image URL
  let safeSrc
  try {
    const url = new URL(src, window.location.origin)
    if (['http:', 'https:', 'data:'].includes(url.protocol)) {
      safeSrc = url.toString()
    } else {
      return fallback
    }
  } catch {
    return fallback
  }

  const handleError = e => {
    if (fallback) {
      e.target.style.display = 'none'
      // Replace with fallback content
    }
  }

  return (
    <img
      src={safeSrc}
      alt={DOMPurify.sanitize(alt, { ALLOWED_TAGS: [] })}
      className={className}
      onError={handleError}
      loading="lazy"
      {...props}
    />
  )
}

// Sanitization utilities
export const sanitizeUtils = {
  // Sanitize user input for display
  displayText: text => {
    if (!text || typeof text !== 'string') return ''
    return DOMPurify.sanitize(text, { ALLOWED_TAGS: [] })
  },

  // Sanitize HTML content
  htmlContent: (
    html,
    allowedTags = ['b', 'i', 'u', 'strong', 'em', 'p', 'br']
  ) => {
    if (!html || typeof html !== 'string') return ''
    return DOMPurify.sanitize(html, { ALLOWED_TAGS: allowedTags })
  },

  // Sanitize URLs
  url: url => {
    if (!url || typeof url !== 'string') return ''
    try {
      const parsed = new URL(url, window.location.origin)
      return ['http:', 'https:', 'mailto:'].includes(parsed.protocol)
        ? parsed.toString()
        : ''
    } catch {
      return ''
    }
  },

  // Sanitize search queries
  searchQuery: query => {
    if (!query || typeof query !== 'string') return ''
    return DOMPurify.sanitize(query, { ALLOWED_TAGS: [] })
      .replace(/[<>"';&]/g, '')
      .substring(0, 100)
      .trim()
  },

  // Sanitize form data
  formData: data => {
    const sanitized = {}
    for (const [key, value] of Object.entries(data)) {
      if (typeof value === 'string') {
        sanitized[key] = DOMPurify.sanitize(value, { ALLOWED_TAGS: [] })
      } else {
        sanitized[key] = value
      }
    }
    return sanitized
  },
}

export default {
  SafeHTML,
  SafeText,
  SafeLink,
  SafeImage,
  sanitizeUtils,
}
