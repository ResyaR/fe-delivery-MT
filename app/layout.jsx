import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import { Analytics } from '@vercel/analytics/next'
import { ThemeProvider } from "next-themes"
import { AuthProvider } from '@/lib/authContext'
import { CartProvider } from '@/lib/cartContext'
import { ToastProvider } from '@/components/common/ToastProvider'
import AuthGuard from '@/components/auth/AuthGuard'
import TokenRefreshIndicator from '@/components/common/TokenRefreshIndicator'
import InstallPrompt from '@/components/common/InstallPrompt'
import OfflineIndicator from '@/components/common/OfflineIndicator'
import IndexedDBInit from '@/components/common/IndexedDBInit'
import "./globals.css"

export const metadata = {
  title: 'MT Trans - Jasa Pengantaran Cepat & Terpercaya',
  description: 'MT Trans - Pengiriman cepat, aman, dan terpercaya untuk semua kebutuhan Anda.'
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`} suppressHydrationWarning>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="192x192" href="/icon-192x192.png" />
        <link rel="icon" type="image/png" sizes="512x512" href="/icon-512x512.png" />
        <meta name="theme-color" content="#E00000" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="MT Trans" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      <link
        href="https://fonts.googleapis.com/css2?display=swap&family=Poppins:wght@400;500;600;700;800&family=Inter:wght@400;500;700;900"
        rel="stylesheet"
      />
        <link 
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined" 
          rel="stylesheet" 
        />
      </head>
      <body className={`${GeistSans.className} bg-white min-h-screen overflow-x-hidden`}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
          <AuthProvider>
            <CartProvider>
              <ToastProvider>
                <AuthGuard>
                  <div className="relative min-h-screen bg-white overflow-x-hidden w-full">
                    <IndexedDBInit />
                    <OfflineIndicator />
                    {children}
                    <Analytics />
                    <TokenRefreshIndicator />
                    <InstallPrompt />
                  </div>
                </AuthGuard>
              </ToastProvider>
            </CartProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
