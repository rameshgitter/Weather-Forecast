import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Cloud, Sun, CloudRain, Snowflake, Zap, Thermometer, Droplets, Wind } from "lucide-react"

const weatherIcons = {
  0: Sun,
  1: Sun,
  2: Cloud,
  3: Cloud,
  45: Cloud,
  48: Cloud,
  51: CloudRain,
  53: CloudRain,
  55: CloudRain,
  61: CloudRain,
  63: CloudRain,
  65: CloudRain,
  71: Snowflake,
  73: Snowflake,
  75: Snowflake,
  95: Zap,
  96: Zap,
  99: Zap,
}

const weatherDescriptions = {
  0: "Clear",
  1: "Mainly clear",
  2: "Partly cloudy",
  3: "Overcast",
  45: "Fog",
  48: "Rime fog",
  51: "Light drizzle",
  53: "Drizzle",
  55: "Dense drizzle",
  61: "Light rain",
  63: "Rain",
  65: "Heavy rain",
  71: "Light snow",
  73: "Snow",
  75: "Heavy snow",
  95: "Thunderstorm",
  96: "Thunderstorm",
  99: "Heavy thunderstorm",
}

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

interface WeatherDetailsProps {
  weatherData: WeatherData
}

export function WeatherDetails({ weatherData }: WeatherDetailsProps) {
  // Get next 24 hours of data
  const hourlyData = weatherData.hourly.time.slice(0, 24).map((time, index) => ({
    time,
    temperature: weatherData.hourly.temperature[index],
    humidity: weatherData.hourly.humidity[index],
    precipitation: weatherData.hourly.precipitation[index],
    windSpeed: weatherData.hourly.windSpeed[index],
    weatherCode: weatherData.hourly.weatherCode[index],
  }))

  const formatTime = (timeString: string) => {
    return new Date(timeString).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    })
  }

  return (
    <Card className="bg-white/95 backdrop-blur-md border-0 shadow-xl">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100">
        <CardTitle className="text-xl font-bold text-gray-800">24-Hour Detailed Forecast</CardTitle>
        <CardDescription className="text-gray-600">Hourly weather conditions for the next 24 hours</CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <div className="overflow-x-auto">
          <div className="min-w-full">
            {/* Header Row */}
            <div className="grid grid-cols-6 gap-4 text-sm font-semibold text-gray-700 mb-4 px-4 py-3 bg-gray-50 rounded-lg border-b-2 border-gray-200">
              <div className="text-left">Time</div>
              <div className="text-left">Weather</div>
              <div className="text-center">Temperature</div>
              <div className="text-center">Humidity</div>
              <div className="text-center">Precipitation</div>
              <div className="text-center">Wind Speed</div>
            </div>

            {/* Data Rows */}
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {hourlyData.map((hour, index) => {
                const WeatherIcon = weatherIcons[hour.weatherCode as keyof typeof weatherIcons] || Cloud
                const description =
                  weatherDescriptions[hour.weatherCode as keyof typeof weatherDescriptions] || "Unknown"

                return (
                  <div
                    key={index}
                    className="grid grid-cols-6 gap-4 items-center py-3 px-4 rounded-xl hover:bg-blue-50 transition-all duration-200 text-sm border border-gray-100 hover:border-blue-200 hover:shadow-md"
                  >
                    {/* Time Column */}
                    <div className="font-medium text-gray-800 text-left">{formatTime(hour.time)}</div>

                    {/* Weather Column */}
                    <div className="flex items-center gap-2 text-left">
                      <WeatherIcon className="h-5 w-5 text-blue-500 flex-shrink-0" />
                      <span className="text-xs text-gray-600 truncate">{description}</span>
                    </div>

                    {/* Temperature Column */}
                    <div className="flex items-center justify-center gap-1">
                      <Thermometer className="h-4 w-4 text-red-500" />
                      <span className="font-semibold text-gray-800">{Math.round(hour.temperature)}°C</span>
                    </div>

                    {/* Humidity Column */}
                    <div className="flex items-center justify-center gap-1">
                      <Droplets className="h-4 w-4 text-blue-500" />
                      <span className="font-medium text-gray-700">{hour.humidity}%</span>
                    </div>

                    {/* Precipitation Column */}
                    <div className="flex items-center justify-center gap-1">
                      <CloudRain className="h-4 w-4 text-cyan-500" />
                      <span className="font-medium text-gray-700">{hour.precipitation.toFixed(1)}mm</span>
                    </div>

                    {/* Wind Speed Column */}
                    <div className="flex items-center justify-center gap-1">
                      <Wind className="h-4 w-4 text-green-500" />
                      <span className="font-medium text-gray-700">{Math.round(hour.windSpeed)} km/h</span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
