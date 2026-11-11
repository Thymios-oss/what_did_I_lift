import { QueryClient } from '@tanstack/react-query'

/**
 * The app-wide TanStack Query cache for data from Supabase.
 *
 * Uses TanStack's defaults: a failed query is retried 3 times, a failed save
 * is not retried, and data is refetched when you return to the tab or app.
 */
export const queryClient = new QueryClient()
