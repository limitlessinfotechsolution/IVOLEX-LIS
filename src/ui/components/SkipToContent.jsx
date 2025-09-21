export default function SkipToContent() {
  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 bg-brand-500 text-white px-3 py-2 rounded z-50"
        aria-label="Skip to main content"
      >
        Skip to main content
      </a>
      <a
        href="#navigation"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-20 bg-brand-500 text-white px-3 py-2 rounded z-50"
        aria-label="Skip to navigation"
      >
        Skip to navigation
      </a>
    </>
  )
}
