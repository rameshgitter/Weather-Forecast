"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  MapPin,
  Search,
  Navigation,
  Loader2,
  Cloud,
  Sun,
  CloudRain,
  Snowflake,
  Zap,
  Thermometer,
  Eye,
  Gauge,
  Wind,
} from "lucide-react"
import { WeatherChart } from "@/components/weather-chart"
import { WeatherMap } from "@/components/weather-map"
import { ForecastCard } from "@/components/forecast-card"
import { WeatherDetails } from "@/components/weather-details"
import { CloudRainIcon as Rain } from "lucide-react" // Importing Rain icon

interface Location {
  name: string
  country: string
  lat: number
  lon: number
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
  63: Rain, // Moderate rain
  65: CloudRain, // Heavy rain
  71: Snowflake, // Slight snow
  73: Snowflake, // Moderate snow
  75: Snowflake, // Heavy snow
  95: Zap, // Thunderstorm
  96: Zap, // Thunderstorm with hail
  99: Zap, // Thunderstorm with heavy hail
}

const weatherDescriptions = {
  0: "Clear sky",
  1: "Mainly clear",
  2: "Partly cloudy",
  3: "Overcast",
  45: "Fog",
  48: "Depositing rime fog",
  51: "Light drizzle",
  53: "Moderate drizzle",
  55: "Dense drizzle",
  61: "Slight rain",
  63: "Moderate rain",
  65: "Heavy rain",
  71: "Slight snow",
  73: "Moderate snow",
  75: "Heavy snow",
  95: "Thunderstorm",
  96: "Thunderstorm with hail",
  99: "Thunderstorm with heavy hail",
}

const weatherGradients = {
  0: "from-yellow-400 via-orange-400 to-red-400", // Clear sky
  1: "from-blue-400 via-blue-500 to-blue-600", // Mainly clear
  2: "from-gray-400 via-gray-500 to-gray-600", // Partly cloudy
  3: "from-gray-500 via-gray-600 to-gray-700", // Overcast
  45: "from-gray-300 via-gray-400 to-gray-500", // Fog
  48: "from-gray-300 via-gray-400 to-gray-500", // Depositing rime fog
  51: "from-blue-500 via-blue-600 to-blue-700", // Light drizzle
  53: "from-blue-600 via-blue-700 to-blue-800", // Moderate drizzle
  55: "from-blue-700 via-blue-800 to-blue-900", // Dense drizzle
  61: "from-blue-500 via-blue-600 to-blue-700", // Slight rain
  63: "from-blue-600 via-blue-700 to-blue-800", // Moderate rain
  65: "from-blue-700 via-blue-800 to-blue-900", // Heavy rain
  71: "from-blue-200 via-blue-300 to-blue-400", // Slight snow
  73: "from-blue-300 via-blue-400 to-blue-500", // Moderate snow
  75: "from-blue-400 via-blue-500 to-blue-600", // Heavy snow
  95: "from-purple-600 via-purple-700 to-purple-800", // Thunderstorm
  96: "from-purple-700 via-purple-800 to-purple-900", // Thunderstorm with hail
  99: "from-purple-800 via-purple-900 to-black", // Thunderstorm with heavy hail
}

