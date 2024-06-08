import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Modal,
  Alert,
} from 'react-native';
import axios from 'axios';
import * as Location from 'expo-location';

const SosButton = ({ userId, location, userName }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [autoSendTimeout, setAutoSendTimeout] = useState(null);
  const [sosInfo, setSosInfo] = useState(null);

  const handleSosPress = async () => {
    try {
      const response = await axios.post(
        'http://ec2-3-143-125-20.us-east-2.compute.amazonaws.com:8080/api/v1/auth/sos',
        {
          userid: userId,
          latitude: location.latitude,
          longitude: location.longitude,
          date: new Date().toISOString(),
        },
      );

      const { data } = response;
      setSosInfo(data);

      console.log('National Position Number:', data.nationalposnum); // 국가지점번호 콘솔에 출력

      setModalVisible(true);

      const timeout = setTimeout(async () => {
        await sendSosMessage(data);
        setModalVisible(false);
      }, 3000);

      setAutoSendTimeout(timeout);
    } catch (error) {
      console.error('Error fetching location code:', error);
      Alert.alert('Error', 'Error fetching location code');
    }
  };

  const sendSosMessage = async (sosInfo) => {
    try {
      const response = await axios.post(
        'http://ec2-3-143-125-20.us-east-2.compute.amazonaws.com:8080/api/v1/auth/sendsosmessage',
        {
          username: sosInfo.username,
          phone_number: sosInfo.phone_number,
          nationalposnum: sosInfo.nationalposnum,
          time: sosInfo.time,
        },
      );

      console.log('SOS message sent:', response.data);
      Alert.alert('문자 발송', 'SOS 메시지가 119에 정상적으로 전송되었습니다.');
    } catch (error) {
      console.error('Error sending SOS message:', error);
      Alert.alert('Error', 'Error sending SOS message');
    }
  };

  const handleCancel = () => {
    if (autoSendTimeout) {
      clearTimeout(autoSendTimeout);
      setAutoSendTimeout(null);
    }
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.sosButton} onPress={handleSosPress}>
        <Text style={styles.sosButtonText}>SOS</Text>
      </TouchableOpacity>
      <Modal
        transparent={true}
        animationType="slide"
        visible={modalVisible}
        onRequestClose={handleCancel}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>긴급신고가 필요한 상황이신가요?</Text>
            <Text style={styles.modalText}>취소를 누르지 않으면 3초 후에 자동으로 신고됩니다~</Text>
            {sosInfo && (
              <>
                <Text style={styles.modalText}>이름: {sosInfo.username || userName}</Text>
                <Text style={styles.modalText}>신고시각: {sosInfo.time}</Text>
                <Text style={styles.modalText}>국가지점번호: {sosInfo.nationalposnum}</Text>
              </>
            )}
            <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
              <Text style={styles.cancelButtonText}>취소</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 10,
  },
  sosButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sosButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: 300,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
  },
  modalText: {
    marginBottom: 10,
    fontSize: 16,
    textAlign: 'center',
  },
  cancelButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: 'gray',
    borderRadius: 5,
  },
  cancelButtonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default SosButton;

