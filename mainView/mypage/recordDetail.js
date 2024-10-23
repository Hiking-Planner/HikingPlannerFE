import React, { useRef, useState } from 'react';
import {
  View,
  StyleSheet,
  Text,
  Animated,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Image,
  ImageBackground,
} from 'react-native';
import IconButton from '../sub/IconButton';
import colors from '../sub/colors';
import { WINDOW_HEIGHT, WINDOW_WIDTH } from '../sub/dimensions';
import { useNavigation } from '@react-navigation/native';

const AnimatedImageBackground =
  Animated.createAnimatedComponent(ImageBackground);

export default function RecordDetail() {
  const scrollY = useRef(new Animated.Value(0)).current;
  const navigation = useNavigation();

  const [memo, setMemo] = useState(''); // 현재 입력 중인 메모 상태
  const [savedMemo, setSavedMemo] = useState(''); // 저장된 메모 상태
  const [isEditing, setIsEditing] = useState(false); // 메모 수정 모드 상태

  const hikingRecords = [
    {
      id: '1',
      title: '아차산',
      height: '287m',
      date: '24년 04월 04일',
      time: '12:00 ~ 14:00',
      distance: '1.7km',
      dPlus: 'D+1',
      image: require('../../assets/mountain/achasan.png'),
    },
  ];

  const headerHeight = scrollY.interpolate({
    inputRange: [0, WINDOW_HEIGHT * 0.15 * 4],
    outputRange: [WINDOW_HEIGHT * 0.35, 0],
    extrapolate: 'clamp',
  });

  // 메모 등록 핸들러
  const handleRegisterMemo = () => {
    if (memo.trim() !== '') {
      setSavedMemo(memo);
      setMemo('');
      setIsEditing(false);
    }
  };

  // 메모 수정 모드로 전환
  const handleEditMemo = () => {
    setMemo(savedMemo);
    setIsEditing(true);
  };

  // 메모 삭제 핸들러
  const handleDeleteMemo = () => {
    setSavedMemo('');
    setMemo('');
    setIsEditing(false);
  };

  return (
    <View style={styles.container}>
      <AnimatedImageBackground
        style={[styles.mountainImg, { height: headerHeight }]}
        source={hikingRecords[0].image}
      >
        <View style={styles.wrapper}>
          <View style={styles.header}>
            <TouchableOpacity style={styles.leftBtn}>
              <IconButton
                iconName='chevron-left'
                onPress={() => navigation.goBack()}
              />
            </TouchableOpacity>
          </View>
        </View>
      </AnimatedImageBackground>

      <View style={styles.mountainInfoView}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={styles.mountainScroll}
        >
          <View style={styles.recordInfo}>
            <Text style={styles.mountainTitle}>
              {hikingRecords[0].title}{' '}
              <Text style={styles.mountainHeight}>
                {hikingRecords[0].height} - 서울
              </Text>
            </Text>
            <View style={styles.hikingDetails}>
              <View style={styles.hikingDateView}>
                <Image
                  source={require('../../assets/icon/time.png')}
                  style={styles.timeImg}
                />
                <Text style={styles.hikingDateTime}>
                  {hikingRecords[0].date} {hikingRecords[0].time}
                </Text>
              </View>
              <View style={styles.hikingDistanceView}>
                <Image
                  source={require('../../assets/icon/distance.png')}
                  style={styles.distanceImg}
                />
                <Text style={styles.hikingDistance}>
                  {hikingRecords[0].distance}
                </Text>
              </View>
            </View>
          </View>

          {/* 상세 경로 (지도 대체) */}
          <Text style={styles.sectionTitle}>상세 경로</Text>
          <View style={styles.mapPlaceholder}>
            <Text style={styles.mapPlaceholderText}>
              지도 화면 (추후 추가 예정)
            </Text>
          </View>

          {/* 메모 섹션 */}
          <Text style={styles.sectionTitle}>메모</Text>

          {savedMemo ? (
            <View style={styles.memoContainer}>
              <Text style={styles.memoText}>{savedMemo}</Text>
              <View style={styles.memoActions}>
                <TouchableOpacity onPress={handleEditMemo}>
                  <Text style={styles.editText}>수정</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleDeleteMemo}>
                  <Text style={styles.deleteText}>삭제</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <Text style={styles.noMemoText}>등록된 메모가 없습니다.</Text>
          )}
        </ScrollView>

        {/* 메모 입력 및 등록 (화면 하단 고정) */}
        <View style={styles.memoInputContainer}>
          <TextInput
            style={styles.memoInput}
            placeholder='메모를 남겨보세요.'
            value={memo}
            onChangeText={setMemo}
          />
          <TouchableOpacity onPress={handleRegisterMemo}>
            <Text style={styles.registerText}>
              {isEditing ? '수정 완료' : '등록'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mountainImg: {
    height: WINDOW_HEIGHT * 0.35,
  },
  header: {
    height: WINDOW_HEIGHT * 0.09,
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: WINDOW_HEIGHT * 0.035,
  },
  leftBtn: {
    flex: 1,
    alignItems: 'flex-start',
    margin: 5,
  },
  mountainInfoView: {
    flex: 1,
    backgroundColor: colors.white,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    overflow: 'hidden',
    marginTop: -30,
    paddingBottom: 20,
  },
  mountainScroll: {
    paddingHorizontal: 20,
    marginBottom: 60, // 메모 입력란 공간 확보
  },
  recordInfo: {
    marginTop: 20,
  },
  mountainTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  mountainHeight: {
    fontSize: 14,
    color: '#888',
  },
  hikingDetails: {
    flexDirection: 'row',
    marginTop: 10,
  },
  hikingDateView: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
  },
  timeImg: {
    width: 18,
    height: 18,
    marginRight: 5,
    tintColor: '#aaa',
  },
  hikingDistanceView: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  hikingDateTime: {
    fontSize: 12,
    color: '#aaa',
    marginLeft: 5,
  },
  hikingDistance: {
    fontSize: 12,
    color: '#aaa',
    marginLeft: 5,
  },
  distanceImg: {
    width: 18,
    height: 18,
    marginRight: 5,
    tintColor: '#aaa',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
  mapPlaceholder: {
    height: 200,
    backgroundColor: '#87CEEB', // 하늘색
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  mapPlaceholderText: {
    fontSize: 14,
    color: '#ffffff',
  },
  memoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  memoText: {
    fontSize: 14,
    color: '#333',
  },
  memoActions: {
    flexDirection: 'row',
  },
  editText: {
    fontSize: 14,
    color: colors.green,
    marginRight: 10,
  },
  deleteText: {
    fontSize: 14,
    color: colors.red,
  },
  noMemoText: {
    fontSize: 14,
    color: '#aaa',
    textAlign: 'center',
    marginVertical: 10,
  },
  memoInputContainer: {
    height: WINDOW_HEIGHT * 0.1,
    position: 'absolute',
    bottom: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    backgroundColor: colors.white,
    padding: 10,
    width: '100%',
    marginBottom: 10,
  },
  memoInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    borderRadius: 5,
    marginRight: 10,
  },
  registerText: {
    fontSize: 16,
    color: colors.green,
  },
});
