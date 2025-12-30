# 🌦️ Weather Forecast App

A modern, full-featured weather application built with **Next.js 14**, **TypeScript**, and **Tailwind CSS**. Get real-time weather data, detailed forecasts, and beautiful visualizations for any location worldwide.

![Weather App Screenshot](https://img.shields.io/badge/Status-Live-brightgreen) ![Next.js](https://img.shields.io/badge/Next.js-14-black) ![TypeScript](https://img.shields.io/badge/TypeScript-5-blue) ![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-38bdf8)

## ✨ Features

### 🌍 **Location & Search**
- **Smart Location Search** with autocomplete for worldwide cities
- **Current Location Detection** using geolocation API
- **Reverse Geocoding** for coordinate-to-location conversion
- **Global Coverage** - search any city, town, or coordinates

### 🌡️ **Weather Data (100% Real)**
- **Current Weather Conditions** with live updates
- **7-Day Detailed Forecasts** with daily highs/lows
- **24-Hour Hourly Forecasts** with minute precision
- **Real-time Data** from Open-Meteo API (professional meteorological sources)

### 📊 **Data Visualization**
- **Interactive Charts** showing temperature, humidity, precipitation, and wind trends
- **24-Hour Temperature Curves** with smooth line charts
- **Weekly Bar Charts** for precipitation and temperature ranges
- **Custom SVG Charts** that work on all devices
- **Responsive Design** adapting to any screen size

### 🗺️ **Weather Maps & Radar**
- **Interactive Weather Maps** with multiple layers
- **Temperature, Precipitation, Wind, and Pressure overlays**
- **Simulated Weather Radar** with animated elements
- **Satellite View** with cloud pattern visualization
- **Zoom Controls** and layer switching

### 🎨 **Modern UI/UX**
- **Glassmorphism Design** with backdrop blur effects
- **Dynamic Backgrounds** that change based on weather conditions
- **Smooth Animations** and hover effects throughout
- **Mobile-First Responsive** design
- **Dark/Light Theme** adaptation based on weather
- **Professional Color Schemes** with weather-specific gradients

### 📱 **User Experience**
- **Real-time Clock** display
- **Loading States** with skeleton animations
- **Error Handling** with user-friendly messages
- **Accessibility Features** with proper ARIA labels
- **Fast Performance** with optimized API calls
- **Offline-Ready** with cached data

## 🚀 Live Demo

Visit the live application at:
```
https://v0-flask-weather-app.vercel.app/
```

## 🛠️ Tech Stack

### **Frontend**
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - Modern UI component library
- **Lucide React** - Beautiful icon library

### **APIs & Data**
- **Open-Meteo API** - Professional weather data (free, no API key required)
- **Geocoding API** - Location search and reverse geocoding
- **Browser Geolocation API** - Current location detection

### **Charts & Visualization**
- **Custom SVG Charts** - Lightweight, responsive data visualization
- **Real-time Data Processing** - Live weather data rendering

## 📦 Installation

### Prerequisites
- Node.js 18 or higher
- npm, yarn, or pnpm

### Quick Start

```bash
# Clone the repository
git clone https://github.com/yourusername/weather-forecast-app.git

# Navigate to project directory
cd weather-forecast-app

# Install dependencies
npm install
# or
yarn install
# or
pnpm install

# Start development server
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the app.

## 🏗️ Project Structure

```
weather-forecast-app/
├── app/
│   ├── api/
│   │   ├── geocoding/
│   │   │   └── route.ts          # Location search API
│   │   ├── reverse-geocoding/
│   │   │   └── route.ts          # Coordinate to location API
│   │   └── weather/
│   │       └── route.ts          # Weather data API
│   ├── globals.css               # Global styles
│   ├── layout.tsx                # Root layout
│   ├── loading.tsx               # Loading component
│   └── page.tsx                  # Main weather app page
├── components/
│   ├── ui/                       # shadcn/ui components
│   ├── forecast-card.tsx         # Daily forecast cards
│   ├── weather-chart.tsx         # Interactive charts
│   ├── weather-details.tsx       # Hourly forecast table
│   └── weather-map.tsx           # Weather maps and radar
├── lib/
│   └── utils.ts                  # Utility functions
├── public/                       # Static assets
├── README.md                     # Project documentation
├── next.config.mjs               # Next.js configuration
├── package.json                  # Dependencies and scripts
├── tailwind.config.ts            # Tailwind CSS configuration
└── tsconfig.json                 # TypeScript configuration
```

## 🌐 API Integration

### Open-Meteo Weather API

This app uses the **Open-Meteo API**, which provides:
- ✅ **Free usage** (no API key required)
- ✅ **Professional-grade data** from ECMWF, GFS, and national weather services
- ✅ **Global coverage** with high accuracy
- ✅ **Real-time updates** every hour
- ✅ **Historical data** and forecasts up to 16 days

### API Endpoints

```typescript
// Current weather and forecasts
GET /api/weather?lat={latitude}&lon={longitude}

// Location search
GET /api/geocoding?q={query}

// Reverse geocoding
GET /api/reverse-geocoding?lat={latitude}&lon={longitude}
```

## 🎨 Customization

### Themes & Colors

The app automatically adapts its color scheme based on weather conditions:

```typescript
// Weather-based gradients
const weatherGradients = {
  0: "from-yellow-400 to-orange-400",    // Clear sky
  61: "from-blue-600 to-blue-800",       // Rain
  95: "from-purple-600 to-purple-800",   // Thunderstorm
  // ... more conditions
}
```

### Adding New Features

1. **New Weather Parameters**: Add to the API route and update TypeScript interfaces
2. **Custom Charts**: Create new chart components in `components/`
3. **Additional APIs**: Integrate new data sources in `app/api/`

## 📱 Responsive Design

The app is fully responsive and optimized for:
- 📱 **Mobile devices** (320px+)
- 📱 **Tablets** (768px+)
- 💻 **Desktops** (1024px+)
- 🖥️ **Large screens** (1440px+)

## 🚀 Deployment

### Deploy to Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

Or connect your GitHub repository to Vercel for automatic deployments.

### Deploy to Netlify

```bash
# Build the project
npm run build

# Deploy the 'out' folder to Netlify
```

### Environment Variables

No environment variables required! The app uses free APIs that don't need authentication.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

### Development Guidelines

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/AmazingFeature`)
3. **Commit** your changes (`git commit -m 'Add some AmazingFeature'`)
4. **Push** to the branch (`git push origin feature/AmazingFeature`)
5. **Open** a Pull Request

### Code Style

- Use **TypeScript** for all new code
- Follow **ESLint** and **Prettier** configurations
- Write **meaningful commit messages**
- Add **comments** for complex logic

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Open-Meteo** for providing free, high-quality weather data
- **shadcn/ui** for the beautiful component library
- **Vercel** for hosting and deployment platform
- **Tailwind CSS** for the utility-first CSS framework

## 📞 Support

If you have any questions or need help:

- 📧 **Email**: sorenramesh868@gmail.com
- 🐛 **Issues**: [GitHub Issues](https://github.com/rameshgitter/weather-forecast-app/issues)
- 💬 **Discussions**: [GitHub Discussions](https://github.com/rameshgitter/weather-forecast-app/discussions)

## ⭐ Show Your Support

If you found this project helpful, please give it a ⭐ on GitHub!

---

**Built with ❤️ using Next.js, TypeScript, and real weather data**
