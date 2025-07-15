import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts'

interface ChartProps {
  data: any[]
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-lg">
        <p className="font-bold text-gray-900 mb-3 text-lg">{label}</p>
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center justify-between py-1">
            <span className="text-gray-600 text-sm font-medium flex items-center">
              <span className="capitalize">{entry.name}</span>
            </span>
            <span className="font-bold text-gray-900 ml-4" style={{ color: entry.color }}>
              {entry.value}
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
      <div className="absolute inset-0 bg-white rounded-lg border border-gray-200"></div>
      
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
            stroke="#E5E7EB" 
            strokeOpacity={0.8}
          />
          <XAxis 
            dataKey="month" 
            stroke="#6B7280" 
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <YAxis 
            stroke="#6B7280" 
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `${value}`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="revenue"
            stroke="#3B82F6"
            fillOpacity={1}
            fill="url(#revenueGradient)"
          />
          <Area
            type="monotone"
            dataKey="users"
            stroke="#8B5CF6"
            fillOpacity={1}
            fill="url(#usersGradient)"
          />
          <Area
            type="monotone"
            dataKey="companies"
            stroke="#EC4899"
            fillOpacity={1}
            fill="url(#companiesGradient)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
} 