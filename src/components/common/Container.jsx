export default function Container({ children, className = '' }) {
  return (
    <div
      className={`mx-auto w-full h-full max-w-7xl px-4 sm:px-6 lg:px-8 ${className}`}
    >
      {children}
    </div>
  )
}
