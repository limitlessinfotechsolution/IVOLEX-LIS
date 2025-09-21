const DomainInfo = () => {
  return (
    <div className="bg-stone-100 border border-stone-200 rounded-lg p-4 mb-6">
      <h3 className="text-lg font-semibold text-stone-800 mb-2">
        Domain Information
      </h3>
      <div className="space-y-1 text-sm text-stone-600">
        <p>
          <span className="font-medium">Primary Domain:</span>{' '}
          <a
            href="https://ivolex.com"
            className="text-brand-600 hover:underline"
          >
            https://ivolex.com
          </a>
        </p>
        <p>
          <span className="font-medium">Vercel Domain:</span>{' '}
          <a
            href="https://ivolex.vercel.com"
            className="text-brand-600 hover:underline"
          >
            https://ivolex.vercel.com
          </a>
        </p>
        <p>
          <span className="font-medium">Developed by:</span> Limitless Infotech
          Solution Pvt Ltd.
        </p>
      </div>
    </div>
  )
}

export default DomainInfo
