"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useState, useEffect } from "react"

interface WeatherData {
  current: {
    temperature: number
    humidity: number
    windSpeed: number
    windDirection: number
    weatherCode: number
    pressure: number
    visibility: number
    uvIndex: number
    feelsLike: number
  }
  hourly: {
    time: string[]
    temperature: number[]
    humidity: number[]
    precipitation: number[]
    windSpeed: number[]
    weatherCode: number[]
  }
  daily: {
    time: string[]
    temperatureMax: number[]
    temperatureMin: number[]
    weatherCode: number[]
    precipitation: number[]
    windSpeed: number[]
  }
}

interface WeatherChartProps {
  weatherData: WeatherData
}

// Simple SVG Chart Component
const SimpleLineChart = ({
  data,
  width = 800,
  height = 300,
  color = "#3b82f6",
  label = "Value",
  unit = "",
}: {
  data: { x: string; y: number }[]
  width?: number
  height?: number
  color?: string
  label?: string
  unit?: string
}) => {
  if (!data || data.length === 0) return <div>No data available</div>

  const padding = 60
  const chartWidth = width - padding * 2
  const chartHeight = height - padding * 2

  const maxY = Math.max(...data.map((d) => d.y))
  const minY = Math.min(...data.map((d) => d.y))
  const rangeY = maxY - minY || 1

  const points = data
    .map((d, i) => {
      const x = padding + (i / (data.length - 1)) * chartWidth
      const y = padding + ((maxY - d.y) / rangeY) * chartHeight
      return `${x},${y}`
    })
    .join(" ")

  return (
    <div className="w-full overflow-x-auto">
      <svg width={width} height={height} className="border rounded-lg bg-white">
        {/* Grid lines */}
        <defs>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#e5e7eb" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />

        {/* Y-axis labels */}
        {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => {
          const y = padding + ratio * chartHeight
          const value = maxY - ratio * rangeY
          return (
            <g key={i}>
              <line x1={padding - 5} y1={y} x2={padding} y2={y} stroke="#6b7280" strokeWidth="1" />
              <text x={padding - 10} y={y + 4} textAnchor="end" fontSize="12" fill="#6b7280">
                {Math.round(value)}
                {unit}
              </text>
            </g>
          )
        })}

        {/* X-axis labels */}
        {data.map((d, i) => {
          if (i % Math.ceil(data.length / 8) === 0) {
            const x = padding + (i / (data.length - 1)) * chartWidth
            return (
              <g key={i}>
                <line x1={x} y1={height - padding} x2={x} y2={height - padding + 5} stroke="#6b7280" strokeWidth="1" />
                <text x={x} y={height - padding + 18} textAnchor="middle" fontSize="10" fill="#6b7280">
                  {d.x}
                </text>
              </g>
            )
          }
          return null
        })}

        {/* Chart line */}
        <polyline
          fill="none"
          stroke={color}
          strokeWidth="3"
          points={points}
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Data points */}
        {data.map((d, i) => {
          const x = padding + (i / (data.length - 1)) * chartWidth
          const y = padding + ((maxY - d.y) / rangeY) * chartHeight
          return (
            <circle key={i} cx={x} cy={y} r="4" fill={color} stroke="white" strokeWidth="2">
              <title>{`${d.x}: ${d.y}${unit}`}</title>
            </circle>
          )
        })}

        {/* Chart title */}
        <text x={width / 2} y={25} textAnchor="middle" fontSize="16" fontWeight="bold" fill="#374151">
          {label}
        </text>
      </svg>
    </div>
  )
}

// Simple Bar Chart Component
const SimpleBarChart = ({
  data,
  width = 800,
  height = 300,
  color = "#ef4444",
  label = "Value",
  unit = "",
}: {
  data: { x: string; y: number }[]
  width?: number
  height?: number
  color?: string
  label?: string
  unit?: string
}) => {
  if (!data || data.length === 0) return <div>No data available</div>

  const padding = 60
  const chartWidth = width - padding * 2
  const chartHeight = height - padding * 2

  const maxY = Math.max(...data.map((d) => d.y))
  const barWidth = (chartWidth / data.length) * 0.8

  return (
    <div className="w-full overflow-x-auto">
      <svg width={width} height={height} className="border rounded-lg bg-white">
        {/* Grid lines */}
        <defs>
          <pattern id="grid-bar" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#e5e7eb" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid-bar)" />

        {/* Y-axis labels */}
        {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => {
          const y = padding + ratio * chartHeight
          const value = maxY - ratio * maxY
          return (
            <g key={i}>
              <line x1={padding - 5} y1={y} x2={padding} y2={y} stroke="#6b7280" strokeWidth="1" />
              <text x={padding - 10} y={y + 4} textAnchor="end" fontSize="12" fill="#6b7280">
                {Math.round(value)}
                {unit}
              </text>
            </g>
          )
        })}

        {/* Bars */}
        {data.map((d, i) => {
          const x = padding + (i / data.length) * chartWidth + (chartWidth / data.length - barWidth) / 2
          const barHeight = (d.y / maxY) * chartHeight
          const y = height - padding - barHeight

          return (
            <g key={i}>
              <rect x={x} y={y} width={barWidth} height={barHeight} fill={color} opacity="0.8" rx="4">
                <title>{`${d.x}: ${d.y}${unit}`}</title>
              </rect>
              <text x={x + barWidth / 2} y={height - padding + 15} textAnchor="middle" fontSize="10" fill="#6b7280">
                {d.x}
              </text>
            </g>
          )
        })}

        {/* Chart title */}
        <text x={width / 2} y={25} textAnchor="middle" fontSize="16" fontWeight="bold" fill="#374151">
          {label}
        </text>
      </svg>
    </div>
  )
}

