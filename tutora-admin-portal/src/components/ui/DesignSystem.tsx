// Tutora Design System - Consistent UI Components
import React from 'react'
import { cn } from '@/lib/utils'
import { LucideIcon } from 'lucide-react'

// Color Palette - Consistent across all components
export const colors = {
  primary: {
    50: 'bg-blue-50 text-blue-900',
    100: 'bg-blue-100 text-blue-800', 
    500: 'bg-blue-500 text-white',
    600: 'bg-blue-600 text-white',
    700: 'bg-blue-700 text-white'
  },
  secondary: {
    50: 'bg-purple-50 text-purple-900',
    100: 'bg-purple-100 text-purple-800',
    500: 'bg-purple-500 text-white',
    600: 'bg-purple-600 text-white', 
    700: 'bg-purple-700 text-white'
  },
  gradient: 'bg-gradient-to-r from-blue-600 to-purple-600',
  gradientHover: 'hover:from-blue-700 hover:to-purple-700'
}

// Button Variants - Consistent sizing and styling
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg' | 'xl'
  children: React.ReactNode
  className?: string
  icon?: LucideIcon
}

export function Button({ 
  variant = 'primary', 
  size = 'md', 
  children, 
  className, 
  icon: Icon,
  ...props 
}: ButtonProps) {
  const baseStyles = "inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
  
  const variants = {
    primary: `${colors.gradient} text-white hover:shadow-lg hover:shadow-blue-500/25 transform hover:scale-105 ${colors.gradientHover}`,
    secondary: "bg-white text-blue-600 border-2 border-blue-600 hover:bg-blue-50 hover:shadow-lg",
    outline: "bg-transparent border-2 border-gray-300 text-gray-700 hover:border-blue-600 hover:text-blue-600 hover:bg-blue-50",
    ghost: "bg-transparent text-gray-700 hover:bg-gray-100 hover:text-blue-600"
  }
  
  const sizes = {
    sm: "px-4 py-2 text-sm space-x-1",
    md: "px-6 py-3 text-base space-x-2", 
    lg: "px-8 py-4 text-lg space-x-2",
    xl: "px-10 py-5 text-xl space-x-3"
  }
  
  return (
    <button 
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      {...props}
    >
      {Icon && <Icon className="w-5 h-5" />}
      <span>{children}</span>
    </button>
  )
}

// Card Component - Consistent card styling
interface CardProps {
  children: React.ReactNode
  className?: string
  hover?: boolean
  padding?: 'sm' | 'md' | 'lg'
}

export function Card({ children, className, hover = true, padding = 'md' }: CardProps) {
  const baseStyles = "bg-white border border-gray-200 rounded-2xl"
  const hoverStyles = hover ? "hover:shadow-lg transition-all duration-200 hover:border-blue-200" : ""
  
  const paddings = {
    sm: "p-4",
    md: "p-6", 
    lg: "p-8"
  }
  
  return (
    <div className={cn(baseStyles, hoverStyles, paddings[padding], className)}>
      {children}
    </div>
  )
}

// Badge Component - Consistent badge styling  
interface BadgeProps {
  children: React.ReactNode
  variant?: 'primary' | 'secondary' | 'success' | 'warning'
  size?: 'sm' | 'md'
}

export function Badge({ children, variant = 'primary', size = 'sm' }: BadgeProps) {
  const baseStyles = "inline-flex items-center font-semibold rounded-full"
  
  const variants = {
    primary: colors.primary[100],
    secondary: colors.secondary[100], 
    success: "bg-green-100 text-green-800",
    warning: "bg-yellow-100 text-yellow-800"
  }
  
  const sizes = {
    sm: "px-2 py-1 text-xs",
    md: "px-4 py-2 text-sm"
  }
  
  return (
    <span className={cn(baseStyles, variants[variant], sizes[size])}>
      {children}
    </span>
  )
}

// Icon Container - Consistent icon backgrounds
interface IconContainerProps {
  icon: LucideIcon
  variant?: 'primary' | 'secondary'
  size?: 'sm' | 'md' | 'lg'
}

export function IconContainer({ icon: Icon, variant = 'primary', size = 'md' }: IconContainerProps) {
  const baseStyles = "flex items-center justify-center rounded-xl"
  
  const variants = {
    primary: colors.gradient,
    secondary: "bg-gray-100 text-gray-600"
  }
  
  const sizes = {
    sm: "w-8 h-8",
    md: "w-12 h-12", 
    lg: "w-16 h-16"
  }
  
  const iconSizes = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8"
  }
  
  return (
    <div className={cn(baseStyles, variants[variant], sizes[size])}>
      <Icon className={cn("text-white", iconSizes[size])} />
    </div>
  )
}

// Section Container - Consistent section spacing
interface SectionProps {
  children: React.ReactNode
  background?: 'white' | 'gray' | 'gradient'
  padding?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
}

export function Section({ children, background = 'white', padding = 'lg', className }: SectionProps) {
  const backgrounds = {
    white: "bg-white",
    gray: "bg-gray-50", 
    gradient: "bg-gradient-to-br from-blue-50 to-purple-50"
  }
  
  const paddings = {
    sm: "py-12",
    md: "py-16",
    lg: "py-24", 
    xl: "py-32"
  }
  
  return (
    <section className={cn(backgrounds[background], paddings[padding], className)}>
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {children}
      </div>
    </section>
  )
}

// Typography - Consistent text styles
export const typography = {
  h1: "text-5xl lg:text-6xl font-bold text-gray-900 leading-tight",
  h2: "text-4xl lg:text-5xl font-bold text-gray-900 leading-tight",
  h3: "text-3xl lg:text-4xl font-bold text-gray-900 leading-tight", 
  h4: "text-2xl lg:text-3xl font-bold text-gray-900 leading-tight",
  subtitle: "text-xl text-slate-600 leading-relaxed",
  body: "text-gray-600 leading-relaxed",
  small: "text-sm text-gray-500"
}

// Spacing - Consistent margins and padding
export const spacing = {
  section: "py-24",
  container: "max-w-7xl mx-auto px-6 lg:px-8",
  grid: "grid gap-6 md:gap-8",
  flex: "flex items-center space-x-4"
}
