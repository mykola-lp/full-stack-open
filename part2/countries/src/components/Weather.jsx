import { useState, useEffect } from 'react'

import axios from 'axios'

import Heading from './Heading'

const Weather = ({ capital }) => {
  const [weather, setWeather] = useState(null)

  useEffect(() => {
    if (!capital) return

    const apiKey = import.meta.env.VITE_WEATHER_API_KEY
    const encodedCapital = encodeURIComponent(capital)

    axios
      .get(
        `https://api.openweathermap.org/data/2.5/weather?q=${encodedCapital}&units=metric&appid=${apiKey}`
      )
      .then(
        response => setWeather(response.data)
      )
      .catch(
        error => console.error("Weather API error:", error)
      )
  }, [capital])

  if (!weather) return null

  return (
    <div>
      <Heading level={3}>Weather in {capital}</Heading>

      <p>Temperature: {weather.main.temp} °C</p>
  
      <img
        src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
        alt="weather icon"
      />

      <p>Wind: {weather.wind.speed} m/s</p>
    </div>
  )
}

export default Weather