export function WeatherChart({ weatherData }: WeatherChartProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="space-y-6">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="bg-white/95 backdrop-blur-md border-0 shadow-xl">
            <CardContent className="p-6">
              <div className="animate-pulse">
                <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
                <div className="h-64 bg-gray-200 rounded"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  // Prepare hourly data for the next 24 hours
  const hourlyTemperatureData = weatherData.hourly.time.slice(0, 24).map((time, index) => ({
    x: new Date(time).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
    y: Math.round(weatherData.hourly.temperature[index] * 10) / 10,
  }))

  const hourlyHumidityData = weatherData.hourly.time.slice(0, 24).map((time, index) => ({
    x: new Date(time).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
    y: weatherData.hourly.humidity[index],
  }))

  const hourlyPrecipitationData = weatherData.hourly.time.slice(0, 24).map((time, index) => ({
    x: new Date(time).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
    y: Math.round(weatherData.hourly.precipitation[index] * 10) / 10,
  }))

  const hourlyWindData = weatherData.hourly.time.slice(0, 24).map((time, index) => ({
    x: new Date(time).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
    y: Math.round(weatherData.hourly.windSpeed[index] * 10) / 10,
  }))

  // Prepare daily data for the next 7 days
  const dailyMaxTempData = weatherData.daily.time.slice(0, 7).map((date, index) => ({
    x: new Date(date).toLocaleDateString("en-US", { weekday: "short" }),
    y: Math.round(weatherData.daily.temperatureMax[index] * 10) / 10,
  }))

  const dailyMinTempData = weatherData.daily.time.slice(0, 7).map((date, index) => ({
    x: new Date(date).toLocaleDateString("en-US", { weekday: "short" }),
    y: Math.round(weatherData.daily.temperatureMin[index] * 10) / 10,
  }))

  const dailyPrecipitationData = weatherData.daily.time.slice(0, 7).map((date, index) => ({
    x: new Date(date).toLocaleDateString("en-US", { weekday: "short" }),
    y: Math.round(weatherData.daily.precipitation[index] * 10) / 10,
  }))

  return (
    <div className="space-y-8">
      {/* 24-Hour Temperature */}
      <Card className="bg-white/95 backdrop-blur-md border-0 shadow-xl">
        <CardHeader className="bg-gradient-to-r from-red-50 to-orange-50 border-b border-red-100">
          <CardTitle className="text-xl font-bold text-gray-800 flex items-center gap-2">
            🌡️ 24-Hour Temperature Trend
          </CardTitle>
          <CardDescription className="text-gray-600">
            Temperature forecast for the next 24 hours • Real-time data
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <SimpleLineChart
            data={hourlyTemperatureData}
            color="#ef4444"
            label="Temperature Trend (24 Hours)"
            unit="°C"
            width={800}
            height={350}
          />
        </CardContent>
      </Card>

      {/* 24-Hour Humidity */}
      <Card className="bg-white/95 backdrop-blur-md border-0 shadow-xl">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-cyan-50 border-b border-blue-100">
          <CardTitle className="text-xl font-bold text-gray-800 flex items-center gap-2">
            💧 24-Hour Humidity Levels
          </CardTitle>
          <CardDescription className="text-gray-600">Humidity percentage throughout the day</CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <SimpleLineChart
            data={hourlyHumidityData}
            color="#3b82f6"
            label="Humidity Levels (24 Hours)"
            unit="%"
            width={800}
            height={350}
          />
        </CardContent>
      </Card>

      {/* 24-Hour Precipitation */}
      <Card className="bg-white/95 backdrop-blur-md border-0 shadow-xl">
        <CardHeader className="bg-gradient-to-r from-cyan-50 to-blue-50 border-b border-cyan-100">
          <CardTitle className="text-xl font-bold text-gray-800 flex items-center gap-2">
            🌧️ 24-Hour Precipitation Forecast
          </CardTitle>
          <CardDescription className="text-gray-600">Expected rainfall and precipitation amounts</CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <SimpleBarChart
            data={hourlyPrecipitationData}
            color="#06b6d4"
            label="Precipitation Forecast (24 Hours)"
            unit="mm"
            width={800}
            height={350}
          />
        </CardContent>
      </Card>

      {/* 24-Hour Wind Speed */}
      <Card className="bg-white/95 backdrop-blur-md border-0 shadow-xl">
        <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 border-b border-green-100">
          <CardTitle className="text-xl font-bold text-gray-800 flex items-center gap-2">
            💨 24-Hour Wind Speed
          </CardTitle>
          <CardDescription className="text-gray-600">Wind speed variations throughout the day</CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <SimpleLineChart
            data={hourlyWindData}
            color="#10b981"
            label="Wind Speed (24 Hours)"
            unit=" km/h"
            width={800}
            height={350}
          />
        </CardContent>
      </Card>

      {/* 7-Day Max Temperature */}
      <Card className="bg-white/95 backdrop-blur-md border-0 shadow-xl">
        <CardHeader className="bg-gradient-to-r from-orange-50 to-red-50 border-b border-orange-100">
          <CardTitle className="text-xl font-bold text-gray-800 flex items-center gap-2">
            📊 7-Day Maximum Temperature
          </CardTitle>
          <CardDescription className="text-gray-600">Daily maximum temperatures for the week</CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <SimpleBarChart
            data={dailyMaxTempData}
            color="#ef4444"
            label="Maximum Temperature (7 Days)"
            unit="°C"
            width={800}
            height={350}
          />
        </CardContent>
      </Card>

      {/* 7-Day Min Temperature */}
      <Card className="bg-white/95 backdrop-blur-md border-0 shadow-xl">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100">
          <CardTitle className="text-xl font-bold text-gray-800 flex items-center gap-2">
            📊 7-Day Minimum Temperature
          </CardTitle>
          <CardDescription className="text-gray-600">Daily minimum temperatures for the week</CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <SimpleBarChart
            data={dailyMinTempData}
            color="#3b82f6"
            label="Minimum Temperature (7 Days)"
            unit="°C"
            width={800}
            height={350}
          />
        </CardContent>
      </Card>

      {/* 7-Day Precipitation */}
      <Card className="bg-white/95 backdrop-blur-md border-0 shadow-xl">
        <CardHeader className="bg-gradient-to-r from-cyan-50 to-blue-50 border-b border-cyan-100">
          <CardTitle className="text-xl font-bold text-gray-800 flex items-center gap-2">
            🌧️ 7-Day Precipitation Summary
          </CardTitle>
          <CardDescription className="text-gray-600">Daily precipitation amounts for the week</CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <SimpleBarChart
            data={dailyPrecipitationData}
            color="#06b6d4"
            label="Daily Precipitation (7 Days)"
            unit="mm"
            width={800}
            height={350}
          />
        </CardContent>
      </Card>

      {/* Data Summary */}
      <Card className="bg-white/95 backdrop-blur-md border-0 shadow-xl">
        <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 border-b border-purple-100">
          <CardTitle className="text-xl font-bold text-gray-800 flex items-center gap-2">
            📈 Weather Data Summary
          </CardTitle>
          <CardDescription className="text-gray-600">Key statistics from the weather data</CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center p-4 bg-gradient-to-br from-red-50 to-red-100 rounded-xl">
              <div className="text-2xl font-bold text-red-600">
                {Math.max(...weatherData.hourly.temperature.slice(0, 24)).toFixed(1)}°C
              </div>
              <div className="text-sm text-gray-600">24h Max Temp</div>
            </div>
            <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl">
              <div className="text-2xl font-bold text-blue-600">
                {Math.min(...weatherData.hourly.temperature.slice(0, 24)).toFixed(1)}°C
              </div>
              <div className="text-sm text-gray-600">24h Min Temp</div>
            </div>
            <div className="text-center p-4 bg-gradient-to-br from-cyan-50 to-cyan-100 rounded-xl">
              <div className="text-2xl font-bold text-cyan-600">
                {weatherData.hourly.precipitation
                  .slice(0, 24)
                  .reduce((a, b) => a + b, 0)
                  .toFixed(1)}
                mm
              </div>
              <div className="text-sm text-gray-600">24h Total Rain</div>
            </div>
            <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-xl">
              <div className="text-2xl font-bold text-green-600">
                {Math.max(...weatherData.hourly.windSpeed.slice(0, 24)).toFixed(1)} km/h
              </div>
              <div className="text-sm text-gray-600">24h Max Wind</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
