import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const query = searchParams.get("q")

  if (!query) {
    return NextResponse.json({ error: "Query parameter is required" }, { status: 400 })
  }

  try {
    const response = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=10&language=en&format=json`,
    )

    if (!response.ok) {
      throw new Error("Failed to fetch geocoding data")
    }

    const data = await response.json()

    const results =
      data.results?.map((location: any) => ({
        name: location.name,
        country: location.country,
        lat: location.latitude,
        lon: location.longitude,
      })) || []

    return NextResponse.json({ results })
  } catch (error) {
    console.error("Geocoding error:", error)
    return NextResponse.json({ error: "Failed to search locations" }, { status: 500 })
  }
}
