import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts'

interface ChartData {
  name: string
  revenue: number
  users: number
  companies?: number
}

interface ChartProps {
  data: ChartData[]
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-black/80 backdrop-blur-xl border border-white/20 rounded-2xl p-4 shadow-2xl">
        <p className="font-bold text-white mb-3 text-lg">{`📊 ${label}`}</p>
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center justify-between py-1">
            <span className="text-white/80 text-sm font-medium flex items-center">
              {entry.name === 'revenue' ? '💰' : entry.name === 'users' ? '👥' : '🏢'} 
              <span className="ml-2 capitalize">{entry.name}</span>
            </span>
            <span className="font-bold text-white ml-4" style={{ color: entry.color }}>
              {entry.name === 'revenue' ? `$${entry.value?.toLocaleString()}` : entry.value?.toLocaleString()}
            </span>
          </div>
        ))}
      </div>
    )
  }
  return null
}

export default function Chart({ data }: ChartProps) {
  return (
    <div className="h-96 relative">
      {/* Background decoration with animated elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 rounded-2xl"></div>
      <div className="absolute top-4 right-4 h-20 w-20 bg-blue-400/10 rounded-full blur-2xl animate-pulse"></div>
      <div className="absolute bottom-4 left-4 h-16 w-16 bg-purple-400/10 rounded-full blur-2xl animate-pulse animation-delay-2000"></div>
      
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
          <defs>
            <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.4}/>
              <stop offset="50%" stopColor="#3B82F6" stopOpacity={0.2}/>
              <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.05}/>
            </linearGradient>
            <linearGradient id="usersGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.4}/>
              <stop offset="50%" stopColor="#8B5CF6" stopOpacity={0.2}/>
              <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0.05}/>
            </linearGradient>
            <linearGradient id="companiesGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#EC4899" stopOpacity={0.4}/>
              <stop offset="50%" stopColor="#EC4899" stopOpacity={0.2}/>
              <stop offset="95%" stopColor="#EC4899" stopOpacity={0.05}/>
            </linearGradient>
          </defs>
          <CartesianGrid 
            strokeDasharray="3 3" 
            stroke="rgba(255, 255, 255, 0.1)" 
            strokeOpacity={0.5}
          />
          <XAxis 
            dataKey="name" 
            axisLine={false}
            tickLine={false}
            tick={{ fill: 'rgba(255, 255, 255, 0.7)', fontSize: 12, fontWeight: 600 }}
          />
          <YAxis 
            axisLine={false}
            tickLine={false}
            tick={{ fill: 'rgba(255, 255, 255, 0.7)', fontSize: 12, fontWeight: 600 }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="revenue"
            stroke="#3B82F6"
            strokeWidth={4}
            fill="url(#revenueGradient)"
            dot={{ fill: '#3B82F6', strokeWidth: 3, r: 6, stroke: '#1E40AF' }}
            activeDot={{ r: 10, fill: '#3B82F6', strokeWidth: 4, stroke: '#ffffff' }}
          />
          <Area
            type="monotone"
            dataKey="users"
            stroke="#8B5CF6"
            strokeWidth={4}
            fill="url(#usersGradient)"
            dot={{ fill: '#8B5CF6', strokeWidth: 3, r: 6, stroke: '#7C3AED' }}
            activeDot={{ r: 10, fill: '#8B5CF6', strokeWidth: 4, stroke: '#ffffff' }}
          />
          {data[0]?.companies !== undefined && (
            <Area
              type="monotone"
              dataKey="companies"
              stroke="#EC4899"
              strokeWidth={4}
              fill="url(#companiesGradient)"
              dot={{ fill: '#EC4899', strokeWidth: 3, r: 6, stroke: '#DB2777' }}
              activeDot={{ r: 10, fill: '#EC4899', strokeWidth: 4, stroke: '#ffffff' }}
            />
          )}
        </AreaChart>
      </ResponsiveContainer>
      
      {/* Enhanced Legend */}
      <div className="flex items-center justify-center space-x-8 mt-6">
        <div className="flex items-center space-x-3 group cursor-pointer">
          <div className="relative">
            <div className="h-4 w-4 bg-gradient-to-r from-blue-400 to-blue-500 rounded-full shadow-lg group-hover:shadow-blue-500/50 transition-all duration-300"></div>
            <div className="absolute inset-0 h-4 w-4 bg-gradient-to-r from-blue-400 to-blue-500 rounded-full opacity-0 group-hover:opacity-30 animate-ping"></div>
          </div>
          <span className="text-sm font-semibold text-white/90 group-hover:text-white transition-colors duration-200">💰 Revenue</span>
        </div>
        <div className="flex items-center space-x-3 group cursor-pointer">
          <div className="relative">
            <div className="h-4 w-4 bg-gradient-to-r from-purple-400 to-purple-500 rounded-full shadow-lg group-hover:shadow-purple-500/50 transition-all duration-300"></div>
            <div className="absolute inset-0 h-4 w-4 bg-gradient-to-r from-purple-400 to-purple-500 rounded-full opacity-0 group-hover:opacity-30 animate-ping"></div>
          </div>
          <span className="text-sm font-semibold text-white/90 group-hover:text-white transition-colors duration-200">👥 Users</span>
        </div>
        {data[0]?.companies !== undefined && (
          <div className="flex items-center space-x-3 group cursor-pointer">
            <div className="relative">
              <div className="h-4 w-4 bg-gradient-to-r from-pink-400 to-pink-500 rounded-full shadow-lg group-hover:shadow-pink-500/50 transition-all duration-300"></div>
              <div className="absolute inset-0 h-4 w-4 bg-gradient-to-r from-pink-400 to-pink-500 rounded-full opacity-0 group-hover:opacity-30 animate-ping"></div>
            </div>
            <span className="text-sm font-semibold text-white/90 group-hover:text-white transition-colors duration-200">🏢 Companies</span>
          </div>
        )}
      </div>
    </div>
  )
} 