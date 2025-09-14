'use client'

import { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { 
  Home, 
  Users, 
  Building2, 
  BarChart3, 
  Globe, 
  CreditCard, 
  Settings, 
  HelpCircle, 
  Menu, 
  X, 
  LogOut,
  User,
  Trophy,
  UserCog,
  Shield
} from 'lucide-react'
import Link from 'next/link'

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter()
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [userRole, setUserRole] = useState<string | null>(null)

  useEffect(() => {
    const role = localStorage.getItem('admin_role')
    setUserRole(role)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('admin_authenticated')
    localStorage.removeItem('admin_role')
    router.push('/')
  }

  // Navigation items based on role
  const ceoNavigation = [
    { name: 'Dashboard', href: '/admin/ceo-dashboard', icon: Home },
    { name: 'Companies', href: '/companies', icon: Building2 },
    { name: 'Analytics', href: '/analytics', icon: BarChart3 },
    { name: 'Global Reach', href: '/global-reach', icon: Globe },
    { name: 'Financials', href: '/payments', icon: CreditCard },
    { name: 'Business Settings', href: '/settings', icon: Settings },
    { name: 'Support', href: '/support', icon: HelpCircle },
  ]

  const managerNavigation = [
    { name: 'Dashboard', href: '/admin/manager-dashboard', icon: Home },
    { name: 'Team Management', href: '/admin/user-management', icon: Users },
    { name: 'Module Builder', href: '/admin/module-builder', icon: UserCog },
    { name: 'Performance', href: '/admin/performance', icon: Trophy },
    { name: 'Billing & Payments', href: '/admin/payments', icon: CreditCard },
    { name: 'Settings', href: '/admin/settings', icon: Settings },
    { name: 'Security', href: '/admin/security', icon: Shield },
    { name: 'Support', href: '/support', icon: HelpCircle },
  ]

  const navigation = userRole === 'ceo' ? ceoNavigation : managerNavigation

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        >
          <div className="fixed inset-0 bg-gray-600 bg-opacity-75"></div>
        </div>
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
          <div className="flex items-center">
            <img 
              src="/tutora_logo.png" 
              alt="Tutora" 
              className="w-8 h-8 object-contain"
            />
            <span className="ml-2 text-xl font-bold text-gray-900">Tutora</span>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-1 rounded-md text-gray-400 hover:text-gray-500"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <nav className="mt-6 px-3">
          <div className="space-y-1">
            {navigation.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    isActive
                      ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <item.icon className={`mr-3 h-5 w-5 ${isActive ? 'text-blue-700' : 'text-gray-400'}`} />
                  {item.name}
                </Link>
              )
            })}
          </div>
        </nav>

        {/* User info and logout */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
          <div className="flex items-center mb-3">
            <div className="w-8 h-8 bg-blue-50 rounded-full flex items-center justify-center">
              <img 
                src="/tutora_logo.png" 
                alt="User" 
                className="w-5 h-5 object-contain"
              />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-900">
                {userRole === 'ceo' ? 'CEO Admin' : 'Manager'}
              </p>
              <p className="text-xs text-gray-500">admin@company.com</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <LogOut className="mr-3 h-4 w-4" />
            Sign out
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col lg:ml-0">
        {/* Top bar */}
        <div className="bg-white shadow-sm border-b border-gray-200 h-16 flex items-center justify-between px-6 lg:px-8">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-500"
          >
            <Menu className="h-6 w-6" />
          </button>
          
          <div className="flex items-center space-x-4">
            <div className="hidden sm:block">
              <span className="text-sm font-medium text-gray-900">
                {userRole === 'ceo' ? 'CEO Dashboard' : 'Manager Dashboard'}
              </span>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          <div className="p-6 lg:p-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}

export default DashboardLayout 