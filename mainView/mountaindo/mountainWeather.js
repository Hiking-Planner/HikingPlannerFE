import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, ScrollView } from 'react-native';
import { basicAxios } from '../api/axios';
import colors from '../sub/colors';

export default function MountainWeather({ mountainId, mountainName }) {
  const [weatherData, setWeatherData] = useState([]);
  const [currentWeather, setCurrentWeather] = useState(null);
  const [sunInfo, setSunInfo] = useState({ sunrise: '0500', sunset: '1800' });
  const [clothingRecommendation, setClothingRecommendation] = useState('');

  useEffect(() => {
    fetchWeather(mountainId);
    fetchSunInfo(mountainId);
  }, [mountainId]);

  useEffect(() => {
    if (currentWeather?.feelsLike) {
      fetchClothingRecommendation(currentWeather.feelsLike);
    }
  }, [currentWeather]);

  const fetchClothingRecommendation = async (temp) => {
    const requestUrl = `/api/v1/auth/clothesrecommend?temp=${temp}`;

    try {
      const response = await basicAxios.get(requestUrl);
      setClothingRecommendation(response.data); // 서버 응답을 그대로 저장
    } catch (error) {
      console.error('옷차림 추천 정보를 가져오지 못했습니다:', error);
    }
  };

  const fetchWeather = async (mountainId) => {
    try {
      const requestUrl = `/api/v1/auth/api/weather/${mountainId}`;
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
          const minTemp = item.main.temp_min;
          const maxTemp = item.main.temp_max;
          const feelsLike = item.main.feels_like;
          const rainProbability = Math.round(item.pop * 100);
          const iconUrl = `http://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`;

          return {
            date,
            minTemp,
            maxTemp,
            feelsLike,
            rainProbability,
            iconUrl,
            windSpeed: item.wind.speed,
          };
        });

      setWeatherData(dailyWeather);

      const currentItem = data.list[0];
      setCurrentWeather({
        minTemp: currentItem.main.temp_min,
        maxTemp: currentItem.main.temp_max,
        feelsLike: currentItem.main.feels_like,
        rainProbability: Math.round(currentItem.pop * 100),
        iconUrl: `http://openweathermap.org/img/wn/${currentItem.weather[0].icon}@2x.png`,
      });
    } catch (error) {
      console.error('날씨 정보를 가져오지 못했습니다:', error);
    }
  };

  const fetchSunInfo = async (mountainId) => {
    const today = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const requestUrl = `/api/v1/auth/api/suninfo/${mountainId}?dateinfo=${today}`;

    try {
      const response = await basicAxios.get(requestUrl);
      const data =
        typeof response.data === 'string'
          ? JSON.parse(response.data)
          : response.data;

      setSunInfo({
        sunrise: `${data.sunrise.slice(0, 2)}:${data.sunrise.slice(2)}`,
        sunset: `${data.sunset.slice(0, 2)}:${data.sunset.slice(2)}`,
      });
    } catch (error) {
      console.error('일출 및 일몰 정보를 가져오지 못했습니다:', error);
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
          <Text style={styles.currentTemp}>
            {currentWeather.minTemp}°C / {currentWeather.maxTemp}°C
          </Text>
          <Text style={styles.currentText}>
            체감 {currentWeather.feelsLike}°C
          </Text>
          <Text style={styles.currentText}>
            강수 {currentWeather.rainProbability}%
          </Text>

          {/* 옷차림 추천 문구 */}
          <View style={styles.outfitRecommendation}>
            <Text style={styles.outfitHeaderText}>오늘의 옷차림 정보</Text>
            <Text style={styles.outfitText}>
              {'\n'}
              {clothingRecommendation ||
                '꽃샘 추위와 바람을 막아 줄 바람막이, 스트레치 소재의 긴바지를 추천해요. 낮과 밤의 일교차가 심하고 날씨가 변덕스러우니 얇은 옷을 여러 겹 입으세요!'}
            </Text>
          </View>

          {/* 일출 및 일몰 정보 */}
          <View style={styles.sunInfoContainer}>
            <View style={styles.sunriseContainer}>
              <Text style={styles.sunriseText}>
                일출{'\n'}
                {sunInfo.sunrise}
              </Text>
            </View>
            <View style={styles.sunsetContainer}>
              <Text style={styles.sunsetText}>
                일몰{'\n'}
                {sunInfo.sunset}
              </Text>
            </View>
          </View>
        </View>
      )}

      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {weatherData.map((item, index) => (
          <View key={index} style={styles.weatherItem}>
            <Text style={styles.day}>{item.date}</Text>
            <Image source={{ uri: item.iconUrl }} style={styles.weatherIcon} />
            <Text style={styles.temp}>
              {item.minTemp}°C / {item.maxTemp}°C
            </Text>
            <Text style={styles.dayText}>체감 {item.feelsLike}°C</Text>
            <Text style={styles.dayText}>강수 {item.rainProbability}%</Text>
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
  outfitRecommendation: {
    backgroundColor: '#fff9c4', // 연한 노란 파스텔톤
    padding: 10,
    borderRadius: 10,
    marginVertical: 10,
  },
  outfitHeaderText: {
    color: '#ff8c00', // 원하는 색상, 예: 오렌지 계열
    fontSize: 13,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  outfitText: {
    color: 'black',
    fontSize: 11,
    textAlign: 'center',
  },
  sunInfoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 10,
  },
  sunriseContainer: {
    backgroundColor: '#b3e5fc', // 연한 파란색 파스텔톤
    padding: 10,
    borderRadius: 10,
    marginHorizontal: 5,
    flex: 1,
  },
  sunsetContainer: {
    backgroundColor: '#ffe0b2', // 연한 주황색 파스텔톤
    padding: 10,
    borderRadius: 10,
    marginHorizontal: 5,
    flex: 1,
  },
  sunriseText: {
    color: 'green',
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  sunsetText: {
    color: '#ff4500',
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
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
    fontSize: 10,
    fontWeight: 'bold',
    marginVertical: 5,
  },
  weatherIcon: {
    width: 50,
    height: 50,
    marginBottom: 5,
  },
  weatherIconLarge: {
    width: 70,
    height: 70,
    marginBottom: 10,
  },
  currentTemp: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  currentText: {
    fontSize: 12,
  },
  dayText: {
    fontSize: 11,
  },
});
