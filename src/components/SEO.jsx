import { Helmet, HelmetProvider } from 'react-helmet-async'
import { config } from '../config'

export function SEOProvider({ children }) {
  return <HelmetProvider>{children}</HelmetProvider>
}

export function SEO({
  title,
  description,
  keywords,
  image,
  url,
  type = 'website',
  noindex = false,
  canonical,
  alternateLanguages,
  structuredData,
}) {
  const siteName = config.app.name
  const fullTitle = title ? `${title} | ${siteName}` : siteName
  const finalUrl =
    url || (typeof window !== 'undefined' ? window.location.href : '')
  const defaultDescription =
    'Premium leather goods crafted with attention to detail. Shop our collection of leather bags, belts, wallets, and footwear.'
  const finalDescription = description || defaultDescription

  const defaultImage = '/images/og-image.jpg'
  const finalImage = image || defaultImage
  const fullImageUrl = finalImage.startsWith('http')
    ? finalImage
    : `${typeof window !== 'undefined' ? window.location.origin : ''}${finalImage}`

  const defaultKeywords = [
    'leather goods',
    'leather bags',
    'leather belts',
    'leather wallets',
    'leather footwear',
    'premium leather',
    'handcrafted leather',
    'luxury accessories',
    'handmade leather',
    'handmade leather goods',
    'handmade leather wallets',

  ]
  const finalKeywords = keywords
    ? [...keywords, ...defaultKeywords]
    : defaultKeywords

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={finalDescription} />
      <meta name="keywords" content={finalKeywords.join(', ')} />

      {/* Canonical URL */}
      {canonical && <link rel="canonical" href={canonical} />}

      {/* Robots */}
      <meta
        name="robots"
        content={noindex ? 'noindex,nofollow' : 'index,follow'}
      />

      {/* Open Graph */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={finalDescription} />
      <meta property="og:image" content={fullImageUrl} />
      <meta property="og:url" content={finalUrl} />
      <meta property="og:site_name" content={siteName} />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={finalDescription} />
      <meta name="twitter:image" content={fullImageUrl} />

      {/* Additional SEO Meta */}
      <meta name="author" content={siteName} />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta httpEquiv="Content-Language" content="en" />

      {/* Alternate Languages */}
      {alternateLanguages &&
        alternateLanguages.map(lang => (
          <link
            key={lang.hreflang}
            rel="alternate"
            hrefLang={lang.hreflang}
            href={lang.href}
          />
        ))}

      {/* Structured Data */}
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}
    </Helmet>
  )
}

// Predefined structured data generators
export const generateOrganizationSchema = () => ({
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'IVolex',
  description: 'Premium leather goods crafted with attention to detail',
  url: typeof window !== 'undefined' ? window.location.origin : '',
  logo: `${typeof window !== 'undefined' ? window.location.origin : ''}/images/logo.png`,
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: '+1-555-123-4567',
    contactType: 'customer service',
    email: 'support@ivolex.com',
  },
  sameAs: [
    'https://facebook.com/ivolex',
    'https://instagram.com/ivolex',
    'https://twitter.com/ivolex',
  ],
})

export const generateProductSchema = product => ({
  '@context': 'https://schema.org',
  '@type': 'Product',
  name: product.name,
  description: product.short || product.description,
  image: `${typeof window !== 'undefined' ? window.location.origin : ''}${product.image}`,
  brand: {
    '@type': 'Brand',
    name: 'IVolex',
  },
  offers: {
    '@type': 'Offer',
    price: product.price,
    priceCurrency: 'USD',
    availability: 'https://schema.org/InStock',
  },
  aggregateRating: product.rating
    ? {
        '@type': 'AggregateRating',
        ratingValue: product.rating,
        ratingCount: 100, // This would come from your actual review data
        bestRating: 5,
        worstRating: 1,
      }
    : undefined,
})

export const generateBreadcrumbSchema = breadcrumbs => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: breadcrumbs.map((crumb, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: crumb.name,
    item: crumb.url,
  })),
})
