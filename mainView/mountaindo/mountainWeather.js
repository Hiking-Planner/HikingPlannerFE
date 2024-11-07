// MountainWeather.js
import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, ScrollView } from 'react-native';
import { basicAxios } from '../api/axios';
import colors from '../sub/colors';

export default function MountainWeather({ mountainId, mountainName }) {
  const [weatherData, setWeatherData] = useState([]);
  const [currentWeather, setCurrentWeather] = useState(null);

  useEffect(() => {
    fetchWeather(mountainId);
  }, [mountainId]);

  const fetchWeather = async (mountainId) => {
    try {
      const requestUrl = `/api/v1/auth/api/weather/{mtid}?mtid=${mountainId}`;
      const response = await basicAxios.get(requestUrl);

      const data =
        typeof response.data === 'string'
          ? JSON.parse(response.data)
          : response.data;

      const dailyWeather = data.list
        .filter((_, index) => index % 8 === 0)
        .slice(0, 5)
        .map((item) => {
          const date = new Date(item.dt * 1000).toLocaleDateString('ko-KR', {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
          });
          const temp = item.main.temp;
          const iconUrl = `http://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`;

          return {
            date,
            temp,
            iconUrl,
            windSpeed: item.wind.speed,
            rainProbability: item.pop * 100,
          };
        });

      setWeatherData(dailyWeather);

      const currentItem = data.list[0];
      setCurrentWeather({
        temp: currentItem.main.temp,
        feelsLike: currentItem.main.feels_like,
        iconUrl: `http://openweathermap.org/img/wn/${currentItem.weather[0].icon}@2x.png`,
        windSpeed: currentItem.wind.speed,
      });
    } catch (error) {
      console.error('날씨 정보를 가져오지 못했습니다:', error);
    }
  };

  return (
    <View style={styles.weatherContainer}>
      <Text style={styles.weatherTitle}>{mountainName} 날씨</Text>

      {currentWeather && (
        <View style={styles.currentWeather}>
          <Image
            source={{ uri: currentWeather.iconUrl }}
            style={styles.weatherIconLarge}
          />
          <Text style={styles.currentTemp}>{currentWeather.temp}°C</Text>
          <Text>체감 온도: {currentWeather.feelsLike}°C</Text>
          <Text>풍속: {currentWeather.windSpeed} m/s</Text>
        </View>
      )}

      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {weatherData.map((item, index) => (
          <View key={index} style={styles.weatherItem}>
            <Text style={styles.day}>{item.date}</Text>
            <Image source={{ uri: item.iconUrl }} style={styles.weatherIcon} />
            <Text style={styles.temp}>평균: {item.temp}°C</Text>
            <Text>풍속: {item.windSpeed} m/s</Text>
            <Text>강수 확률: {item.rainProbability}%</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  weatherContainer: {
    padding: 15,
    backgroundColor: colors.white,
  },
  weatherTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  currentWeather: {
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: 20,
  },
  weatherItem: {
    alignItems: 'center',
    marginRight: 15,
    width: 100,
  },
  day: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  temp: {
    fontSize: 14,
    fontWeight: 'bold',
    marginVertical: 5,
  },
  weatherIcon: {
    width: 40,
    height: 40,
    marginBottom: 5,
  },
  weatherIconLarge: {
    width: 55,
    height: 55,
    marginBottom: 10,
  },
  currentTemp: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 5,
  },
});
