import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  Text,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import IconButton from '../sub/IconButton';
import colors from '../sub/colors';
import { WINDOW_WIDTH } from '../sub/dimensions';
import { useNavigation } from '@react-navigation/native';
import { basicAxios } from '../api/axios';

const formatTime = (totalMinutes) => {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  if (hours === 0) {
    return `${minutes}분`;
  } else if (minutes === 0) {
    return `${hours}시간`;
  } else {
    return `${hours}시간 ${minutes}분`;
  }
};

const RouteCard = ({
  trail_id,
  name,
  description,
  time,
  distance,
  endPoint,
  mountain,
}) => {
  const formattedTime = formatTime(time || 60); // 시간 값이 없으면 60분(1시간) 기본값 사용
  const displayDistance = distance || 3; // 거리 값이 없으면 5km 기본값 사용
  const navigation = useNavigation();

  return (
    <TouchableOpacity style={styles.routeItem}>
      <View style={styles.routeInfo}>
        <Text style={styles.routeName}>{name}</Text>
        <Text style={styles.routeDescription}>
          {description || '설명 없음'}
        </Text>
      </View>
      <View style={styles.routeDetails}>
        <View style={styles.detailsView}>
          <Text style={styles.routeTime}>{formattedTime}</Text>
        </View>
        <View style={styles.detailsView}>
          <Text style={styles.routeDistance}>{`${displayDistance}km`}</Text>
        </View>
      </View>
      <View style={styles.rightBtn}>
        <IconButton
          iconName='chevron-right'
          size={20}
          color={colors.Gray}
          onPress={() =>
            navigation.navigate('RouteMore', {
              trail_id,
              name,
              endPoint,
              mountain,
            })
          }
        />
      </View>
    </TouchableOpacity>
  );
};

const Route = ({ mountainId, onRoutesFetched, mountain }) => {
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(true); // 로딩 상태 추가

  useEffect(() => {
    const fetchRoutes = async () => {
      try {
        const response = await basicAxios.get(
          `/api/v1/auth/getAllTrails/${mountainId}`
        );

        if (Array.isArray(response.data)) {
          setRoutes(response.data); // 로컬 상태에 데이터 설정
          onRoutesFetched(response.data); // 부모로 데이터 전달
        } else {
          console.warn('Unexpected data format:', response.data);
        }
      } catch (error) {
        console.error('Error fetching routes:', error);
      } finally {
        setLoading(false); // 로딩 상태 종료
      }
    };

    fetchRoutes();
  }, [mountainId, onRoutesFetched]);

  if (loading) {
    return <ActivityIndicator size='large' color={colors.primary} />;
  }

  if (!routes || routes.length === 0) {
    return (
      <View>
        <Text>데이터를 불러올 수 없습니다.</Text>
      </View>
    );
  }

  return (
    <View>
      {routes.map((item) => (
        <RouteCard
          key={item.trail_id}
          trail_id={item.trail_id}
          name={item.trail_name}
          description={item.trail_comment}
          difficulty={item.difficulty}
          time={item.up_time || 0 || 60} // 기본값 60분
          distance={item.total_length || 3} // 기본값 5km
          endPoint={JSON.parse(item.end_point)}
          mountain={mountain}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  routeItem: {
    width: WINDOW_WIDTH * 0.9,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    marginVertical: 8,
    backgroundColor: colors.white,
    borderRadius: 10,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  routeInfo: {
    flex: 3,
  },
  routeName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  routeDescription: {
    marginTop: 5,
    fontSize: 10,
    color: colors.Gray,
  },
  routeDetails: {
    flex: 1.5,
    marginTop: 10,
    marginLeft: 5,
  },
  detailsView: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  routeDifficulty: {
    fontSize: 12,
    marginBottom: 3,
  },
  routeTime: {
    fontSize: 12,
    marginBottom: 3,
  },
  routeDistance: {
    fontSize: 12,
  },
  rightBtn: {
    justifyContent: 'center',
  },
});

export default React.memo(Route);
