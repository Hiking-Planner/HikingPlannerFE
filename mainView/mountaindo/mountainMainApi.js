import React, { useRef, useState, useCallback } from 'react';
import {
  View,
  StyleSheet,
  Text,
  ImageBackground,
  Animated,
  TouchableOpacity,
} from 'react-native';
import IconButton from '../sub/IconButton';
import colors from '../sub/colors';
import { WINDOW_HEIGHT } from '../sub/dimensions';
import Route from '../scrapdo/route';
import { useNavigation } from '@react-navigation/native';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';

const AnimatedImageBackground =
  Animated.createAnimatedComponent(ImageBackground);

export default function MountainMainApi({ route }) {
  const { mountain } = route.params;
  const [routes, setRoutes] = useState([]);
  const [refreshKey, setRefreshKey] = useState(0); // refreshKey 상태 추가
  const scrollY = useRef(new Animated.Value(0)).current;

  const headerHeight = scrollY.interpolate({
    inputRange: [0, WINDOW_HEIGHT * 0.15 * 4],
    outputRange: [WINDOW_HEIGHT * 0.35, 0],
    extrapolate: 'clamp',
  });

  const navigation = useNavigation();

  const latitude = mountain.centerlatlon[0];
  const longitude = mountain.centerlatlon[1];

  const handleRoutesFetched = useCallback((fetchedRoutes) => {
    setRoutes(fetchedRoutes);
  }, []);

  const handleRefresh = () => {
    setRefreshKey((prevKey) => prevKey + 1); // refreshKey 업데이트
  };

  return (
    <View style={styles.container}>
      <AnimatedImageBackground
        style={[styles.mountainImg, { height: headerHeight }]}
        source={{
          uri: `http://3.34.159.30:8080/${mountain.image_info[0].img_url}`,
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
      </AnimatedImageBackground>
      <View style={styles.mountainInfoView}>
        <Animated.ScrollView
          showsVerticalScrollIndicator={false}
          style={styles.mountainScroll}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
            { useNativeDriver: false }
          )}
          scrollEventThrottle={16}
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
          <View style={styles.mapView}>
            <Text style={styles.mapText}>{mountain.mountain_name} 지도</Text>
            <MapView
              style={styles.map}
              provider={PROVIDER_GOOGLE}
              initialRegion={{
                latitude,
                longitude,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
              }}
            >
              {routes.map((route, index) => {
                const startPoint = JSON.parse(route.start_point);
                const endPoint = JSON.parse(route.end_point);
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
            <View style={styles.roadView}>
              <View style={styles.roadHeader}>
                <Text style={styles.roadText}>총 {routes.length} 개 코스</Text>
                <TouchableOpacity style={styles.refreshBtn}>
                  <IconButton
                    iconName='rotate-cw'
                    size={15}
                    onPress={() => {
                      handleRefresh();
                    }}
                  />
                </TouchableOpacity>
              </View>
              <Route
                key={refreshKey} // key prop 추가
                mountainId={mountain.mountain_id}
                onRoutesFetched={handleRoutesFetched}
              />
            </View>
          </View>
          <View style={styles.weatherView}>
            <Text style={styles.weatherText}>
              {mountain.mountain_name} 날씨
            </Text>
            <View style={styles.weather}></View>
          </View>
        </Animated.ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mountainImg: {
    height: WINDOW_HEIGHT * 0.35,
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
  weatherView: {
    padding: 15,
    borderBottomWidth: 8,
    borderBottomColor: colors.vectorGray,
    overflow: 'hidden',
  },
  weatherText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  weather: {
    width: '100%',
    height: WINDOW_HEIGHT * 0.3,
    backgroundColor: colors.Gray,
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
});
