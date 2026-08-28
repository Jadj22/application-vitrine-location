import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { SelectionProvider } from '@/lib/selection-context'
import { Toaster } from 'sonner'
import './globals.css'
export const metadata: Metadata = { title: { default: 'dodome — Louez mieux, simplement.', template: '%s — dodome' }, description: 'La vitrine simple et élégante pour les professionnels de la location.', generator: 'v0.app' }
export const viewport: Viewport = { colorScheme: 'light', themeColor: '#f7f8f5' }
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="fr" className="bg-background"><body suppressHydrationWarning className="antialiased"><SelectionProvider>{children}</SelectionProvider><Toaster position="top-right" richColors theme="system" /></body></html> }
