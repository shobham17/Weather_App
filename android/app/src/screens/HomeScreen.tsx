import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TextInput,
  Alert,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import DailyCard from '../components/DailyCard';
import { fetchWeather, getCoordinates,getWeatherDescription } from '../api/weatherApi';
import HourlyCard from '../components/HourlyCard';


interface DailyWeather {
  day: string;
  date: string;
  max: number;
  min: number;
  code: number;
}



const HomeScreen = () => {
    
  const [weatherData, setWeatherData] = useState<any>(null);
  const [city, setCity] = useState('Delhi');
  const [inputCity, setInputCity] = useState('Delhi');

 const loadWeather = async (cityName: string) => {
  if (!cityName || cityName.trim() === '') {
    Alert.alert('City Required', 'Please enter a city name.');
    return;
  }

  try {
    console.log('🌐 Fetching location for:', cityName);
    const location = await getCoordinates(cityName);
    console.log('📍 Coordinates:', location.lat, location.lon);

    const data = await fetchWeather(location.lat, location.lon);
    console.log('🌦 Weather Data:', data);

    setWeatherData(data);
    setCity(cityName);
  } catch (error: any) {
    console.log('❌ Error loading weather:', error.message);
    Alert.alert('City not found', 'Please enter a valid city name.');
  }
};



useEffect(() => {
  console.log('📦 useEffect running with city:', city);
  loadWeather(city);
}, []);

  if (!weatherData) {
    return (
      <LinearGradient colors={['#0f2027', '#203a43']} style={styles.container}>
        <Text style={styles.loading}>Loading...</Text>
      </LinearGradient>
    );
  }

const daily: DailyWeather[] = weatherData.daily.time.map((date: string, i: number) => {
  const d = new Date(date);
  return {
    day: d.toLocaleDateString('en-US', { weekday: 'short' }), // e.g., Fri
    date: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }), // e.g., Jul 12
    max: weatherData.daily.temperature_2m_max[i],
    min: weatherData.daily.temperature_2m_min[i],
    code: weatherData.daily.weathercode[i],
  };
});






const current = weatherData.current;

interface HourlyWeather {
  time: string;
  temp: number;
  code: number;
}

const hourly = weatherData?.hourly?.time?.slice(0, 24).map((time: string, i: number) => ({
  time: new Date(time).toLocaleTimeString([], { hour: '2-digit', hour12: true }),
  temp: weatherData.hourly.temperature_2m[i],
  code: weatherData.hourly.weathercode[i],
}));

  

const getIconFromCode = (code: number) => {
  if (code === 0) return require('../assets/sun.png');
  if (code === 1) return require('../assets/sun-small-cloud.png');
  if (code === 2) return require('../assets/cloud-sun.png');
  if (code === 3) return require('../assets/cloud.png');

  if ([45, 48].includes(code)) return require('../assets/fog.png');

  if ([51, 53, 55].includes(code)) return require('../assets/cloud-drizzle.png');
  if ([56, 57].includes(code)) return require('../assets/cloud-drizzle-snowflake.png');

  if ([61, 63].includes(code)) return require('../assets/cloud-rain.png');
  if (code === 65) return require('../assets/cloud-rain-heavy.png');
  if ([66, 67].includes(code)) return require('../assets/cloud-rain-snowflake.png');

  if ([71, 73].includes(code)) return require('../assets/cloud-snow.png');
  if (code === 75) return require('../assets/cloud-snow-heavy.png');
  if (code === 77) return require('../assets/cloud-snow-grains.png');
  if ([80,82].includes(code)) return require('../assets/cloud-drizzle-heavy.png')
  if ([85, 86].includes(code)) return require('../assets/snow-shower.png');

  if ([95, 96, 99].includes(code)) return require('../assets/thunderstorm.png');

  return require('../assets/sun.png'); // fallback
};




  return (
    <LinearGradient colors={['#0f2027', '#203a43']} style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Enter city"
        placeholderTextColor="#ccc"
        value={inputCity}
        onChangeText={setInputCity}
        onSubmitEditing={() => 
          setCity(inputcity);
          loadWeather(inputCity);}
      />

      <View style={styles.topSection}>
        <Text style={styles.city}>
          {city}, <Text style={{ fontWeight: '300' }}>Weather</Text>
        </Text>
        <Image
          source={getIconFromCode(current.weathercode)}
          style={styles.icon}
        />

        <Text style={styles.temp}>{Math.round(current.temp)}°</Text>
        <Text style={styles.desc}>{getWeatherDescription(current.weathercode)}</Text>


        <View style={styles.row}>
          <Text style={styles.detail}>🌬 {current.wind_speed} km/h</Text>
          
          <Text style={styles.detail}>
            🌅 {new Date(current.sunrise).toLocaleTimeString()}
          </Text>
          <Text style={styles.detail}>
            🌇 {new Date(current.sunset).toLocaleTimeString()}
          </Text>

        </View>
      </View>

      <View style={{ marginBottom: -10 }}>
  <Text style={styles.dailyTitle}>Next 24 Hours</Text>
  <ScrollView
    horizontal
    showsHorizontalScrollIndicator={false}
    contentContainerStyle={{ paddingVertical: 10 }} // <-- Add some vertical padding
  >
    {hourly.map((hour: HourlyWeather, index: number) => (
      <HourlyCard
        key={index}
        time={hour.time}
        icon={getIconFromCode(hour.code)}
        temp={hour.temp}
      />
    ))}
  </ScrollView>
</View>




      

      <Text style={styles.dailyTitle}>Weekly forecast</Text>
      <ScrollView  showsHorizontalScrollIndicator={false}>
  {daily.map((day, index) => (
    <DailyCard
  key={index}
  day={day.day}
  date={day.date}
  icon={getIconFromCode(day.code)}
  temp={`${day.max}° / ${day.min}°`}
/>

  ))}
</ScrollView>

    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  loading: { marginTop: 100, textAlign: 'center', color: '#fff' },
  input: {
    borderColor: '#555',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 8,
    color: '#fff',
    backgroundColor: '#1a1a1a',
    marginBottom: -10,
    marginTop: 30
  },
  topSection: { alignItems: 'center', marginTop: 20 },
  city: { fontSize: 22, color: '#fff' },
  icon: { width: 100, height: 100, marginVertical: 10 },
  temp: { fontSize: 64, color: '#fff', fontWeight: '300' },
  desc: { fontSize: 18, color: '#ccc' },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 20,
  },
  detail: { color: '#ccc' },
  dailyTitle: {
    fontSize: 18,
    color: '#fff',
    marginTop: 30,
    marginBottom: 10,
  },
});

export default HomeScreen;
