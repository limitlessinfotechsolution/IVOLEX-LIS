import { createRoot } from 'react-dom/client'
import App from './app/App.jsx'
import './styles.css'

// Wait for DOM to be ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeApp)
} else {
  initializeApp()
}

function initializeApp() {
  const container = document.getElementById('root')
  if (container) {
    // Check if root already exists to prevent duplicate rendering
    if (!container._reactRootContainer) {
      const root = createRoot(container)
      container._reactRootContainer = root
      root.render(<App />)
    }
  } else {
    console.error('Failed to find the root element')
  }
}