import { Card, CardContent } from "@/components/ui/card"
import { Cloud, Sun, CloudRain, Snowflake, Zap, Wind, Droplets } from "lucide-react"

const weatherIcons = {
  0: Sun, // Clear sky
  1: Sun, // Mainly clear
  2: Cloud, // Partly cloudy
  3: Cloud, // Overcast
  45: Cloud, // Fog
  48: Cloud, // Depositing rime fog
  51: CloudRain, // Light drizzle
  53: CloudRain, // Moderate drizzle
  55: CloudRain, // Dense drizzle
  61: CloudRain, // Slight rain
  63: CloudRain, // Moderate rain
  65: CloudRain, // Heavy rain
  71: Snowflake, // Slight snow
  73: Snowflake, // Moderate snow
  75: Snowflake, // Heavy snow
  95: Zap, // Thunderstorm
  96: Zap, // Thunderstorm with hail
  99: Zap, // Thunderstorm with heavy hail
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

const weatherGradients = {
  0: "from-yellow-400 to-orange-400", // Clear sky
  1: "from-blue-400 to-blue-500", // Mainly clear
  2: "from-gray-400 to-gray-500", // Partly cloudy
  3: "from-gray-500 to-gray-600", // Overcast
  45: "from-gray-300 to-gray-400", // Fog
  48: "from-gray-300 to-gray-400", // Depositing rime fog
  51: "from-blue-500 to-blue-600", // Light drizzle
  53: "from-blue-600 to-blue-700", // Moderate drizzle
  55: "from-blue-700 to-blue-800", // Dense drizzle
  61: "from-blue-500 to-blue-600", // Slight rain
  63: "from-blue-600 to-blue-700", // Moderate rain
  65: "from-blue-700 to-blue-800", // Heavy rain
  71: "from-blue-200 to-blue-300", // Slight snow
  73: "from-blue-300 to-blue-400", // Moderate snow
  75: "from-blue-400 to-blue-500", // Heavy snow
  95: "from-purple-600 to-purple-700", // Thunderstorm
  96: "from-purple-700 to-purple-800", // Thunderstorm with hail
  99: "from-purple-800 to-purple-900", // Thunderstorm with heavy hail
}

interface ForecastCardProps {
  date: string
  maxTemp: number
  minTemp: number
  weatherCode: number
  precipitation: number
  windSpeed: number
}

export function ForecastCard({ date, maxTemp, minTemp, weatherCode, precipitation, windSpeed }: ForecastCardProps) {
  const WeatherIcon = weatherIcons[weatherCode as keyof typeof weatherIcons] || Cloud
  const description = weatherDescriptions[weatherCode as keyof typeof weatherDescriptions] || "Unknown"
  const gradient = weatherGradients[weatherCode as keyof typeof weatherGradients] || "from-blue-400 to-blue-500"

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const today = new Date()
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    if (date.toDateString() === today.toDateString()) {
      return "Today"
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return "Tomorrow"
    } else {
      return date.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })
    }
  }

  return (
    <Card className="hover:shadow-xl transition-all duration-300 transform hover:scale-105 bg-white/90 backdrop-blur-sm border-0 shadow-lg overflow-hidden">
      <div className={`bg-gradient-to-r ${gradient} p-0.5`}>
        <div className="bg-white rounded-lg">
          <CardContent className="p-6">
            <div className="text-center space-y-4">
              <h3 className="font-bold text-lg text-gray-800">{formatDate(date)}</h3>

              <div className={`p-4 rounded-xl bg-gradient-to-br ${gradient} shadow-lg`}>
                <WeatherIcon className="h-10 w-10 mx-auto text-white drop-shadow-lg" />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-center gap-3">
                  <span className="text-2xl font-bold text-gray-800">{Math.round(maxTemp)}°</span>
                  <span className="text-lg text-gray-500">{Math.round(minTemp)}°</span>
                </div>
                <p className="text-sm font-medium text-gray-600">{description}</p>
              </div>

              <div className="space-y-3 pt-2 border-t border-gray-100">
                {precipitation > 0 && (
                  <div className="flex items-center justify-center gap-2 text-sm">
                    <div className="p-1.5 rounded-full bg-blue-100">
                      <Droplets className="h-3 w-3 text-blue-600" />
                    </div>
                    <span className="font-medium text-blue-600">{precipitation.toFixed(1)}mm</span>
                  </div>
                )}

                <div className="flex items-center justify-center gap-2 text-sm">
                  <div className="p-1.5 rounded-full bg-green-100">
                    <Wind className="h-3 w-3 text-green-600" />
                  </div>
                  <span className="font-medium text-green-600">{Math.round(windSpeed)} km/h</span>
                </div>
              </div>
            </div>
          </CardContent>
        </div>
      </div>
    </Card>
  )
}
