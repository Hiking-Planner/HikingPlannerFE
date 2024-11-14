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

function getDifficultyColor(difficulty) {
  switch (difficulty) {
    case '쉬움':
      return 'green';
    case '보통':
      return 'orange';
    case '어려움':
      return 'red';
    default:
      return 'black';
  }
}

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
  difficulty,
  time,
  distance,
  endPoint,
  mountain,
}) => {
  const formattedTime = formatTime(time);
  const navigation = useNavigation();

  return (
    <TouchableOpacity style={styles.routeItem}>
      <View style={styles.routeInfo}>
        <Text style={styles.routeName}>{name}</Text>
        <Text style={styles.routeDescription}>{description}</Text>
      </View>
      <View style={styles.routeDetails}>
        <View style={styles.detailsView}>
          <Text
            style={[
              styles.routeDifficulty,
              { color: getDifficultyColor(difficulty) },
            ]}
          >
            {difficulty}
          </Text>
        </View>
        <View style={styles.detailsView}>
          <Text style={styles.routeTime}>{formattedTime}</Text>
        </View>
        <View style={styles.detailsView}>
          <Text style={styles.routeDistance}>{`${distance}km`}</Text>
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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRoutes = async () => {
      try {
        const response = await basicAxios.get(
          `/api/v1/auth/getAllTrails/${mountainId}`
        );
        const data = response.data;

        // API 응답이 배열인지 확인
        if (Array.isArray(data)) {
          setRoutes(data);
          onRoutesFetched(data); // 경로 데이터를 부모 컴포넌트로 전달
        } else {
          console.error('API 응답이 배열 형식이 아닙니다:', data);
          setRoutes([]);
          onRoutesFetched([]);
        }
      } catch (error) {
        console.error('API 호출 중 오류 발생:', error);
        onRoutesFetched([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRoutes();
  }, [mountainId, onRoutesFetched]); // mountainId와 onRoutesFetched가 변경될 때만 실행

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
          trail_id={item.trail_id} // trail_id를 RouteMore로 전달
          name={item.trail_name}
          description={item.trail_comment}
          difficulty={item.difficulty}
          time={item.up_time + item.down_time}
          distance={item.total_length}
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
