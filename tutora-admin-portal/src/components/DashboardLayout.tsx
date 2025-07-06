'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  LayoutDashboard, 
  Building2, 
  Users, 
  CreditCard, 
  Settings, 
  HelpCircle,
  Menu,
  X,
  LogOut,
  Bell,
  Search,
  Sparkles,
  ChevronDown
} from 'lucide-react'

interface DashboardLayoutProps {
  children: React.ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()

  const navigation = [
    { name: 'Dashboard', href: '/', icon: LayoutDashboard, current: pathname === '/', color: 'tutora-blue' },
    { name: 'Companies', href: '/companies', icon: Building2, current: pathname === '/companies', color: 'tutora-purple' },
    { name: 'Users', href: '/users', icon: Users, current: pathname === '/users', color: 'tutora-green' },
    { name: 'Payments', href: '/payments', icon: CreditCard, current: pathname === '/payments', color: 'tutora-orange' },
    { name: 'Settings', href: '/settings', icon: Settings, current: pathname === '/settings', color: 'gray-600' },
    { name: 'Support', href: '/support', icon: HelpCircle, current: pathname === '/support', color: 'tutora-pink' },
  ]

  return (
    <div className="h-screen flex overflow-hidden bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
      {/* Mobile menu */}
      <div className={`fixed inset-0 flex z-40 md:hidden ${sidebarOpen ? '' : 'hidden'}`}>
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
        <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white shadow-2xl">
          <div className="absolute top-0 right-0 -mr-12 pt-2">
            <button
              className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white bg-white bg-opacity-20 backdrop-blur-sm"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-6 w-6 text-white" />
            </button>
          </div>
          <SidebarContent navigation={navigation} />
        </div>
      </div>

      {/* Static sidebar for desktop */}
      <div className="hidden md:flex md:flex-shrink-0">
        <div className="flex flex-col w-72">
          <SidebarContent navigation={navigation} />
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-col w-0 flex-1 overflow-hidden">
        {/* Top bar */}
        <div className="relative z-10 flex-shrink-0 flex h-20 bg-white/80 backdrop-blur-md shadow-lg border-b border-white/20">
          <button
            className="px-4 border-r border-gray-200 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-tutora-blue md:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </button>
          <div className="flex-1 px-6 flex justify-between items-center">
            <div className="flex-1 flex max-w-lg">
              <div className="w-full flex md:ml-0">
                <label htmlFor="search-field" className="sr-only">Search</label>
                <div className="relative w-full text-gray-400 focus-within:text-gray-600">
                  <div className="absolute inset-y-0 left-0 flex items-center pointer-events-none pl-4">
                    <Search className="h-5 w-5" />
                  </div>
                  <input
                    id="search-field"
                    className="block w-full h-12 pl-12 pr-4 py-2 bg-gray-50/50 border border-gray-200/50 rounded-2xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-tutora-blue focus:border-transparent backdrop-blur-sm transition-all duration-200"
                    placeholder="Search companies, users, or payments..."
                    type="search"
                  />
                </div>
              </div>
            </div>
            <div className="ml-4 flex items-center md:ml-6 space-x-4">
              {/* Notifications */}
              <div className="relative">
                <button className="relative bg-white/50 backdrop-blur-sm p-2 rounded-2xl text-gray-600 hover:text-tutora-blue focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-tutora-blue transition-all duration-200 hover:bg-white/80">
                  <Bell className="h-6 w-6" />
                  <span className="absolute -top-1 -right-1 h-5 w-5 bg-gradient-to-r from-tutora-pink to-tutora-orange rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">3</span>
                  </span>
                </button>
              </div>
              
              {/* User menu */}
              <div className="relative">
                <button className="flex items-center space-x-3 bg-white/50 backdrop-blur-sm rounded-2xl p-2 hover:bg-white/80 transition-all duration-200 group">
                  <div className="flex-shrink-0">
                    <div className="h-10 w-10 rounded-xl bg-gradient-to-r from-tutora-blue to-tutora-purple flex items-center justify-center shadow-lg">
                      <span className="text-white text-sm font-bold">A</span>
                    </div>
                  </div>
                  <div className="hidden md:block text-left">
                    <div className="text-sm font-semibold text-gray-800">Admin User</div>
                    <div className="text-xs text-gray-500">admin@tutora.com</div>
                  </div>
                  <ChevronDown className="h-4 w-4 text-gray-400 group-hover:text-gray-600 transition-colors duration-200" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Main content area */}
        <main className="flex-1 relative overflow-y-auto focus:outline-none">
          <div className="py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              <div className="animate-fade-in">
                {children}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

function SidebarContent({ navigation }: { navigation: any[] }) {
  return (
    <div className="flex flex-col h-full bg-white/95 backdrop-blur-xl shadow-2xl border-r border-white/20">
      {/* Logo */}
      <div className="flex items-center h-20 flex-shrink-0 px-6 bg-gradient-to-r from-tutora-blue via-tutora-purple to-tutora-pink relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-tutora-blue/90 to-tutora-purple/90"></div>
        <div className="flex items-center relative z-10">
          <div className="flex-shrink-0">
            <div className="h-10 w-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-lg border border-white/30">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
          </div>
          <div className="ml-3">
            <div className="text-white text-xl font-bold tracking-tight">Tutora</div>
            <div className="text-white/80 text-sm font-medium">Admin Portal</div>
          </div>
        </div>
        {/* Decorative elements */}
        <div className="absolute -right-4 -top-4 h-24 w-24 bg-white/10 rounded-full"></div>
        <div className="absolute -right-8 -bottom-8 h-32 w-32 bg-white/5 rounded-full"></div>
      </div>

      {/* Navigation */}
      <div className="flex-1 flex flex-col overflow-y-auto px-4 py-6">
        <nav className="flex-1 space-y-2">
          {navigation.map((item, index) => (
            <Link
              key={item.name}
              href={item.href}
              className={`group flex items-center px-4 py-3 text-sm font-medium rounded-2xl transition-all duration-200 hover:scale-105 ${
                item.current
                  ? 'bg-gradient-to-r from-tutora-blue to-tutora-purple text-white shadow-lg shadow-tutora-blue/25'
                  : 'text-gray-700 hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 hover:text-gray-900'
              }`}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className={`p-2 rounded-xl mr-4 ${
                item.current 
                  ? 'bg-white/20' 
                  : `bg-${item.color}/10 group-hover:bg-${item.color}/20`
              } transition-all duration-200`}>
                <item.icon
                  className={`h-5 w-5 ${
                    item.current ? 'text-white' : `text-${item.color} group-hover:text-${item.color}`
                  }`}
                />
              </div>
              <span className="font-semibold">{item.name}</span>
              {item.current && (
                <div className="ml-auto">
                  <div className="h-2 w-2 bg-white rounded-full animate-pulse"></div>
                </div>
              )}
            </Link>
          ))}
        </nav>
      </div>

      {/* User menu */}
      <div className="flex-shrink-0 border-t border-gray-200/50 p-4">
        <button className="flex items-center text-sm text-gray-600 hover:text-gray-900 w-full p-3 rounded-2xl hover:bg-gray-50 transition-all duration-200 group">
          <div className="p-2 rounded-xl bg-red-50 group-hover:bg-red-100 transition-colors duration-200 mr-3">
            <LogOut className="h-4 w-4 text-red-500" />
          </div>
          <span className="font-medium">Sign out</span>
        </button>
      </div>
    </div>
  )
} 