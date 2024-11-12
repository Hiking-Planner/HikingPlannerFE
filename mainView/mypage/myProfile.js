import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Modal,
  Alert,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import IconButton from '../sub/IconButton';
import { WINDOW_HEIGHT } from '../sub/dimensions';
import { useNavigation } from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker';
import { authAxios } from '../api/axios';
import useUserInfoStore from '../stores/userInfoStore';

export default function MyProfile() {
  const navigation = useNavigation();
  const { userInfo, setUserInfo } = useUserInfoStore();

  const [name, setName] = useState(userInfo.nickname || '');
  const [gender, setGender] = useState(userInfo.gender);
  const [birthYear, setBirthYear] = useState(userInfo.birth);
  const [bio, setBio] = useState(userInfo.introduce || '');
  const [showYearPicker, setShowYearPicker] = useState(false);
  const [profileImage, setProfileImage] = useState(
    require('../../assets/logo.png')
  );

  useEffect(() => {
    fetchUserInfo();
  }, []);

  const fetchUserInfo = async () => {
    try {
      const response = await authAxios.get('/api/v1/auth/user-info');
      const data = response.data;

      if (response.status === 200) {
        setUserInfo(data);
        setName(data.nickname || '');
        setGender(data.gender === 'MALE' ? '남자' : '여자');
        setBirthYear(data.birth || '');
        setBio(data.introduce || '');
        if (data.profile_image) {
          setProfileImage({ uri: data.profile_image });
        }
      } else {
        console.log('사용자 정보 가져오기 실패', data);
      }
    } catch (error) {
      console.error('사용자 정보 가져오는 중 오류 발생:', error);
    }
  };

  const updateProfileImage = async (imageUri) => {
    try {
      const formData = new FormData();
      formData.append('file', {
        uri: imageUri,
        name: 'profile.jpg',
        type: 'image/jpeg',
      });

      const response = await authAxios.put(
        '/api/v1/auth/profile/image',
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
        }
      );

      if (response.status === 200 && response.data.profile_image) {
        Alert.alert('성공', '프로필 이미지가 성공적으로 변경되었습니다.');
        setUserInfo({
          ...userInfo,
          profile_image: response.data.profile_image,
        });
      } else {
        Alert.alert('실패', '프로필 이미지 변경에 실패했습니다.');
      }
    } catch (error) {
      console.error('프로필 이미지 업데이트 중 오류 발생:', error);
      Alert.alert('오류', '프로필 이미지 변경 중 오류가 발생했습니다.');
    }
  };

  const handleImagePick = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      Alert.alert(
        '권한이 필요합니다',
        '이미지를 선택하려면 갤러리 접근 권한이 필요합니다.'
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const imageUri = result.assets[0].uri;
      setProfileImage({ uri: imageUri });
      updateProfileImage(imageUri);
    } else {
      console.log('이미지 선택이 취소되었습니다.');
    }
  };

  const updateProfile = async () => {
    try {
      const response = await authAxios.put('/api/v1/auth/profile', {
        nickname: name,
        phoneNumber: userInfo.phoneNumber,
        birth: birthYear,
        introduce: bio,
        gender: gender === '남자' ? 'MALE' : 'FEMALE',
      });

      if (response.status === 200) {
        Alert.alert('성공', '프로필이 성공적으로 변경되었습니다.');
        setUserInfo({
          nickname: name,
          birth: birthYear,
          introduce: bio,
          gender: gender === '남자' ? 'MALE' : 'FEMALE',
        });
        navigation.goBack();
      } else {
        Alert.alert('실패', '프로필 변경에 실패했습니다.');
      }
    } catch (error) {
      console.error('프로필 업데이트 중 오류 발생:', error);
      Alert.alert('오류', '프로필 변경 중 오류가 발생했습니다.');
    }
  };

  const handleGenderChange = (selectedGender) => {
    setGender(selectedGender);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.wrapper}>
        <View style={styles.header}>
          <IconButton
            iconName='chevron-left'
            onPress={() => navigation.goBack()}
          />
          <Text style={styles.headerTitle}>프로필 변경</Text>
          <TouchableOpacity style={styles.saveBtn} onPress={updateProfile}>
            <Text style={styles.saveBtnText}>변경</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>프로필 사진</Text>
          <View style={styles.profileSection}>
            <Image source={profileImage} style={styles.profileImage} />
            <TouchableOpacity onPress={handleImagePick}>
              <Text style={styles.editProfileText}>프로필 사진 변경</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>닉네임</Text>
          <TextInput
            style={styles.input}
            placeholder='닉네임을 입력해주세요.'
            value={name || null}
            onChangeText={setName}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>성별</Text>
          <View style={styles.genderSection}>
            <TouchableOpacity
              style={styles.radioButton}
              onPress={() => handleGenderChange('남자')}
            >
              <View style={styles.radioCircle}>
                {gender === '남자' && <View style={styles.selectedRb} />}
              </View>
              <Text style={styles.radioText}>남자</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.radioButton}
              onPress={() => handleGenderChange('여자')}
            >
              <View style={styles.radioCircle}>
                {gender === '여자' && <View style={styles.selectedRb} />}
              </View>
              <Text style={styles.radioText}>여자</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>출생년도</Text>
          <TouchableOpacity
            style={styles.yearPickerContainer}
            onPress={() => setShowYearPicker(true)}
          >
            <Text style={styles.yearPickerText}>
              {birthYear ? birthYear : '출생년도를 선택해주세요.'}
            </Text>
            <IconButton iconName='chevron-down' size={20} color='#aaa' />
          </TouchableOpacity>
        </View>

        <Modal
          visible={showYearPicker}
          transparent={true}
          animationType='slide'
        >
          <View style={styles.modalContainer}>
            <View style={styles.pickerWrapper}>
              <Picker
                selectedValue={birthYear}
                onValueChange={(itemValue) => setBirthYear(itemValue)}
              >
                {Array.from(
                  { length: new Date().getFullYear() - 1899 },
                  (_, i) => 1900 + i
                )
                  .reverse()
                  .map((year) => (
                    <Picker.Item
                      key={year}
                      label={year.toString()}
                      value={year.toString()}
                    />
                  ))}
              </Picker>
              <TouchableOpacity
                style={styles.pickerCloseButton}
                onPress={() => setShowYearPicker(false)}
              >
                <Text style={styles.closeButtonText}>확인</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>소개</Text>
          <TextInput
            style={styles.input}
            placeholder='소개를 작성해주세요. (100자 이내)'
            value={bio || null}
            onChangeText={setBio}
            maxLength={100}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#ffffff' },
  wrapper: { flexGrow: 1, paddingHorizontal: 20 },
  header: {
    height: WINDOW_HEIGHT * 0.09,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: WINDOW_HEIGHT * 0.035,
  },
  headerTitle: { textAlign: 'center', fontSize: 16, fontWeight: 'bold' },
  saveBtn: { alignItems: 'flex-end', marginRight: 10 },
  saveBtnText: { color: 'green', fontSize: 16, fontWeight: 'bold' },
  section: { marginBottom: 20 },
  sectionTitle: {
    fontSize: 14,
    color: '#888',
    marginBottom: 10,
    fontWeight: 'bold',
  },
  profileSection: { alignItems: 'center', marginBottom: 10 },
  profileImage: { width: 80, height: 80, borderRadius: 40, marginBottom: 10 },
  editProfileText: { color: 'green', fontSize: 14 },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    borderRadius: 5,
    marginBottom: 15,
  },
  genderSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  radioButton: { flexDirection: 'row', alignItems: 'center', marginRight: 20 },
  radioText: { fontSize: 16, color: '#555' },
  radioCircle: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#555',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  selectedRb: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: 'green',
  },
  yearPickerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    paddingBottom: 10,
  },
  yearPickerText: { fontSize: 16, color: '#aaa' },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  pickerWrapper: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
  },
  pickerCloseButton: {
    marginTop: 10,
    backgroundColor: 'green',
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 5,
  },
  closeButtonText: { color: '#fff', fontSize: 16 },
});
