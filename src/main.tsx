import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from '@tanstack/react-router'
import { router } from './router'
import './index.css'

// Register Service Worker for PWA
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    const swPath = '/carcare/service-worker.js'
    navigator.serviceWorker
      .register(swPath)
      .then((registration) => {
        console.log('ServiceWorker registered:', registration.scope)
      })
      .catch((error) => {
        console.log('ServiceWorker registration failed:', error)
      })
  })
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
