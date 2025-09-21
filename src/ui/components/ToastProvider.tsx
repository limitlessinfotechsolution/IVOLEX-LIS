import { toast, Toaster, ToastPosition } from 'react-hot-toast'

// Toast configuration
const toastConfig = {
  duration: 4000,
  position: 'top-right' as ToastPosition,
  style: {
    background: '#fff',
    color: '#374151',
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    border: '1px solid #e5e7eb',
    borderRadius: '0.75rem',
  },
}

// Toast functions
export const showSuccess = (message: string) => {
  toast.success(message, {
    duration: toastConfig.duration,
    style: toastConfig.style,
    iconTheme: {
      primary: '#059669',
      secondary: '#ffffff',
    },
  })
}

export const showError = (message: string) => {
  toast.error(message, {
    duration: toastConfig.duration,
    style: toastConfig.style,
    iconTheme: {
      primary: '#dc2626',
      secondary: '#ffffff',
    },
  })
}

export const showInfo = (message: string) => {
  toast(message, {
    duration: toastConfig.duration,
    style: toastConfig.style,
    icon: 'ℹ️',
  })
}

export const showLoading = (message: string) => {
  return toast.loading(message, {
    duration: toastConfig.duration,
    style: toastConfig.style,
  })
}

export const dismissToast = (toastId: string) => {
  toast.dismiss(toastId)
}

// Toast Provider Component
export default function ToastProvider() {
  return (
    <Toaster
      position={toastConfig.position}
      toastOptions={{
        duration: toastConfig.duration,
        style: toastConfig.style,
      }}
      reverseOrder={false}
    />
  )
}