import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  StyleSheet,
  Modal,
  Image,
  TextInput,
  TouchableOpacity,
  Text,
  Button,
} from 'react-native';
import * as Location from 'expo-location';
import { CameraView, useCameraPermissions } from 'expo-camera';
import colors from '../sub/colors';
import { Picker } from '@react-native-picker/picker';
import { basicAxios } from '../api/axios';

const RoadWarningButton = ({ onSubmit }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [imageUri, setImageUri] = useState(null);
  const [reportType, setReportType] = useState('등산로 이상');
  const [customReport, setCustomReport] = useState('');
  const [isCameraVisible, setIsCameraVisible] = useState(true);
  const cameraRef = useRef(null);
  const [hasCameraPermission, requestPermission] = useCameraPermissions();

  useEffect(() => {
    (async () => {
      if (!hasCameraPermission) {
        await requestPermission();
      }
    })();
  }, [hasCameraPermission]);

  const takePicture = async () => {
    if (cameraRef.current) {
      const photo = await cameraRef.current.takePictureAsync();
      setImageUri(photo.uri);
      setIsCameraVisible(false);
    }
  };

  const retakePicture = () => {
    setImageUri(null);
    setIsCameraVisible(true);
  };

  const submitReport = async () => {
    try {
      const currentLocation = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = currentLocation.coords;
      const timestamp = new Date().toISOString();
      const report = reportType === '기타' ? customReport : reportType;

      const formData = new FormData();
      formData.append('image', {
        uri: imageUri,
        name: 'report.jpg',
        type: 'image/jpeg',
      });
      formData.append(
        'trailReport',
        JSON.stringify({
          latitude,
          longitude,
          report,
          timestamp,
        })
      );

      const response = await basicAxios.post(
        '/api/v1/auth/trailReport',
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
        }
      );

      console.log('Response:', response.data);

      const responseData = {
        ...response.data,
        latitude: parseFloat(response.data.latitude),
        longitude: parseFloat(response.data.longitude),
      };

      onSubmit(responseData);

      setModalVisible(false);
      setImageUri(null);
      setReportType('등산로 이상');
      setCustomReport('');
      setIsCameraVisible(true);
    } catch (error) {
      console.error('Error submitting report:', error);
    }
  };

  if (!hasCameraPermission) {
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: 'center' }}>
          카메라 권한을 허용해주셔야 합니다
        </Text>
        <Button onPress={requestPermission} title='권한 허용' />
      </View>
    );
  }

  return (
    <>
      <TouchableOpacity
        style={styles.warnningButton}
        onPress={() => {
          if (hasCameraPermission) {
            setModalVisible(true);
          } else {
            alert('카메라 권한이 허용되지 않았습니다');
          }
        }}
      >
        <Text style={styles.buttonText}>등산길 이상</Text>
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        animationType='slide'
        statusBarTranslucent={true}
      >
        <View style={styles.modalContainer}>
          {isCameraVisible ? (
            <CameraView style={styles.camera} ref={cameraRef} />
          ) : (
            <>
              {imageUri && (
                <Image source={{ uri: imageUri }} style={styles.preview} />
              )}
              <Picker
                selectedValue={reportType}
                style={styles.picker}
                onValueChange={(itemValue) => setReportType(itemValue)}
              >
                <Picker.Item label='등산로 이상' value='등산로 이상' />
                <Picker.Item label='공사 중' value='공사 중' />
                <Picker.Item label='자연재해' value='자연재해' />
                <Picker.Item label='야생동물' value='야생동물' />
                <Picker.Item label='기타' value='기타' />
              </Picker>
              {reportType === '기타' && (
                <TextInput
                  style={styles.input}
                  placeholder='신고 내용 입력'
                  value={customReport}
                  onChangeText={setCustomReport}
                />
              )}

              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={[styles.button, styles.shadow]}
                  onPress={submitReport}
                >
                  <Text style={styles.buttonText}>이상 신고하기</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.button, styles.shadow]}
                  onPress={retakePicture}
                >
                  <Text style={styles.buttonText}>사진 재촬영</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.button, styles.shadow]}
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={[styles.buttonText, styles.cancleBtn]}>
                    취소
                  </Text>
                </TouchableOpacity>
              </View>
            </>
          )}
          <View style={styles.buttonContainer}>
            {isCameraVisible && (
              <>
                <TouchableOpacity
                  style={[styles.button, styles.shadow]}
                  onPress={takePicture}
                >
                  <Text style={styles.buttonText}>사진 찍기</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.button, styles.shadow]}
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={styles.buttonText}>취소</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  warnningButton: {
    backgroundColor: colors.mintGreen,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginHorizontal: 5,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  camera: {
    width: '100%',
    height: '45%',
    marginBottom: 10,
  },
  preview: {
    width: 280,
    height: 250,
    marginVertical: 10,
  },
  picker: {
    height: 50,
    width: '70%',
    marginVertical: 10,
  },
  input: {
    width: '65%',
    height: 47,
    borderColor: 'gray',
    borderWidth: 1,
    margin: 12,
    padding: 10,
    borderRadius: 5,
  },
  button: {
    flex: 1,
    backgroundColor: colors.mintGreen,
    padding: 10,
    marginHorizontal: 1,
    borderRadius: 5,
  },
  buttonText: {
    color: colors.white,
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
  buttonContainer: {
    position: 'absolute',
    bottom: '5%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 12,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default RoadWarningButton;
