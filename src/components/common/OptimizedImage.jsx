import { useState, useRef, useEffect } from 'react'

export default function OptimizedImage({
  src,
  alt,
  width,
  height,
  className = '',
  loading = 'lazy',
  quality = 80,
  ...props
}) {
  const [isLoaded, setIsLoaded] = useState(false)
  const [isInView, setIsInView] = useState(false)
  const [hasError, setHasError] = useState(false)
  const imgRef = useRef(null)

  // Intersection Observer for lazy loading
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true)
          observer.disconnect()
        }
      },
      { threshold: 0.1 }
    )

    if (imgRef.current) {
      observer.observe(imgRef.current)
    }

    return () => observer.disconnect()
  }, [])

  // Generate responsive image sources
  const getOptimizedSrc = (originalSrc, _width, _quality) => {
    // In a real app, you'd integrate with a service like Cloudinary, ImageKit, or Next.js Image
    // For now, return the original src
    return originalSrc
  }

  const generateSrcSet = originalSrc => {
    const sizes = [480, 768, 1024, 1280]
    return sizes
      .map(size => `${getOptimizedSrc(originalSrc, size, quality)} ${size}w`)
      .join(', ')
  }

  const handleLoad = () => {
    setIsLoaded(true)
  }

  const handleError = () => {
    setHasError(true)
  }

  // Placeholder while loading
  const placeholder = (
    <div
      className={`bg-gray-200 animate-pulse flex items-center justify-center ${className}`}
      style={{ width: width || '100%', height: height || 'auto' }}
    >
      <svg
        className="w-8 h-8 text-gray-400"
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path
          fillRule="evenodd"
          d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
          clipRule="evenodd"
        />
      </svg>
    </div>
  )

  // Error fallback
  if (hasError) {
    return (
      <div
        className={`bg-gray-100 flex items-center justify-center ${className}`}
        style={{ width: width || '100%', height: height || 'auto' }}
      >
        <span className="text-gray-500 text-sm">Image failed to load</span>
      </div>
    )
  }

  return (
    <div ref={imgRef} className="relative">
      {(!isLoaded || !isInView) && placeholder}
      {isInView && (
        <img
          src={src}
          alt={alt}
          width={width}
          height={height}
          loading={loading}
          srcSet={generateSrcSet(src)}
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className={`transition-opacity duration-300 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          } ${className}`}
          onLoad={handleLoad}
          onError={handleError}
          {...props}
        />
      )}
    </div>
  )
}
