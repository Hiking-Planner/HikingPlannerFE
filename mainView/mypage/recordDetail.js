import React, { useRef } from 'react';
import {
  View,
  StyleSheet,
  Text,
  Animated,
  TouchableOpacity,
  Image,
  ImageBackground,
} from 'react-native';
import MapView, { Polyline } from 'react-native-maps';
import IconButton from '../sub/IconButton';
import colors from '../sub/colors';
import { WINDOW_HEIGHT } from '../sub/dimensions';
import { useNavigation, useRoute } from '@react-navigation/native';

const AnimatedImageBackground =
  Animated.createAnimatedComponent(ImageBackground);

export default function RecordDetail() {
  const scrollY = useRef(new Animated.Value(0)).current;
  const navigation = useNavigation();
  const route = useRoute();

  const { image, title, height, location, date, time } = route.params;

  let { hikingTrailData } = route.params;

  // JSON 문자열로 전달된 경우 파싱
  if (typeof hikingTrailData === 'string') {
    try {
      hikingTrailData = JSON.parse(hikingTrailData);
    } catch (error) {
      console.error('Failed to parse hikingTrailData:', error);
      hikingTrailData = []; // 오류 시 빈 배열로 설정
    }
  }

  const headerHeight = scrollY.interpolate({
    inputRange: [0, WINDOW_HEIGHT * 0.15 * 4],
    outputRange: [WINDOW_HEIGHT * 0.35, 0],
    extrapolate: 'clamp',
  });

  return (
    <View style={styles.container}>
      <AnimatedImageBackground
        style={[styles.mountainImg, { height: headerHeight }]}
        source={
          image ? { uri: image } : require('../../assets/mountain/achasan.png')
        }
      >
        <View style={styles.wrapper}>
          <View style={styles.header}>
            <TouchableOpacity style={styles.leftBtn}>
              <IconButton
                iconName='chevron-left'
                onPress={() => navigation.goBack()}
              />
            </TouchableOpacity>
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
          <View style={styles.recordInfo}>
            <Text style={styles.mountainTitle}>
              {title}{' '}
              <Text style={styles.mountainHeight}>
                {height}m - {location}
              </Text>
            </Text>
            <View style={styles.hikingDetails}>
              <View style={styles.hikingDateView}>
                <Image
                  source={require('../../assets/icon/time.png')}
                  style={styles.timeImg}
                />
                <Text style={styles.hikingDateTime}>
                  {date} {time}
                </Text>
              </View>
            </View>
          </View>

          {/* 지도에 경로 표시 */}
          <Text style={styles.sectionTitle}>상세 경로</Text>
          {Array.isArray(hikingTrailData) && hikingTrailData.length >= 2 ? (
            <MapView
              style={styles.map}
              initialRegion={{
                latitude: hikingTrailData[0].latitude,
                longitude: hikingTrailData[0].longitude,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
              }}
            >
              <Polyline
                coordinates={hikingTrailData}
                strokeColor='#f01111'
                strokeWidth={5}
              />
            </MapView>
          ) : (
            <View style={styles.mapPlaceholder}>
              <Text style={styles.mapPlaceholderText}>
                경로 데이터가 없습니다.
              </Text>
            </View>
          )}
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
  mountainInfoView: {
    flex: 1,
    backgroundColor: colors.white,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    overflow: 'hidden',
    marginTop: -30,
    paddingBottom: 20,
  },
  mountainScroll: {
    paddingHorizontal: 20,
    marginBottom: 60,
  },
  recordInfo: {
    marginTop: 20,
  },
  mountainTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  mountainHeight: {
    fontSize: 14,
    color: '#888',
  },
  hikingDetails: {
    flexDirection: 'row',
    marginTop: 10,
  },
  hikingDateView: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
  },
  timeImg: {
    width: 18,
    height: 18,
    marginRight: 5,
    tintColor: '#aaa',
  },
  hikingDateTime: {
    fontSize: 12,
    color: '#aaa',
    marginLeft: 5,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
  map: {
    height: WINDOW_HEIGHT * 0.4,
    borderRadius: 10,
  },
  mapPlaceholder: {
    height: WINDOW_HEIGHT * 0.4,
    backgroundColor: '#87CEEB',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  mapPlaceholderText: {
    fontSize: 14,
    color: '#ffffff',
  },
});
