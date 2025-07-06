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
    { name: 'Dashboard', href: '/', icon: LayoutDashboard, current: pathname === '/', color: 'blue' },
    { name: 'Companies', href: '/companies', icon: Building2, current: pathname === '/companies', color: 'purple' },
    { name: 'Users', href: '/users', icon: Users, current: pathname === '/users', color: 'green' },
    { name: 'Payments', href: '/payments', icon: CreditCard, current: pathname === '/payments', color: 'orange' },
    { name: 'Settings', href: '/settings', icon: Settings, current: pathname === '/settings', color: 'gray' },
    { name: 'Support', href: '/support', icon: HelpCircle, current: pathname === '/support', color: 'pink' },
  ]

  return (
    <>
      {/* Global styling for all pages */}
      <style jsx global>{`
        body {
          background: linear-gradient(135deg, #0f172a 0%, #581c87 25%, #7c2d12 50%, #581c87 75%, #0f172a 100%) !important;
          background-size: 400% 400% !important;
          animation: gradientShift 15s ease infinite !important;
          color: white !important;
          margin: 0 !important;
          padding: 0 !important;
          overflow-x: hidden !important;
        }
        
        @keyframes gradientShift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        
        .premium-sidebar {
          background: rgba(0, 0, 0, 0.4) !important;
          backdrop-filter: blur(20px) !important;
          border-right: 1px solid rgba(255, 255, 255, 0.1) !important;
        }
        
        .premium-nav-item {
          background: rgba(255, 255, 255, 0.05) !important;
          border: 1px solid rgba(255, 255, 255, 0.1) !important;
          backdrop-filter: blur(10px) !important;
          transition: all 0.3s ease !important;
        }
        
        .premium-nav-item:hover {
          background: rgba(255, 255, 255, 0.15) !important;
          transform: translateX(4px) scale(1.02) !important;
          border-color: rgba(255, 255, 255, 0.3) !important;
        }
        
        .premium-nav-item.active {
          background: linear-gradient(135deg, rgba(59, 130, 246, 0.3), rgba(139, 92, 246, 0.3)) !important;
          border-color: rgba(59, 130, 246, 0.5) !important;
          box-shadow: 0 0 20px rgba(59, 130, 246, 0.3) !important;
        }
        
        .premium-topbar {
          background: rgba(0, 0, 0, 0.3) !important;
          backdrop-filter: blur(20px) !important;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1) !important;
        }
        
        .premium-content {
          background: transparent !important;
        }
        
        .floating-orb {
          position: fixed;
          border-radius: 50%;
          pointer-events: none;
          z-index: 1;
        }
        
        .orb-1 {
          top: 10%;
          left: 5%;
          width: 300px;
          height: 300px;
          background: radial-gradient(circle, rgba(59, 130, 246, 0.15) 0%, transparent 70%);
          animation: float 8s ease-in-out infinite;
        }
        
        .orb-2 {
          top: 60%;
          right: 10%;
          width: 250px;
          height: 250px;
          background: radial-gradient(circle, rgba(139, 92, 246, 0.15) 0%, transparent 70%);
          animation: float 10s ease-in-out infinite reverse;
        }
        
        .orb-3 {
          bottom: 10%;
          left: 20%;
          width: 200px;
          height: 200px;
          background: radial-gradient(circle, rgba(16, 185, 129, 0.15) 0%, transparent 70%);
          animation: float 12s ease-in-out infinite;
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
      `}</style>

      {/* Floating background orbs */}
      <div className="floating-orb orb-1" />
      <div className="floating-orb orb-2" />
      <div className="floating-orb orb-3" />

      <div className="h-screen flex overflow-hidden relative">
        {/* Mobile menu */}
        <div className={`fixed inset-0 flex z-40 md:hidden ${sidebarOpen ? '' : 'hidden'}`}>
          <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
          <div className="relative flex-1 flex flex-col max-w-xs w-full premium-sidebar">
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
        <div className="flex flex-col w-0 flex-1 overflow-hidden relative z-10">
          {/* Top bar */}
          <div className="premium-topbar relative z-10 flex-shrink-0 flex h-20">
            <button
              className="px-4 border-r border-white/10 text-gray-300 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 md:hidden hover:text-white transition-colors"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="h-6 w-6" />
            </button>
            <div className="flex-1 px-6 flex justify-between items-center">
              <div className="flex-1 flex max-w-lg">
                <div className="w-full flex md:ml-0">
                  <label htmlFor="search-field" className="sr-only">Search</label>
                  <div className="relative w-full text-gray-400 focus-within:text-gray-200">
                    <div className="absolute inset-y-0 left-0 flex items-center pointer-events-none pl-4">
                      <Search className="h-5 w-5" />
                    </div>
                    <input
                      id="search-field"
                      className="block w-full h-12 pl-12 pr-4 py-2 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-sm transition-all duration-200"
                      placeholder="Search companies, users, or payments..."
                      type="search"
                      style={{
                        background: 'rgba(255, 255, 255, 0.1)',
                        backdropFilter: 'blur(10px)'
                      }}
                    />
                  </div>
                </div>
              </div>
              <div className="ml-4 flex items-center md:ml-6 space-x-4">
                {/* Notifications */}
                <div className="relative">
                  <button 
                    className="relative p-2 rounded-2xl text-gray-300 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
                    style={{
                      background: 'rgba(255, 255, 255, 0.1)',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255, 255, 255, 0.1)'
                    }}
                  >
                    <Bell className="h-6 w-6" />
                    <span 
                      className="absolute -top-1 -right-1 h-5 w-5 rounded-full flex items-center justify-center"
                      style={{
                        background: 'linear-gradient(135deg, #ec4899, #f59e0b)',
                        boxShadow: '0 0 10px rgba(236, 72, 153, 0.5)'
                      }}
                    >
                      <span className="text-white text-xs font-bold">3</span>
                    </span>
                  </button>
                </div>
                
                {/* User menu */}
                <div className="relative">
                  <button 
                    className="flex items-center space-x-3 rounded-2xl p-2 transition-all duration-200 group"
                    style={{
                      background: 'rgba(255, 255, 255, 0.1)',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255, 255, 255, 0.1)'
                    }}
                  >
                    <div className="flex-shrink-0">
                      <div 
                        className="h-10 w-10 rounded-xl flex items-center justify-center shadow-lg"
                        style={{
                          background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                          boxShadow: '0 0 15px rgba(59, 130, 246, 0.4)'
                        }}
                      >
                        <span className="text-white text-sm font-bold">A</span>
                      </div>
                    </div>
                    <div className="hidden md:block text-left">
                      <div className="text-sm font-semibold text-white">Admin User</div>
                      <div className="text-xs text-gray-300">admin@tutora.com</div>
                    </div>
                    <ChevronDown className="h-4 w-4 text-gray-300 group-hover:text-white transition-colors duration-200" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Main content area */}
          <main className="flex-1 relative overflow-y-auto focus:outline-none premium-content">
            {children}
          </main>
        </div>
      </div>
    </>
  )
}

