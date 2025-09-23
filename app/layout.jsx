import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import { Analytics } from '@vercel/analytics/next'
import { ThemeProvider } from "next-themes"
import { AuthProvider } from '@/lib/authContext'
import AuthGuard from '@/components/auth/AuthGuard'
import "./globals.css"

export const metadata = {
  title: 'Delivery App',
  description: 'FE DELIVERY MT'
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`} suppressHydrationWarning>
      <body className={`${GeistSans.className} bg-white min-h-screen`}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
          <AuthProvider>
            <AuthGuard>
              <div className="relative min-h-screen bg-white">
                {children}
                <Analytics />
              </div>
            </AuthGuard>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
