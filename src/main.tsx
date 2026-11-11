import { QueryClientProvider } from '@tanstack/react-query'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { queryClient } from './lib/queryClient.ts'

/**
 * Entry point, loaded by `index.html`: mounts the app into its `#root` element.
 *
 * - `StrictMode` runs extra checks in development (it renders twice on purpose).
 * - `QueryClientProvider` gives every component access to the shared cache.
 */
const rootElement = document.getElementById('root')
if (!rootElement) {
  throw new Error('Missing #root element in index.html')
}

createRoot(rootElement).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </StrictMode>,
)
