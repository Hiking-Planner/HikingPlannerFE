import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { authAxios, basicAxios } from '../api/axios';
import { useNavigation } from '@react-navigation/native';

const MyRecord = () => {
  const navigation = useNavigation();
  const [hikingRecords, setHikingRecords] = useState([]);
  const [mountainDetails, setMountainDetails] = useState({});

  // 한국 날짜 형식으로 변환하는 함수
  const formatDate = (savetime) => {
    const date = new Date(savetime);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // 등산 경과 날짜 계산 함수
  const calculateElapsedDays = (savetime) => {
    const savedDate = new Date(savetime);
    const currentDate = new Date();
    const differenceInTime = currentDate - savedDate;
    const differenceInDays = Math.floor(differenceInTime / (1000 * 3600 * 24));
    return `D+${differenceInDays + 1}`;
  };

  // 사용자 등산 기록 조회
  const fetchHikingRecords = async () => {
    try {
      const response = await authAxios.get('/api/v1/auth/hiking_records');
      const records = response.data;

      // savetime을 기준으로 최신 순 정렬
      const sortedRecords = records.sort(
        (a, b) => new Date(b.savetime) - new Date(a.savetime)
      );
      setHikingRecords(sortedRecords);

      // 각 기록의 mtid로 산 상세 정보 가져오기
      sortedRecords.forEach((record) => {
        if (record.mtid) {
          fetchMountainDetails(record.mtid);
        }
      });
    } catch (error) {
      console.error('Error fetching hiking records:', error);
      if (error.response) {
        console.error('Error Response Data:', error.response.data);
        console.error('Error Status:', error.response.status);
      }
    }
  };

  // 산 상세 정보 가져오기
  const fetchMountainDetails = async (mtid) => {
    try {
      const response = await basicAxios.get(`/api/v1/auth/mountain/${mtid}`);
      const mountainData = response.data;
      setMountainDetails((prevDetails) => ({
        ...prevDetails,
        [mtid]: mountainData,
      }));
    } catch (error) {
      console.error('Error fetching mountain details:', error);
    }
  };

  useEffect(() => {
    fetchHikingRecords();
  }, []);

  return (
    <FlatList
      data={hikingRecords}
      keyExtractor={(item, index) => `mtid-${item.mtid}-${index}`}
      renderItem={({ item }) => {
        const mountainInfo = mountainDetails[item.mtid] || {};
        return (
          <View style={styles.recordItem}>
            <Image
              source={{
                uri:
                  mountainInfo.image_info && mountainInfo.image_info[0]
                    ? `${basicAxios.defaults.baseURL}${mountainInfo.image_info[0].img_url}.jpg`
                    : null,
              }}
              style={styles.hikingImage}
            />
            <View style={styles.hikingDetails}>
              <View style={styles.dPlusTag}>
                <Text style={styles.dPlusText}>
                  {calculateElapsedDays(item.savetime)}
                </Text>
              </View>
              <View style={styles.titleAndElevation}>
                <Text style={styles.hikingTitle}>
                  {mountainInfo.mountain_name || '산 이름 없음'}
                </Text>
                {mountainInfo.elevation && (
                  <Text style={styles.hikingElevation}>
                    {` ${mountainInfo.elevation}m`}
                  </Text>
                )}
              </View>
              <View style={styles.hikingDateView}>
                <Image
                  source={require('../../assets/icon/time.png')} // 시간 아이콘 경로
                  style={styles.timeImg}
                />
                <Text style={styles.hikingDate}>
                  {formatDate(item.savetime)}
                </Text>
              </View>
            </View>
            <TouchableOpacity
              style={styles.rightBtn}
              onPress={() =>
                navigation.navigate('RecordDetail', {
                  image:
                    mountainInfo.image_info && mountainInfo.image_info[0]
                      ? `${basicAxios.defaults.baseURL}${mountainInfo.image_info[0].img_url}.jpg`
                      : null,
                  title: mountainInfo.mountain_name,
                  height: mountainInfo.elevation,
                  location: mountainInfo.location,
                  date: formatDate(item.savetime),
                  time: item.time,
                  hikingTrailData: item.hikingTrailData,
                })
              }
            >
              <Text style={styles.chevron}>›</Text>
            </TouchableOpacity>
          </View>
        );
      }}
    />
  );
};

const styles = StyleSheet.create({
  recordItem: {
    flexDirection: 'row',
    padding: 15, // 카드 내부 여백을 늘림
    borderRadius: 15,
    backgroundColor: '#fff',
    marginVertical: 10, // 카드 간의 간격을 넓힘
    marginHorizontal: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  hikingImage: {
    width: 90, // 이미지 크기를 키움
    height: 90,
    borderRadius: 10,
    marginRight: 15,
  },
  hikingDetails: {
    flex: 1,
  },
  dPlusTag: {
    backgroundColor: '#D5F3E5',
    borderRadius: 5,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginBottom: 5,
    alignSelf: 'flex-start',
  },
  dPlusText: {
    color: '#4CAF50',
    fontWeight: 'bold',
    fontSize: 14,
  },
  titleAndElevation: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  hikingTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 8,
  },
  hikingElevation: {
    fontSize: 12,
    color: 'gray',
    marginLeft: 2,
    marginTop: 5,
  },
  hikingDateView: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  timeImg: {
    width: 14, // 아이콘 크기 조정
    height: 14,
    marginRight: 5,
  },
  hikingDate: {
    fontSize: 13,
    color: 'gray',
  },
  rightBtn: {
    padding: 10,
  },
  chevron: {
    fontSize: 22,
    color: 'gray',
  },
});

export default MyRecord;
