import { createRoot } from 'react-dom/client'
import App from './app/App.jsx'
import './styles.css'

const container = document.getElementById('root')
if (container) {
  const root = createRoot(container)
  root.render(<App />)
} else {
  console.error('Failed to find the root element')
}

// Wait for DOM to be ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeApp)
} else {
  initializeApp()
}

function initializeApp() {
  const container = document.getElementById('root')
  if (container) {
    const root = createRoot(container)
    root.render(<App />)
  } else {
    console.error('Failed to find the root element')
  }
}