export default function WeatherApp() {
  const [searchQuery, setSearchQuery] = useState("")
  const [locations, setLocations] = useState<Location[]>([])
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null)
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null)
  const [loading, setLoading] = useState(false)
  const [searchLoading, setSearchLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  const searchLocations = async (query: string) => {
    if (query.length < 2) {
      setLocations([])
      return
    }

    setSearchLoading(true)
    try {
      const response = await fetch(`/api/geocoding?q=${encodeURIComponent(query)}`)
      const data = await response.json()
      setLocations(data.results || [])
    } catch (err) {
      console.error("Error searching locations:", err)
    } finally {
      setSearchLoading(false)
    }
  }

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by this browser.")
      return
    }

    setLoading(true)
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords
        try {
          const response = await fetch(`/api/reverse-geocoding?lat=${latitude}&lon=${longitude}`)
          const data = await response.json()
          if (data.results && data.results.length > 0) {
            const location = data.results[0]
            setSelectedLocation(location)
            await fetchWeatherData(location.lat, location.lon)
          }
        } catch (err) {
          setError("Failed to get location information")
        } finally {
          setLoading(false)
        }
      },
      (error) => {
        setError("Failed to get your location")
        setLoading(false)
      },
    )
  }

  const fetchWeatherData = async (lat: number, lon: number) => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch(`/api/weather?lat=${lat}&lon=${lon}`)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch weather data")
      }

      setWeatherData(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch weather data")
    } finally {
      setLoading(false)
    }
  }

  const handleLocationSelect = (location: Location) => {
    setSelectedLocation(location)
    setSearchQuery("")
    setLocations([])
    fetchWeatherData(location.lat, location.lon)
  }

  const WeatherIcon = weatherData
    ? weatherIcons[weatherData.current.weatherCode as keyof typeof weatherIcons] || Cloud
    : Cloud

  const backgroundGradient = weatherData
    ? weatherGradients[weatherData.current.weatherCode as keyof typeof weatherGradients] || "from-blue-400 to-blue-600"
    : "from-blue-400 to-blue-600"

  const getUVIndexColor = (uvIndex: number) => {
    if (uvIndex <= 2) return "bg-green-500"
    if (uvIndex <= 5) return "bg-yellow-500"
    if (uvIndex <= 7) return "bg-orange-500"
    if (uvIndex <= 10) return "bg-red-500"
    return "bg-purple-500"
  }

  const getUVIndexLabel = (uvIndex: number) => {
    if (uvIndex <= 2) return "Low"
    if (uvIndex <= 5) return "Moderate"
    if (uvIndex <= 7) return "High"
    if (uvIndex <= 10) return "Very High"
    return "Extreme"
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br ${backgroundGradient} transition-all duration-1000`}>
      <div className="min-h-screen bg-black/10 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto p-4">
          {/* Header */}
          <div className="text-center mb-8 pt-8">
            <h1 className="text-5xl font-bold text-white mb-2 drop-shadow-lg">Weather Forecast</h1>
            <p className="text-white/80 text-lg drop-shadow">Real-time weather data powered by Open-Meteo API</p>
            <div className="text-white/60 text-sm mt-2">{currentTime.toLocaleString()}</div>
          </div>

          {/* Search Section */}
          <Card className="mb-8 bg-white/90 backdrop-blur-md border-0 shadow-2xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-gray-800">
                <Search className="h-5 w-5" />
                Search Location
              </CardTitle>
              <CardDescription>Search for any city worldwide or use your current location</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-3 mb-4">
                <div className="relative flex-1">
                  <Input
                    placeholder="Search for a city..."
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value)
                      searchLocations(e.target.value)
                    }}
                    className="pr-10 h-12 text-lg border-2 focus:border-blue-500 transition-all"
                  />
                  {searchLoading && (
                    <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 animate-spin text-blue-500" />
                  )}
                </div>
                <Button
                  onClick={getCurrentLocation}
                  disabled={loading}
                  className="h-12 px-6 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-lg"
                >
                  <Navigation className="h-4 w-4 mr-2" />
                  Current Location
                </Button>
              </div>

              {locations.length > 0 && (
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {locations.map((location, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 border-2 border-gray-100 rounded-xl cursor-pointer hover:bg-blue-50 hover:border-blue-200 transition-all duration-200 transform hover:scale-[1.02]"
                      onClick={() => handleLocationSelect(location)}
                    >
                      <div className="flex items-center gap-3">
                        <MapPin className="h-5 w-5 text-blue-500" />
                        <span className="font-medium text-gray-800">
                          {location.name}, {location.country}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {loading && (
            <div className="flex items-center justify-center py-16">
              <div className="bg-white/90 backdrop-blur-md rounded-2xl p-8 shadow-2xl">
                <div className="flex items-center gap-4">
                  <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                  <span className="text-xl font-medium text-gray-800">Loading weather data...</span>
                </div>
              </div>
            </div>
          )}

          {error && (
            <Card className="mb-8 border-red-200 bg-red-50/90 backdrop-blur-md shadow-xl">
              <CardContent className="pt-6">
                <p className="text-red-600 text-lg font-medium">{error}</p>
              </CardContent>
            </Card>
          )}

          {selectedLocation && weatherData && (
            <div className="space-y-8">
              {/* Current Weather Hero Section */}
              <Card className="bg-white/95 backdrop-blur-md border-0 shadow-2xl overflow-hidden">
                <div className={`bg-gradient-to-r ${backgroundGradient} p-1`}>
                  <div className="bg-white/95 backdrop-blur-md rounded-lg">
                    <CardHeader className="pb-4">
                      <CardTitle className="flex items-center gap-3 text-2xl text-gray-800">
                        <MapPin className="h-6 w-6 text-blue-500" />
                        {selectedLocation.name}, {selectedLocation.country}
                      </CardTitle>
                      <CardDescription className="text-lg">Current weather conditions • Live data</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Main Weather Display */}
                        <div className="flex items-center gap-6">
                          <div className={`p-6 rounded-2xl bg-gradient-to-br ${backgroundGradient} shadow-xl`}>
                            <WeatherIcon className="h-16 w-16 text-white drop-shadow-lg" />
                          </div>
                          <div>
                            <p className="text-6xl font-bold text-gray-800 mb-2">
                              {Math.round(weatherData.current.temperature)}°C
                            </p>
                            <p className="text-xl text-gray-600 mb-1">
                              {weatherDescriptions[weatherData.current.weatherCode as keyof typeof weatherDescriptions]}
                            </p>
                            <p className="text-lg text-gray-500">
                              Feels like {Math.round(weatherData.current.feelsLike)}°C
                            </p>
                          </div>
                        </div>

                        {/* Weather Stats Grid */}
                        <div className="grid grid-cols-2 gap-4">
                          <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl border border-blue-200">
                            <div className="flex items-center gap-2 mb-2">
                              <Thermometer className="h-5 w-5 text-blue-500" />
                              <span className="text-sm font-medium text-gray-600">Humidity</span>
                            </div>
                            <p className="text-2xl font-bold text-gray-800">{weatherData.current.humidity}%</p>
                          </div>

                          <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-xl border border-green-200">
                            <div className="flex items-center gap-2 mb-2">
                              <Wind className="h-5 w-5 text-green-500" />
                              <span className="text-sm font-medium text-gray-600">Wind Speed</span>
                            </div>
                            <p className="text-2xl font-bold text-gray-800">
                              {Math.round(weatherData.current.windSpeed)} km/h
                            </p>
                          </div>

                          <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-xl border border-purple-200">
                            <div className="flex items-center gap-2 mb-2">
                              <Gauge className="h-5 w-5 text-purple-500" />
                              <span className="text-sm font-medium text-gray-600">Pressure</span>
                            </div>
                            <p className="text-2xl font-bold text-gray-800">
                              {Math.round(weatherData.current.pressure)} hPa
                            </p>
                          </div>

                          <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-4 rounded-xl border border-orange-200">
                            <div className="flex items-center gap-2 mb-2">
                              <Eye className="h-5 w-5 text-orange-500" />
                              <span className="text-sm font-medium text-gray-600">Visibility</span>
                            </div>
                            <p className="text-2xl font-bold text-gray-800">
                              {Math.round(weatherData.current.visibility / 1000)} km
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* UV Index */}
                      <div className="mt-6 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl border border-yellow-200">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-semibold text-gray-800 mb-1">UV Index</h3>
                            <p className="text-sm text-gray-600">Current UV radiation level</p>
                          </div>
                          <div className="text-right">
                            <div
                              className={`inline-flex items-center px-3 py-1 rounded-full text-white font-medium ${getUVIndexColor(weatherData.current.uvIndex)}`}
                            >
                              {weatherData.current.uvIndex} - {getUVIndexLabel(weatherData.current.uvIndex)}
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </div>
                </div>
              </Card>

              {/* Detailed Weather Information */}
              <Card className="bg-white/95 backdrop-blur-md border-0 shadow-2xl">
                <Tabs defaultValue="forecast" className="w-full">
                  <div className="border-b border-gray-200">
                    <TabsList className="grid w-full grid-cols-4 bg-transparent h-14">
                      <TabsTrigger
                        value="forecast"
                        className="text-lg font-medium data-[state=active]:bg-blue-500 data-[state=active]:text-white"
                      >
                        7-Day Forecast
                      </TabsTrigger>
                      <TabsTrigger
                        value="hourly"
                        className="text-lg font-medium data-[state=active]:bg-blue-500 data-[state=active]:text-white"
                      >
                        Hourly
                      </TabsTrigger>
                      <TabsTrigger
                        value="charts"
                        className="text-lg font-medium data-[state=active]:bg-blue-500 data-[state=active]:text-white"
                      >
                        Charts
                      </TabsTrigger>
                      <TabsTrigger
                        value="map"
                        className="text-lg font-medium data-[state=active]:bg-blue-500 data-[state=active]:text-white"
                      >
                        Weather Map
                      </TabsTrigger>
                    </TabsList>
                  </div>

                  <TabsContent value="forecast" className="space-y-6 p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                      {weatherData.daily.time.slice(0, 7).map((date, index) => (
                        <ForecastCard
                          key={date}
                          date={date}
                          maxTemp={weatherData.daily.temperatureMax[index]}
                          minTemp={weatherData.daily.temperatureMin[index]}
                          weatherCode={weatherData.daily.weatherCode[index]}
                          precipitation={weatherData.daily.precipitation[index]}
                          windSpeed={weatherData.daily.windSpeed[index]}
                        />
                      ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="hourly" className="p-6">
                    <WeatherDetails weatherData={weatherData} />
                  </TabsContent>

                  <TabsContent value="charts" className="p-6">
                    <WeatherChart weatherData={weatherData} />
                  </TabsContent>

                  <TabsContent value="map" className="p-6">
                    <WeatherMap lat={selectedLocation.lat} lon={selectedLocation.lon} />
                  </TabsContent>
                </Tabs>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
