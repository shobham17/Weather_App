
import axios from 'axios';

// Open-Meteo API – No API key required
export const fetchWeather = async (lat: number, lon: number) => {
  const res = await axios.get(
    `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=temperature_2m_max,temperature_2m_min,weathercode,sunrise,sunset&hourly=temperature_2m,weathercode&current_weather=true&timezone=auto`
  );

  const data = res.data;
  return {
    current: {
      temp: data.current_weather.temperature,
      weather: [
        {
          description: getWeatherDescription(data.current_weather.weathercode),
        },
      ],
      wind_speed: data.current_weather.windspeed,
      humidity: 33, // Placeholder
      weathercode: data.current_weather.weathercode,
      sunrise: data.daily.sunrise[0],
      sunset: data.daily.sunset[0],
    },
    daily: data.daily,
    hourly: data.hourly, 
  };
};

export const getCoordinates = async (city: string) => {
  const res = await axios.get(
    `http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=794ee23e54eb522c2823908cde48fc25`
  );
  return res.data[0];
};

export const getWeatherDescription = (code: number) => {
  const map: Record<number, string> = {
    0: 'clear sky',
    1: 'mainly clear',
    2: 'partly cloudy',
    3: 'overcast',
    45: 'fog',
    48: 'freezing fog',
    51: 'light drizzle',
    53: 'moderate drizzle',
    55: 'dense drizzle',
    56: 'light freezing drizzle',
    57: 'dense freezing drizzle',
    61: 'slight rain',
    63: 'moderate rain',
    65: 'heavy rain',
    66: 'light freezing rain',
    67: 'heavy freezing rain',
    71: 'slight snow fall',
    73: 'moderate snow fall',
    75: 'heavy snow fall',
    77: 'snow grains',
    80: 'light showers',
    81: 'moderate showers',
    82: 'violent showers',
    85: 'light snow showers',
    86: 'heavy snow showers',
    95: 'thunderstorm',
    96: 'thunderstorm with slight hail',
    99: 'thunderstorm with heavy hail',
  };
  return map[code] || 'unknown';
};
