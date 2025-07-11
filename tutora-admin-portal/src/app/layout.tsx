import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Toaster } from 'react-hot-toast'
import DashboardLayout from '@/components/DashboardLayout'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Tutora Admin Portal',
  description: 'Manage your Tutora learning platform',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <DashboardLayout>
          {children}
        </DashboardLayout>
        <Toaster position="top-right" />
      </body>
    </html>
  )
} 