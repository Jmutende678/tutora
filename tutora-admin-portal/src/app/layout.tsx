import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Toaster } from 'react-hot-toast'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'AI Employee Training Platform | Create Modules in Minutes | Tutora',
  description: 'Transform videos & documents into engaging training modules with AI. Join 500+ companies saving 60% on training costs. 57% faster creation, 92% engagement rates. Start free trial.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={inter.className}>
      <body className="bg-gray-50">
        {children}
        <Toaster position="top-right" />
      </body>
    </html>
  )
} 