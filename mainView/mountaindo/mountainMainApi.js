import React, { useRef, useState, useCallback, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Text,
  ImageBackground,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import IconButton from '../sub/IconButton';
import colors from '../sub/colors';
import { WINDOW_HEIGHT } from '../sub/dimensions';
import Route from '../scrapdo/route';
import { useNavigation } from '@react-navigation/native';
import MapView, { Marker } from 'react-native-maps';
import { basicAxios } from '../api/axios';
import MountainWeather from './mountainWeather';
import TrailButtonGroup from './TrailButtonGroup';

const MountainMainApi = ({ route }) => {
  const initialMountain = route.params.mountain;
  const [mountain, setMountain] = useState(initialMountain);
  const [routes, setRoutes] = useState([]);
  const [refreshKey, setRefreshKey] = useState(0);
  const scrollViewRef = useRef(null);

  const navigation = useNavigation();
  const latitude = mountain.centerlatlon[0];
  const longitude = mountain.centerlatlon[1];

  const handleRoutesFetched = useCallback((fetchedRoutes) => {
    setRoutes(fetchedRoutes);
  }, []);

  const handleRefresh = async () => {
    try {
      const response = await basicAxios.get(
        `/api/v1/auth/updatetrail?mountainid=${mountain.mountain_id}`
      );

      console.log('API Response:', response.data);

      // API 요청이 성공했으면 refreshKey 증가
      setRefreshKey((prevKey) => {
        const newKey = prevKey + 1;
        return newKey;
      });

      // 상태 업데이트
      setRoutes(response.data.trails || []); // 데이터를 업데이트 (빈 배열로 초기화 가능)
    } catch (error) {
      console.error('Error refreshing data:', error);
    }
  };

  return (
    <View style={styles.container}>
      <ImageBackground
        key={refreshKey}
        style={[styles.mountainImg]}
        source={{
          uri: `${basicAxios.defaults.baseURL}${mountain.image_info[0].img_url}.jpg`,
        }}
      >
        <View style={styles.wrapper}>
          <View style={styles.header}>
            <TouchableOpacity style={styles.leftBtn}>
              <IconButton
                iconName='chevron-left'
                onPress={() => navigation.goBack()}
              />
            </TouchableOpacity>
            <View style={styles.rightBtn}>
              <IconButton iconName='more-horizontal' />
            </View>
          </View>
        </View>
      </ImageBackground>
      <View style={styles.mountainInfoView}>
        <ScrollView
          ref={scrollViewRef}
          showsVerticalScrollIndicator={false}
          style={styles.mountainScroll}
        >
          <View style={styles.info}>
            <View style={styles.nameAndLocation}>
              <Text style={styles.name}>{mountain.mountain_name}</Text>
              <Text style={styles.location}>
                {mountain.elevation}m - {mountain.location}
              </Text>
            </View>
            <Text style={styles.comment}>{mountain.mountain_comment}</Text>
          </View>
          <MountainWeather
            mountainId={mountain.mountain_id}
            mountainName={mountain.mountain_name}
          />
          <View style={styles.mapView}>
            <Text style={styles.mapText}>{mountain.mountain_name} 지도</Text>
            <MapView
              style={styles.map}
              initialRegion={{
                latitude,
                longitude,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
              }}
            >
              {routes.map((route, index) => {
                const startPoint =
                  route.trail_id === 10001
                    ? JSON.parse(route.end_point) // trailId가 10001이면 endPoint를 startPoint로 사용
                    : JSON.parse(route.start_point);
                const endPoint = JSON.parse(route.end_point);

                if (!startPoint || startPoint.length < 2) {
                  console.warn(
                    `Invalid startPoint for route ${route.trail_name}`
                  );
                  return null;
                }
                return (
                  <Marker
                    key={index}
                    coordinate={{
                      latitude: startPoint[0],
                      longitude: startPoint[1],
                    }}
                    onPress={() =>
                      navigation.navigate('RouteMore', {
                        trail_id: route.trail_id,
                        name: route.trail_name,
                        endPoint: endPoint,
                        mountainId: mountain.mountain_id,
                        mountain,
                      })
                    }
                  >
                    <View style={styles.marker}>
                      <View style={styles.circle} />
                      <Text style={styles.routeNameMap}>
                        {route.trail_name}
                      </Text>
                    </View>
                  </Marker>
                );
              })}
            </MapView>
            <TouchableOpacity
              style={styles.startHikingButton}
              onPress={() =>
                navigation.navigate('HikingMapView', {
                  coordinates: [],
                  mountainId: mountain.mountain_id,
                  mountain,
                })
              }
            >
              <Text style={styles.startHikingText}>바로 등산 시작하기</Text>
            </TouchableOpacity>
            {mountain.mountain_id === 1 && <TrailButtonGroup />}
            <View style={styles.roadView}>
              <View style={styles.roadHeader}>
                <Text style={styles.roadText}>총 {routes.length} 개 코스</Text>
                <TouchableOpacity style={styles.refreshBtn}>
                  <IconButton
                    iconName='rotate-cw'
                    size={15}
                    onPress={handleRefresh}
                  />
                </TouchableOpacity>
              </View>
              <Route
                key={refreshKey}
                mountainId={mountain.mountain_id}
                onRoutesFetched={(fetchedRoutes) => {
                  setRoutes(fetchedRoutes);
                }}
                mountain={mountain}
              />
            </View>
          </View>
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mountainImg: {
    height: WINDOW_HEIGHT * 0.28,
  },
  header: {
    height: WINDOW_HEIGHT * 0.09,
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: WINDOW_HEIGHT * 0.035,
  },
  leftBtn: {
    flex: 1,
    alignItems: 'flex-start',
    margin: 5,
  },
  rightBtn: {
    flex: 1,
    alignItems: 'flex-end',
    margin: 5,
  },
  mountainInfoView: {
    flex: 1,
    backgroundColor: colors.white,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    overflow: 'hidden',
    marginTop: -30,
    paddingBottom: 20,
  },
  mountainScroll: {},
  info: {
    padding: 15,
    borderBottomWidth: 8,
    borderBottomColor: colors.vectorGray,
  },
  nameAndLocation: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  location: {
    color: colors.Gray,
    fontSize: 10,
    marginLeft: 10,
  },
  comment: {
    fontSize: 13,
    color: colors.Gray,
  },
  mapView: {
    padding: 15,
    overflow: 'hidden',
  },
  mapText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  map: {
    width: '100%',
    height: WINDOW_HEIGHT * 0.3,
    marginBottom: 15,
  },
  roadHeader: {
    flexDirection: 'row',
  },
  roadText: {
    fontSize: 22,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  refreshBtn: {
    marginTop: 10,
  },
  markerWrapper: {
    alignItems: 'center',
  },
  marker: {
    alignItems: 'center',
  },
  circle: {
    width: 15,
    height: 15,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    borderWidth: 2.5,
    borderColor: '#FF0000',
  },
  routeNameMap: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 7,
  },
  startHikingButton: {
    width: '100%',
    alignItems: 'center',
    marginTop: 10,
    padding: 10,
    borderColor: colors.mintGreen,
    borderWidth: 2,
    borderRadius: 5,
    backgroundColor: colors.mintGreen,
  },
  startHikingText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.white,
  },
});

export default MountainMainApi;
