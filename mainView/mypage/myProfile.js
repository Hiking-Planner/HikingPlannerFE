import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Modal,
} from 'react-native';
import IconButton from '../sub/IconButton';
import { WINDOW_HEIGHT } from '../sub/dimensions';
import { useNavigation } from '@react-navigation/native';
// 새로운 Picker 라이브러리 임포트
import { Picker } from '@react-native-picker/picker';

export default function MyProfile() {
  const navigation = useNavigation();

  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [name, setName] = useState('');
  const [gender, setGender] = useState('');
  const [birthYear, setBirthYear] = useState(''); // 출생년도 선택
  const [bio, setBio] = useState('');
  const [showYearPicker, setShowYearPicker] = useState(false); // 출생년도 Picker 표시 여부
  const [passwordMessage, setPasswordMessage] = useState(''); // 비밀번호 일치 여부 상태

  const [profileImage, setProfileImage] = useState(
    require('../../assets/logo.png')
  );

  const handleGenderChange = (selectedGender) => {
    setGender(selectedGender);
  };

  // 출생년도 리스트: 1900년부터 현재 연도까지 오름차순
  const currentYear = new Date().getFullYear();
  const years = [];
  for (let i = 1900; i <= currentYear; i++) {
    years.push(i.toString());
  }

  // 비밀번호 확인
  const handlePasswordChange = (value) => {
    setPassword(value);
    checkPasswords(value, passwordConfirm);
  };

  const handlePasswordConfirmChange = (value) => {
    setPasswordConfirm(value);
    checkPasswords(password, value);
  };

  const checkPasswords = (password, confirmPassword) => {
    if (confirmPassword && password) {
      if (password === confirmPassword) {
        setPasswordMessage('비밀번호가 일치합니다.');
      } else {
        setPasswordMessage('비밀번호가 일치하지 않습니다.');
      }
    } else {
      setPasswordMessage('');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.wrapper}>
        <View style={styles.header}>
          <View style={styles.leftBtn}>
            <IconButton
              iconName='chevron-left'
              onPress={() => {
                navigation.goBack();
              }}
            />
          </View>
          <Text style={styles.headerTitle}>프로필 변경</Text>
          <TouchableOpacity
            style={styles.saveBtn}
            onPress={() => alert('프로필이 변경되었습니다.')}
          >
            <Text style={styles.saveBtnText}>변경</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>프로필 사진</Text>
          <View style={styles.profileSection}>
            <Image source={profileImage} style={styles.profileImage} />
            <TouchableOpacity onPress={() => alert('프로필 사진 변경')}>
              <Text style={styles.editProfileText}>편집</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>비밀번호 변경</Text>
          <TextInput
            style={styles.input}
            placeholder='비밀번호를 입력해주세요.'
            secureTextEntry={true}
            value={password}
            onChangeText={handlePasswordChange}
          />
          <TextInput
            style={styles.input}
            placeholder='비밀번호를 다시 입력해주세요.'
            secureTextEntry={true}
            value={passwordConfirm}
            onChangeText={handlePasswordConfirmChange}
          />
          {/* 비밀번호 일치 여부 메시지 */}
          {passwordMessage ? (
            <Text
              style={[
                styles.passwordMessage,
                passwordMessage === '비밀번호가 일치합니다.'
                  ? styles.passwordMatch
                  : styles.passwordMismatch,
              ]}
            >
              {passwordMessage}
            </Text>
          ) : null}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>이름/닉네임</Text>
          <TextInput
            style={styles.input}
            placeholder='이름 또는 닉네임을 입력해주세요.'
            value={name}
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
                selectedValue={birthYear || years[years.length - 1]} // 초기 선택값으로 현재 연도 지정
                onValueChange={(itemValue) => setBirthYear(itemValue)}
              >
                {years.map((year) => (
                  <Picker.Item key={year} label={year} value={year} />
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
            value={bio}
            onChangeText={setBio}
            maxLength={100}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  wrapper: {
    flex: 1,
    paddingHorizontal: 20,
  },
  header: {
    height: WINDOW_HEIGHT * 0.09,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: WINDOW_HEIGHT * 0.035,
  },
  leftBtn: {
    flex: 1,
  },
  headerTitle: {
    flex: 2,
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
  },
  saveBtn: {
    flex: 1,
    alignItems: 'flex-end',
    marginRight: 10,
  },
  saveBtnText: {
    color: 'green',
    fontSize: 16,
    fontWeight: 'bold',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 14,
    color: '#888',
    marginBottom: 10,
    fontWeight: 'bold',
  },
  profileSection: {
    alignItems: 'center',
    marginBottom: 10,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 10,
  },
  editProfileText: {
    color: 'green',
    fontSize: 14,
  },
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
  radioButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
  },
  radioText: {
    fontSize: 16,
    color: '#555',
  },
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
  passwordMessage: {
    marginTop: -10,
    marginBottom: 15,
    fontSize: 12,
    fontWeight: 'bold',
  },
  passwordMatch: {
    color: 'blue',
  },
  passwordMismatch: {
    color: 'red',
  },
  yearPickerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    paddingBottom: 10,
  },
  yearPickerText: {
    fontSize: 16,
    color: '#aaa',
  },
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
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});
