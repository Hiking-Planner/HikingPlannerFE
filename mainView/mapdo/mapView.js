import React, { useState, useEffect } from 'react';
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
import * as Location from 'expo-location';
import { basicAxios } from '../api/axios';
import RoadWarningButton from './RoadWarningButton';
import StartStopButton from './StartStopButton';
import colors from '../sub/colors';
import SosButton from './SosButton';

export const HikingMapView = () => {
  const [location, setLocation] = useState(null);
  const [route, setRoute] = useState([]);
  const [initialRegion, setInitialRegion] = useState(null);
  const [tracking, setTracking] = useState(false);
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reports, setReports] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);

  const navigation = useNavigation();
  const routeParams = useRoute().params;
  const coordinates = routeParams?.coordinates || [];

  const mapRef = React.useRef(null);

  useEffect(() => {
    initializeLocation();
    loadReportsFromStorage();
  }, []);

  useEffect(() => {
    if (tracking) {
      startLocationTracking();
    } else {
      stopLocationTracking();
    }
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
        timeInterval: 20000,
        distanceInterval: 5,
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
        recordid: 0,
        userid: '1',
        mtid: 1,
        hikingTrailData: routeCoordinates,
        savetime: Date.now(),
      };

      try {
        await basicAxios.post(`/api/v1/auth/hiking_record`, hikingData);
        console.log('Hiking record data sent to server');
      } catch (error) {
        console.error('Error sending hiking record data:', error);
      }

      setRoute([]);
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

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size='large' color='#0000ff' />
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={initialRegion}
        showsUserLocation={true}
      >
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
          />
        ))}
      </MapView>
      <TouchableOpacity style={styles.leftBtn}>
        <IconButton
          iconName='chevron-left'
          onPress={() => navigation.goBack()}
        />
      </TouchableOpacity>
      <RoadWarningButton onSubmit={handleReportSubmit} />
      <StartStopButton tracking={tracking} onPress={handleStartStopButton} />

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
      <SosButton userId='1' location={location} userName='채인' />
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  map: {
    width: '100%',
    height: '100%',
  },
  leftBtn: {
    position: 'absolute',
    top: 30,
    left: '1%',
    margin: 5,
  },
  roadWarningBtn: {
    position: 'absolute',
    right: '3%',
    top: '28%',
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
