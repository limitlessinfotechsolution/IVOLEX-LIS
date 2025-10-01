import { Outlet } from 'react-router-dom'
import SkipToContent from '../components/common/SkipToContent.jsx'
import ToastProvider from '../components/common/ToastProvider'

export default function MinimalLayout() {
  return (
    <div className="min-h-screen w-full h-full transition-all duration-500 flex flex-col">
      <SkipToContent />
      <main
        id="main"
        className="w-full flex-grow min-w-0 pt-0 pb-0"
      >
        <Outlet />
      </main>
      <ToastProvider />
    </div>
  )
}