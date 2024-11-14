import React, { useState, useEffect } from 'react';
import { TouchableOpacity, StyleSheet, Text } from 'react-native';
import colors from '../sub/colors';

const StartStopButton = ({ tracking, onPress }) => {
  const [timeElapsed, setTimeElapsed] = useState(0); // 경과 시간
  const [intervalId, setIntervalId] = useState(null);

  useEffect(() => {
    if (tracking) {
      // 등산 시작 시 타이머 시작
      const id = setInterval(() => {
        setTimeElapsed((prevTime) => prevTime + 1);
      }, 1000);
      setIntervalId(id);
    } else {
      // 등산 종료 시 타이머 정지 및 초기화
      clearInterval(intervalId);
      setIntervalId(null);
      setTimeElapsed(0); // 원하는 경우 초기화하지 않고 유지 가능
    }

    return () => clearInterval(intervalId); // 컴포넌트가 언마운트될 때 타이머 정리
  }, [tracking]);

  // 경과 시간을 00:00:00 형식으로 변환
  const formatTime = (seconds) => {
    const hrs = String(Math.floor(seconds / 3600)).padStart(2, '0');
    const mins = String(Math.floor((seconds % 3600) / 60)).padStart(2, '0');
    const secs = String(seconds % 60).padStart(2, '0');
    return `${hrs}:${mins}:${secs}`;
  };

  return (
    <TouchableOpacity
      style={[
        styles.button,
        { backgroundColor: tracking ? colors.red : colors.mintGreen },
      ]}
      onPress={onPress}
    >
      <Text style={styles.buttonText}>
        {tracking ? formatTime(timeElapsed) : '등산시작'}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginHorizontal: 5,
  },
  buttonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default StartStopButton;
