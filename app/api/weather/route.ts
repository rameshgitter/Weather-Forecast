import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const lat = searchParams.get("lat")
  const lon = searchParams.get("lon")

  if (!lat || !lon) {
    return NextResponse.json({ error: "Latitude and longitude are required" }, { status: 400 })
  }

  try {
    const currentWeatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,rain,showers,snowfall,weather_code,cloud_cover,pressure_msl,surface_pressure,wind_speed_10m,wind_direction_10m,wind_gusts_10m,visibility,uv_index&timezone=auto`

    const forecastUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&hourly=temperature_2m,relative_humidity_2m,precipitation_probability,precipitation,rain,showers,snowfall,snow_depth,weather_code,pressure_msl,surface_pressure,cloud_cover,visibility,evapotranspiration,et0_fao_evapotranspiration,vapour_pressure_deficit,wind_speed_10m,wind_speed_80m,wind_speed_120m,wind_speed_180m,wind_direction_10m,wind_direction_80m,wind_direction_120m,wind_direction_180m,wind_gusts_10m,temperature_80m,temperature_120m,temperature_180m,soil_temperature_0cm,soil_temperature_6cm,soil_temperature_18cm,soil_temperature_54cm,soil_moisture_0_1cm,soil_moisture_1_3cm,soil_moisture_3_9cm,soil_moisture_9_27cm,soil_moisture_27_81cm&daily=weather_code,temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,sunrise,sunset,daylight_duration,sunshine_duration,uv_index_max,uv_index_clear_sky_max,precipitation_sum,rain_sum,showers_sum,snowfall_sum,precipitation_hours,precipitation_probability_max,wind_speed_10m_max,wind_gusts_10m_max,wind_direction_10m_dominant,shortwave_radiation_sum,et0_fao_evapotranspiration&timezone=auto`

    const [currentResponse, forecastResponse] = await Promise.all([fetch(currentWeatherUrl), fetch(forecastUrl)])

    if (!currentResponse.ok || !forecastResponse.ok) {
      throw new Error("Failed to fetch weather data")
    }

    const [currentData, forecastData] = await Promise.all([currentResponse.json(), forecastResponse.json()])

    // Process and structure the data
    const weatherData = {
      current: {
        temperature: currentData.current.temperature_2m,
        humidity: currentData.current.relative_humidity_2m,
        windSpeed: currentData.current.wind_speed_10m,
        windDirection: currentData.current.wind_direction_10m,
        weatherCode: currentData.current.weather_code,
        pressure: currentData.current.pressure_msl,
        visibility: currentData.current.visibility,
        uvIndex: currentData.current.uv_index,
        feelsLike: currentData.current.apparent_temperature,
      },
      hourly: {
        time: forecastData.hourly.time,
        temperature: forecastData.hourly.temperature_2m,
        humidity: forecastData.hourly.relative_humidity_2m,
        precipitation: forecastData.hourly.precipitation,
        windSpeed: forecastData.hourly.wind_speed_10m,
        weatherCode: forecastData.hourly.weather_code,
      },
      daily: {
        time: forecastData.daily.time,
        temperatureMax: forecastData.daily.temperature_2m_max,
        temperatureMin: forecastData.daily.temperature_2m_min,
        weatherCode: forecastData.daily.weather_code,
        precipitation: forecastData.daily.precipitation_sum,
        windSpeed: forecastData.daily.wind_speed_10m_max,
      },
    }

    return NextResponse.json(weatherData)
  } catch (error) {
    console.error("Weather API error:", error)
    return NextResponse.json({ error: "Failed to fetch weather data" }, { status: 500 })
  }
}
