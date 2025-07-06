import { ReactNode } from 'react'

interface StatsCardProps {
  title: string
  value: string
  icon: ReactNode
  trend?: number
  trendIcon?: ReactNode
  trendColor?: string
  gradientFrom?: string
  gradientTo?: string
  iconBg?: string
  description?: string
}

export default function StatsCard({ 
  title, 
  value, 
  icon, 
  trend, 
  trendIcon, 
  trendColor = 'text-white/70',
  gradientFrom = 'from-blue-500',
  gradientTo = 'to-purple-600',
  iconBg = 'bg-blue-500',
  description
}: StatsCardProps) {
  return (
    <div className="group relative bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6 hover:bg-white/15 transition-all duration-300 hover:scale-105 shadow-glass hover:shadow-glass-lg">
      {/* Background glow effect */}
      <div className={`absolute inset-0 bg-gradient-to-br ${gradientFrom} ${gradientTo} rounded-3xl opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
      
      {/* Top section with icon */}
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4">
          <div className={`p-4 rounded-2xl bg-gradient-to-br ${gradientFrom} ${gradientTo} shadow-lg group-hover:scale-110 transition-transform duration-300 group-hover:shadow-2xl`}>
            <div className="text-white">
              {icon}
            </div>
          </div>
          {trend !== undefined && (
            <div className={`flex items-center px-3 py-2 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 ${trendColor} group-hover:bg-white/20 transition-all duration-300`}>
              <div className="mr-1">
                {trendIcon}
              </div>
              <span className="text-sm font-bold">
                {trend > 0 ? '+' : ''}{trend}%
              </span>
            </div>
          )}
        </div>

        {/* Stats content */}
        <div className="space-y-3">
          <p className="text-sm font-semibold text-white/70 uppercase tracking-wider">{title}</p>
          <p className="text-4xl font-bold text-white tracking-tight group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:bg-clip-text group-hover:from-white group-hover:to-blue-200 transition-all duration-300">{value}</p>
          {description && (
            <p className="text-sm text-white/60 font-medium">{description}</p>
          )}
        </div>

        {/* Progress bar effect */}
        <div className="mt-6 h-2 w-full bg-white/10 rounded-full overflow-hidden">
          <div className={`h-full bg-gradient-to-r ${gradientFrom} ${gradientTo} rounded-full w-0 group-hover:w-full transition-all duration-1000 ease-out shadow-lg`}></div>
        </div>
      </div>

      {/* Floating decorative elements */}
      <div className="absolute -top-2 -right-2 h-20 w-20 bg-gradient-to-br from-white/5 to-transparent rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-pulse"></div>
      <div className="absolute -bottom-3 -left-3 h-16 w-16 bg-gradient-to-br from-white/5 to-transparent rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-pulse animation-delay-200"></div>
      
      {/* Inner glow */}
      <div className={`absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-20 transition-opacity duration-300 shadow-inner`}></div>
    </div>
  )
} 