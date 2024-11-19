import React, { useState, useEffect } from 'react';
import { View, Button, Text } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { basicAxios, authAxios } from '../api/axios';

// trail data 가져오기
async function fetchTrailData(trailId) {
  try {
    const response = await basicAxios.get(
      `/api/v1/auth/getTrailData/${trailId}`
    );
    const trailData = response.data.trailData; // trailData 필드 가져오기

    // JSON 문자열을 배열로 변환
    if (typeof trailData === 'string') {
      return JSON.parse(trailData);
    }

    // 이미 배열 형식인 경우 그대로 반환
    return trailData;
  } catch (error) {
    console.error('Trail Data Fetch Error:', error);
    throw error;
  }
}

// trail data에 타임스탬프 추가
function addTimestampsToTrailData(trailData, interval = 60000) {
  let currentTime = Date.now();
  return trailData.map((point, index) => ({
    latitude: point[0], // 배열의 첫 번째 값
    longitude: point[1], // 배열의 두 번째 값
    timestamp: currentTime + index * interval, // 타임스탬프 추가
  }));
}

// hiking record 전송
async function submitHikingRecord(recordData) {
  const response = await authAxios.post(
    '/api/v1/auth/hiking_record',
    recordData
  );
  return response.data;
}

export default function TrailButtonGroup() {
  const [trailCounts, setTrailCounts] = useState({ 1: 0, 2: 0 });

  // AsyncStorage에서 전송 횟수 불러오기
  useEffect(() => {
    const loadTrailCounts = async () => {
      try {
        const savedCounts = await AsyncStorage.getItem('trailCounts');
        if (savedCounts) {
          setTrailCounts(JSON.parse(savedCounts));
        }
      } catch (error) {
        console.error('전송 횟수 불러오기 오류:', error);
      }
    };

    loadTrailCounts();
  }, []);

  // AsyncStorage에 전송 횟수 저장하기
  const saveTrailCounts = async (counts) => {
    try {
      await AsyncStorage.setItem('trailCounts', JSON.stringify(counts));
    } catch (error) {
      console.error('전송 횟수 저장 오류:', error);
    }
  };

  const handleButtonClick = async (trailId) => {
    try {
      const trailData = await fetchTrailData(trailId);

      // trailData가 배열이 아니면 경고 로그 출력 후 반환
      if (!Array.isArray(trailData)) {
        console.warn(`Invalid trail data for trailId: ${trailId}`);
        return;
      }

      // 데이터 변환 로직: 원하는 형식으로 변환
      const hikingTrailData = addTimestampsToTrailData(trailData);

      // 마지막 타임스탬프 가져오기
      const savetime =
        hikingTrailData[hikingTrailData.length - 1]?.timestamp || Date.now();

      const recordData = {
        mtid: 1,
        hikingTrailData: hikingTrailData,
        savetime: savetime, // 추가된 savetime 필드
      };

      await submitHikingRecord(recordData);

      // 전송 횟수 업데이트
      const updatedCounts = {
        ...trailCounts,
        [trailId]: trailCounts[trailId] + 1,
      };
      setTrailCounts(updatedCounts);
      saveTrailCounts(updatedCounts);
    } catch (error) {
      console.error('오류 발생:', error);
    }
  };

  // 등산 횟수 초기화 함수
  const resetTrailCounts = async () => {
    try {
      const resetCounts = { 1: 0, 2: 0 }; // 모든 경로 초기화
      setTrailCounts(resetCounts);
      await AsyncStorage.setItem('trailCounts', JSON.stringify(resetCounts));
    } catch (error) {
      console.error('초기화 오류:', error);
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <Button
        title={`1번 경로 (${trailCounts[1]}회 등산)`}
        onPress={() => handleButtonClick(1)}
      />
      <Text style={{ marginVertical: 10 }}></Text>
      <Button
        title={`2번 경로 (${trailCounts[2]}회 등산)`}
        onPress={() => handleButtonClick(2)}
      />
      <Text style={{ marginVertical: 10 }}></Text>
      <Button
        title='등산 횟수 초기화'
        onPress={resetTrailCounts} // 초기화 버튼 추가
        color='red' // 초기화 버튼 색상
      />
    </View>
  );
}
