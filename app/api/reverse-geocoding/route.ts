import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const lat = searchParams.get("lat")
  const lon = searchParams.get("lon")

  if (!lat || !lon) {
    return NextResponse.json({ error: "Latitude and longitude are required" }, { status: 400 })
  }

  try {
    // For reverse geocoding, we'll use a simple approach with the geocoding API
    // In a real app, you might want to use a dedicated reverse geocoding service
    const response = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?latitude=${lat}&longitude=${lon}&count=1&language=en&format=json`,
    )

    if (!response.ok) {
      // If the specific reverse geocoding fails, create a generic location
      return NextResponse.json({
        results: [
          {
            name: `Location ${Number.parseFloat(lat).toFixed(2)}, ${Number.parseFloat(lon).toFixed(2)}`,
            country: "Unknown",
            lat: Number.parseFloat(lat),
            lon: Number.parseFloat(lon),
          },
        ],
      })
    }

    const data = await response.json()

    const results = data.results?.map((location: any) => ({
      name: location.name,
      country: location.country,
      lat: location.latitude,
      lon: location.longitude,
    })) || [
      {
        name: `Location ${Number.parseFloat(lat).toFixed(2)}, ${Number.parseFloat(lon).toFixed(2)}`,
        country: "Unknown",
        lat: Number.parseFloat(lat),
        lon: Number.parseFloat(lon),
      },
    ]

    return NextResponse.json({ results })
  } catch (error) {
    console.error("Reverse geocoding error:", error)
    return NextResponse.json({
      results: [
        {
          name: `Location ${Number.parseFloat(lat).toFixed(2)}, ${Number.parseFloat(lon).toFixed(2)}`,
          country: "Unknown",
          lat: Number.parseFloat(lat),
          lon: Number.parseFloat(lon),
        },
      ],
    })
  }
}
