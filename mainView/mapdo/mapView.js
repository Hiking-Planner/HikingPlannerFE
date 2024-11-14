import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
  Image,
  Text,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import IconButton from '../sub/IconButton';
import { useNavigation, useRoute } from '@react-navigation/native';
import MapView, { PROVIDER_GOOGLE, Polyline, Marker } from 'react-native-maps';
import { WINDOW_HEIGHT } from '../sub/dimensions';
import * as Location from 'expo-location';
import { authAxios } from '../api/axios';
import RoadWarningButton from './RoadWarningButton';
import StartStopButton from './StartStopButton';
import colors from '../sub/colors';
import SosButton from './SosButton';
import _ from 'lodash';

export const HikingMapView = () => {
  const [location, setLocation] = useState(null);
  const [route, setRoute] = useState([]);
  const [initialRegion, setInitialRegion] = useState(null);
  const [tracking, setTracking] = useState(false);
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reports, setReports] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);
  const [isFinished, setIsFinished] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const navigation = useNavigation();
  const routeParams = useRoute().params;
  const coordinates = routeParams?.coordinates || [];
  const mountainId = routeParams?.mountainId;
  const endPoint = routeParams?.endPoint;
  const mountain = routeParams?.mountain;

  const mapRef = useRef(null);

  useEffect(() => {
    const initializeData = async () => {
      await Promise.all([initializeLocation(), loadReportsFromStorage()]);
    };
    initializeData();
  }, []);

  useEffect(() => {
    const toggleTracking = async () => {
      if (tracking) {
        await startLocationTracking();
      } else {
        stopLocationTracking();
      }
    };
    toggleTracking();
  }, [tracking]);

  const initializeLocation = async () => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.error('Location permission not granted');
        return;
      }

      const initialLocation = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = initialLocation.coords;
      setLocation(initialLocation.coords);
      setInitialRegion({
        latitude,
        longitude,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
      });
      setLoading(false);
    } catch (error) {
      console.error('Error initializing location:', error);
    }
  };

  const startLocationTracking = async () => {
    const locationSubscription = await Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.BestForNavigation,
        timeInterval: 30000, // 시간 간격을 늘림
        distanceInterval: 10, // 최소 거리 기준을 설정
      },
      (newLocation) => {
        const { latitude, longitude } = newLocation.coords;
        const timestamp = newLocation.timestamp;
        const lastKnownLocation =
          route.length > 0 ? route[route.length - 1] : null;

        setRoute((currentRoute) => {
          if (lastKnownLocation) {
            const interpolatedPoints = interpolatePath(lastKnownLocation, {
              latitude,
              longitude,
              timestamp,
            });
            return [
              ...currentRoute,
              ...interpolatedPoints,
              { latitude, longitude, timestamp },
            ];
          } else {
            return [...currentRoute, { latitude, longitude, timestamp }];
          }
        });

        mapRef.current?.animateToRegion({
          latitude,
          longitude,
          latitudeDelta: 0.005,
          longitudeDelta: 0.005,
        });
      }
    );

    setSubscription(locationSubscription);
  };

  const stopLocationTracking = () => {
    if (subscription) {
      subscription.remove();
      setSubscription(null);
    }
  };

  const interpolatePath = (pointA, pointB, numPoints = 4) => {
    let interpolatedPoints = [];
    for (let i = 1; i <= numPoints; i++) {
      let latitude =
        pointA.latitude +
        ((pointB.latitude - pointA.latitude) * i) / (numPoints + 1);
      let longitude =
        pointA.longitude +
        ((pointB.longitude - pointA.longitude) * i) / (numPoints + 1);
      let timestamp =
        pointA.timestamp +
        ((pointB.timestamp - pointA.timestamp) * i) / (numPoints + 1);
      interpolatedPoints.push({ latitude, longitude, timestamp });
    }
    return interpolatedPoints;
  };

  const handleStartStopButton = async () => {
    if (tracking) {
      const routeCoordinates = route.map((point) => ({
        latitude: point.latitude,
        longitude: point.longitude,
        timestamp: point.timestamp,
      }));

      const hikingData = {
        mtid: mountainId,
        hikingTrailData: routeCoordinates,
        savetime: Date.now(),
      };

      try {
        await authAxios.post(`/api/v1/auth/hiking_record`, hikingData);
        console.log('Hiking record data sent to server');
      } catch (error) {
        console.error('Error sending hiking record data:', error);
      }

      setRoute([]);
      setIsFinished(true);
      showFinishModal();
    }
    setTracking(!tracking);
  };

  const handleReportSubmit = async (report) => {
    const newReports = [...reports, report];
    setReports(newReports);
    await saveReportsToStorage(newReports);
  };

  const saveReportsToStorage = async (reports) => {
    try {
      await AsyncStorage.setItem('reports', JSON.stringify(reports));
    } catch (error) {
      console.error('Error saving reports to storage:', error);
    }
  };

  const loadReportsFromStorage = async () => {
    try {
      const storedReports = await AsyncStorage.getItem('reports');
      if (storedReports) {
        setReports(JSON.parse(storedReports));
      }
    } catch (error) {
      console.error('Error loading reports from storage:', error);
    }
  };

  const showFinishModal = () => {
    setIsModalVisible(true);

    // 3초 후에 모달을 닫고 이전 화면으로 이동
    const timeoutId = setTimeout(() => {
      setIsModalVisible(false);
      navigation.navigate('MountainMainApi', {
        mountain,
      });
    }, 3000);

    return () => clearTimeout(timeoutId); // 컴포넌트가 언마운트 될 때 타이머 정리
  };

  const handleCancel = () => {
    setIsFinished(false);
    setIsModalVisible(false); // 모달을 닫아 상태 초기화
  };

  const handleBackButtonPress = _.debounce(() => {
    navigation.goBack();
  }, 300);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size='large' color='#0000ff' />
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <View style={styles.leftBtn}>
          <IconButton iconName='chevron-left' onPress={handleBackButtonPress} />
        </View>
        <Text style={styles.headerTitle}>
          {isFinished ? '등산종료' : '등산중'}
        </Text>
      </View>
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={initialRegion}
        showsUserLocation={true}
      >
        <Polyline
          coordinates={route}
          strokeColor={isFinished ? 'green' : '#FF0000'} // 종료 시 초록색 라인으로 변경
          strokeWidth={4}
        />
        <Polyline
          coordinates={coordinates}
          strokeColor='#FF0000'
          strokeWidth={4}
        />
        {reports.map((report, index) => (
          <Marker
            key={index}
            coordinate={{
              latitude: report.latitude,
              longitude: report.longitude,
            }}
            onPress={() => setSelectedReport(report)}
          >
            <Image
              source={require('../../assets/icon/warning.png')}
              style={{ width: 40, height: 40 }}
              resizeMode='contain'
            />
          </Marker>
        ))}
        {endPoint && (
          <Marker
            coordinate={{
              latitude: endPoint[0],
              longitude: endPoint[1],
            }}
            title='도착'
          >
            <Image
              source={require('../../assets/icon/flag.png')}
              style={{ width: 30, height: 30 }} // 마커 크기 조정 가능
              resizeMode='contain'
            />
          </Marker>
        )}
      </MapView>

      {selectedReport && (
        <Modal
          visible={true}
          transparent={true}
          animationType='slide'
          onRequestClose={() => setSelectedReport(null)}
        >
          <View style={styles.modalContainer}>
            <Text style={styles.reportText}>{selectedReport.report}</Text>
            {selectedReport.trail_image && (
              <Image
                source={{ uri: selectedReport.trail_image }}
                style={styles.preview}
              />
            )}
            <TouchableOpacity
              style={[styles.button, styles.shadow]}
              onPress={() => setSelectedReport(null)}
            >
              <Text style={styles.buttonText}>닫기</Text>
            </TouchableOpacity>
          </View>
        </Modal>
      )}

      <Modal
        transparent={true}
        visible={isModalVisible}
        animationType='slide'
        onRequestClose={handleCancel} // Android에서 뒤로 가기 버튼을 눌렀을 때 모달 닫기
      >
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
          }}
        >
          <View
            style={{
              width: 300,
              padding: 20,
              backgroundColor: 'white',
              borderRadius: 10,
              alignItems: 'center',
            }}
          >
            <Text style={{ fontSize: 18, fontWeight: 'bold' }}>
              등산을 마쳤습니다!
            </Text>
            <Text style={{ marginTop: 10 }}>
              3초 뒤 이전 화면으로 이동합니다
            </Text>
            <TouchableOpacity onPress={handleCancel} style={{ marginTop: 20 }}>
              <Text style={{ color: 'blue' }}>취소</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <View style={styles.bottomButtonContainer}>
        <SosButton userId='1' location={location} userName='채인' />
        <StartStopButton tracking={tracking} onPress={handleStartStopButton} />
        <RoadWarningButton onSubmit={handleReportSubmit} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    height: WINDOW_HEIGHT * 0.07,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: WINDOW_HEIGHT * 0.035,
    position: 'relative',
  },
  leftBtn: {
    marginTop: 10,
    position: 'absolute',
    left: 10,
    zIndex: 10,
  },
  headerTitle: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    width: '100%', // 제목을 중앙에 고정하기 위해 전체 너비 사용
  },

  map: {
    width: '100%',
    height: '90%',
    paddingBottom: WINDOW_HEIGHT * 0.1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  reportText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  preview: {
    width: 270,
    height: 270,
    marginVertical: 10,
  },
  bottomButtonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: WINDOW_HEIGHT * 0.1,
    borderTopWidth: 1,
    borderTopColor: colors.Gray,
    backgroundColor: 'white',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 10,
  },
  button: {
    width: 100,
    backgroundColor: colors.mintGreen,
    padding: 10,
    marginVertical: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: '#FFFFFF',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
  },
  shadow: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});

export default HikingMapView;
