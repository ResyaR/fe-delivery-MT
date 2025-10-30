import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import { Analytics } from '@vercel/analytics/next'
import { ThemeProvider } from "next-themes"
import { AuthProvider } from '@/lib/authContext'
import { CartProvider } from '@/lib/cartContext'
import { ToastProvider } from '@/components/common/ToastProvider'
import AuthGuard from '@/components/auth/AuthGuard'
import TokenRefreshIndicator from '@/components/common/TokenRefreshIndicator'
import "./globals.css"

export const metadata = {
  title: 'MT Trans - Jasa Pengantaran Cepat & Terpercaya',
  description: 'MT Trans - Pengiriman cepat, aman, dan terpercaya untuk semua kebutuhan Anda.'
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`} suppressHydrationWarning>
      <head>
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
      <body className={`${GeistSans.className} bg-white min-h-screen`}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
          <AuthProvider>
            <CartProvider>
              <ToastProvider>
                <AuthGuard>
                  <div className="relative min-h-screen bg-white">
                    {children}
                    <Analytics />
                    <TokenRefreshIndicator />
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
