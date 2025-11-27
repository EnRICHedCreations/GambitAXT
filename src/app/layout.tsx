import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Link from 'next/link'
import './globals.css'
import { Toaster } from '@/components/ui/toaster'
import { Home, Users, Upload } from 'lucide-react'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Wholesale Real Estate CRM',
  description: 'Manage your wholesale real estate leads',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen flex flex-col">
          <header className="border-b">
            <div className="container mx-auto px-4 py-4">
              <div className="flex items-center justify-between">
                <Link href="/" className="text-2xl font-bold">
                  Gambit Real Estate CRM
                </Link>
                <nav className="flex gap-6">
                  <Link
                    href="/"
                    className="flex items-center gap-2 text-sm font-medium hover:text-primary"
                  >
                    <Home className="h-4 w-4" />
                    Dashboard
                  </Link>
                  <Link
                    href="/leads"
                    className="flex items-center gap-2 text-sm font-medium hover:text-primary"
                  >
                    <Users className="h-4 w-4" />
                    Leads
                  </Link>
                  <Link
                    href="/leads/import"
                    className="flex items-center gap-2 text-sm font-medium hover:text-primary"
                  >
                    <Upload className="h-4 w-4" />
                    Import
                  </Link>
                </nav>
              </div>
            </div>
          </header>
          <main className="flex-1 container mx-auto px-4 py-8">
            {children}
          </main>
          <footer className="border-t py-6 text-center text-sm text-muted-foreground">
            <p>&copy; {new Date().getFullYear()} Gambit Real Estate CRM. All rights reserved.</p>
          </footer>
        </div>
        <Toaster />
      </body>
    </html>
  )
}
