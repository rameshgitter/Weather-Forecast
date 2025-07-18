"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MapPin, Layers, Satellite, Cloud, Thermometer, Wind, Droplets, Eye } from "lucide-react"

interface WeatherMapProps {
  lat: number
  lon: number
}

interface MapLayer {
  id: string
  name: string
  description: string
  icon: React.ComponentType<any>
  color: string
}

export function WeatherMap({ lat, lon }: WeatherMapProps) {
  const [selectedLayer, setSelectedLayer] = useState("temp_new")
  const [mapStyle, setMapStyle] = useState("satellite")
  const [zoom, setZoom] = useState(8)

  const mapLayers: MapLayer[] = [
    {
      id: "temp_new",
      name: "Temperature",
      description: "Current temperature overlay",
      icon: Thermometer,
      color: "bg-red-500",
    },
    {
      id: "precipitation_new",
      name: "Precipitation",
      description: "Current precipitation and rain",
      icon: Droplets,
      color: "bg-blue-500",
    },
    {
      id: "pressure_new",
      name: "Pressure",
      description: "Atmospheric pressure patterns",
      icon: Eye,
      color: "bg-purple-500",
    },
    {
      id: "wind_new",
      name: "Wind",
      description: "Wind speed and direction",
      icon: Wind,
      color: "bg-green-500",
    },
    {
      id: "clouds_new",
      name: "Clouds",
      description: "Cloud coverage and density",
      icon: Cloud,
      color: "bg-gray-500",
    },
  ]

  // Generate OpenWeatherMap tile URL
  const generateTileUrl = (layer: string, z: number, x: number, y: number) => {
    // Note: In production, you'd want to use your own OpenWeatherMap API key
    // For demo purposes, we'll use a placeholder
    return `https://tile.openweathermap.org/map/${layer}/${z}/${x}/${y}.png?appid=demo_key`
  }

  // Calculate tile coordinates for the given lat/lon
  const getTileCoordinates = (lat: number, lon: number, zoom: number) => {
    const x = Math.floor(((lon + 180) / 360) * Math.pow(2, zoom))
    const y = Math.floor(
      ((1 - Math.log(Math.tan((lat * Math.PI) / 180) + 1 / Math.cos((lat * Math.PI) / 180)) / Math.PI) / 2) *
        Math.pow(2, zoom),
    )
    return { x, y }
  }

  const { x: tileX, y: tileY } = getTileCoordinates(lat, lon, zoom)

  // Generate a grid of tiles around the center
  const generateTileGrid = () => {
    const tiles = []
    const gridSize = 3 // 3x3 grid
    const offset = Math.floor(gridSize / 2)

    for (let i = -offset; i <= offset; i++) {
      for (let j = -offset; j <= offset; j++) {
        tiles.push({
          x: tileX + i,
          y: tileY + j,
          gridX: i + offset,
          gridY: j + offset,
        })
      }
    }
    return tiles
  }

  const tiles = generateTileGrid()

  return (
    <div className="space-y-6">
      {/* Map Controls */}
      <Card className="bg-white/95 backdrop-blur-md border-0 shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Layers className="h-5 w-5" />
            Weather Map Controls
          </CardTitle>
          <CardDescription>Interactive weather maps with real-time data overlays</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4 mb-4">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Map Style:</span>
              <div className="flex gap-2">
                <Button
                  variant={mapStyle === "satellite" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setMapStyle("satellite")}
                >
                  <Satellite className="h-4 w-4 mr-1" />
                  Satellite
                </Button>
                <Button
                  variant={mapStyle === "terrain" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setMapStyle("terrain")}
                >
                  <MapPin className="h-4 w-4 mr-1" />
                  Terrain
                </Button>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Zoom:</span>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => setZoom(Math.max(3, zoom - 1))} disabled={zoom <= 3}>
                  -
                </Button>
                <Badge variant="outline">{zoom}</Badge>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setZoom(Math.min(12, zoom + 1))}
                  disabled={zoom >= 12}
                >
                  +
                </Button>
              </div>
            </div>
          </div>

          {/* Layer Selection */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {mapLayers.map((layer) => {
              const IconComponent = layer.icon
              return (
                <Button
                  key={layer.id}
                  variant={selectedLayer === layer.id ? "default" : "outline"}
                  className="h-auto p-3 flex flex-col items-center gap-2"
                  onClick={() => setSelectedLayer(layer.id)}
                >
                  <div
                    className={`p-2 rounded-full ${layer.color} ${selectedLayer === layer.id ? "text-white" : "text-white"}`}
                  >
                    <IconComponent className="h-4 w-4" />
                  </div>
                  <span className="text-xs font-medium">{layer.name}</span>
                </Button>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Main Weather Map */}
      <Card className="bg-white/95 backdrop-blur-md border-0 shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Weather Map - {mapLayers.find((l) => l.id === selectedLayer)?.name}</span>
            <Badge variant="outline" className="flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              {lat.toFixed(2)}, {lon.toFixed(2)}
            </Badge>
          </CardTitle>
          <CardDescription>{mapLayers.find((l) => l.id === selectedLayer)?.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div
            className="relative bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl overflow-hidden"
            style={{ height: "500px" }}
          >
            {/* Simulated Map Tiles */}
            <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 gap-1 p-2">
              {tiles.map((tile, index) => (
                <div
                  key={index}
                  className="relative bg-gradient-to-br from-blue-200 to-blue-300 rounded-lg overflow-hidden border border-blue-300"
                  style={{
                    backgroundImage: `linear-gradient(45deg, 
                      ${
                        selectedLayer === "temp_new"
                          ? "#ef4444, #f97316"
                          : selectedLayer === "precipitation_new"
                            ? "#06b6d4, #0284c7"
                            : selectedLayer === "wind_new"
                              ? "#10b981, #059669"
                              : selectedLayer === "clouds_new"
                                ? "#6b7280, #4b5563"
                                : "#8b5cf6, #7c3aed"
                      })`,
                  }}
                >
                  {/* Tile coordinates for debugging */}
                  <div className="absolute top-1 left-1 text-xs text-white/70 font-mono">
                    {tile.x},{tile.y}
                  </div>

                  {/* Weather data visualization */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    {selectedLayer === "temp_new" && (
                      <div className="text-white font-bold text-lg">{Math.round(Math.random() * 30 - 5)}°C</div>
                    )}
                    {selectedLayer === "precipitation_new" && (
                      <div className="text-white font-bold text-sm">{(Math.random() * 10).toFixed(1)}mm</div>
                    )}
                    {selectedLayer === "wind_new" && (
                      <div className="text-white font-bold text-sm flex items-center gap-1">
                        <Wind className="h-4 w-4" />
                        {Math.round(Math.random() * 25)}
                      </div>
                    )}
                    {selectedLayer === "clouds_new" && (
                      <div className="text-white font-bold text-sm">{Math.round(Math.random() * 100)}%</div>
                    )}
                    {selectedLayer === "pressure_new" && (
                      <div className="text-white font-bold text-xs">
                        {Math.round(1013 + Math.random() * 40 - 20)}hPa
                      </div>
                    )}
                  </div>

                  {/* Center marker */}
                  {tile.gridX === 1 && tile.gridY === 1 && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-4 h-4 bg-red-500 rounded-full border-2 border-white shadow-lg animate-pulse"></div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Map Legend */}
            <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg">
              <div className="text-sm font-medium mb-2">Legend</div>
              <div className="space-y-1 text-xs">
                {selectedLayer === "temp_new" && (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-2 bg-gradient-to-r from-blue-500 via-green-500 via-yellow-500 to-red-500 rounded"></div>
                    <span>-10°C to 40°C</span>
                  </div>
                )}
                {selectedLayer === "precipitation_new" && (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-2 bg-gradient-to-r from-blue-200 to-blue-800 rounded"></div>
                    <span>0mm to 50mm/h</span>
                  </div>
                )}
                {selectedLayer === "wind_new" && (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-2 bg-gradient-to-r from-green-200 to-green-800 rounded"></div>
                    <span>0 to 100 km/h</span>
                  </div>
                )}
                {selectedLayer === "clouds_new" && (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-2 bg-gradient-to-r from-gray-200 to-gray-800 rounded"></div>
                    <span>0% to 100%</span>
                  </div>
                )}
                {selectedLayer === "pressure_new" && (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-2 bg-gradient-to-r from-purple-200 to-purple-800 rounded"></div>
                    <span>980 to 1050 hPa</span>
                  </div>
                )}
              </div>
            </div>

            {/* Map Info */}
            <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg">
              <div className="text-sm font-medium">Map Info</div>
              <div className="text-xs text-gray-600 mt-1">
                <div>Zoom Level: {zoom}</div>
                <div>Style: {mapStyle}</div>
                <div>Layer: {mapLayers.find((l) => l.id === selectedLayer)?.name}</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Additional Map Features */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Radar View */}
        <Card className="bg-white/95 backdrop-blur-md border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">📡 Weather Radar</CardTitle>
            <CardDescription>Live precipitation radar</CardDescription>
          </CardHeader>
          <CardContent>
            <div
              className="relative bg-gradient-to-br from-green-100 to-blue-200 rounded-lg overflow-hidden"
              style={{ height: "250px" }}
            >
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center space-y-2">
                  <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center animate-pulse">
                    <div className="w-8 h-8 bg-green-500/40 rounded-full flex items-center justify-center">
                      <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                    </div>
                  </div>
                  <div className="text-sm font-medium text-gray-700">Radar Sweep</div>
                  <div className="text-xs text-gray-500">Live precipitation data</div>
                </div>
              </div>
              <div className="absolute bottom-2 left-2 text-xs text-gray-600 bg-white/80 px-2 py-1 rounded">
                Range: 100km
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Satellite View */}
        <Card className="bg-white/95 backdrop-blur-md border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">🛰️ Satellite Imagery</CardTitle>
            <CardDescription>Current satellite view</CardDescription>
          </CardHeader>
          <CardContent>
            <div
              className="relative bg-gradient-to-br from-blue-900 via-blue-700 to-blue-500 rounded-lg overflow-hidden"
              style={{ height: "250px" }}
            >
              <div className="absolute inset-0">
                {/* Simulated cloud patterns */}
                <div className="absolute top-8 left-12 w-20 h-12 bg-white/30 rounded-full blur-sm"></div>
                <div className="absolute top-16 right-16 w-16 h-8 bg-white/40 rounded-full blur-sm"></div>
                <div className="absolute bottom-12 left-8 w-24 h-16 bg-white/25 rounded-full blur-sm"></div>
                <div className="absolute bottom-8 right-12 w-18 h-10 bg-white/35 rounded-full blur-sm"></div>
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-3 h-3 bg-red-500 rounded-full border-2 border-white shadow-lg animate-pulse"></div>
              </div>
              <div className="absolute bottom-2 left-2 text-xs text-white bg-black/50 px-2 py-1 rounded">
                Last updated: {new Date().toLocaleTimeString()}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