function SidebarContent({ navigation }: { navigation: any[] }) {
  return (
    <div className="flex flex-col h-full premium-sidebar">
      {/* Logo */}
      <div 
        className="flex items-center h-20 flex-shrink-0 px-6 relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.3), rgba(139, 92, 246, 0.3))',
          border: '1px solid rgba(255, 255, 255, 0.2)'
        }}
      >
        <div className="flex items-center relative z-10">
          <div className="flex-shrink-0">
            <div 
              className="h-10 w-10 rounded-xl flex items-center justify-center shadow-lg"
              style={{
                background: 'rgba(255, 255, 255, 0.2)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                boxShadow: '0 0 15px rgba(255, 255, 255, 0.2)'
              }}
            >
              <Sparkles className="h-6 w-6 text-white" />
            </div>
          </div>
          <div className="ml-3">
            <div className="text-white text-xl font-bold tracking-tight">Tutora</div>
            <div className="text-white/80 text-sm font-medium">Admin Portal</div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 flex flex-col overflow-y-auto px-4 py-6">
        <nav className="flex-1 space-y-3">
          {navigation.map((item, index) => (
            <Link
              key={item.name}
              href={item.href}
              className={`premium-nav-item ${item.current ? 'active' : ''} group flex items-center px-4 py-3 text-sm font-medium rounded-2xl`}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div 
                className="p-2 rounded-xl mr-4 transition-all duration-200"
                style={{
                  background: item.current 
                    ? 'rgba(255, 255, 255, 0.2)' 
                    : `rgba(255, 255, 255, 0.1)`
                }}
              >
                <item.icon
                  className="h-5 w-5 text-white"
                />
              </div>
              <span className="font-semibold text-white">{item.name}</span>
              {item.current && (
                <div className="ml-auto">
                  <div 
                    className="h-2 w-2 rounded-full"
                    style={{
                      background: '#3b82f6',
                      boxShadow: '0 0 8px #3b82f6',
                      animation: 'pulse 2s infinite'
                    }}
                  />
                </div>
              )}
            </Link>
          ))}
        </nav>
      </div>

      {/* User menu */}
      <div className="flex-shrink-0 border-t border-white/10 p-4">
        <button 
          className="flex items-center text-sm text-gray-300 hover:text-white w-full p-3 rounded-2xl transition-all duration-200 group"
          style={{
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}
        >
          <div 
            className="p-2 rounded-xl mr-3 transition-colors duration-200"
            style={{
              background: 'rgba(239, 68, 68, 0.2)'
            }}
          >
            <LogOut className="h-4 w-4 text-red-400" />
          </div>
          <span className="font-medium">Sign out</span>
        </button>
      </div>
    </div>
  )
} 