import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
} from 'react-native';
import IconButton from '../sub/IconButton';
import colors from '../sub/colors';
import { WINDOW_HEIGHT } from '../sub/dimensions';
import { useNavigation, useRoute } from '@react-navigation/native';
import MyPost from './myPost';
import MyRecord from './myRecord';

export default function MyContent() {
  const navigation = useNavigation();
  const route = useRoute();
  const [activeTab, setActiveTab] = useState(
    route.params?.activeTab || 'hiking'
  ); // 기본 탭은 '등산기록'

  // 각 탭에 따른 컨텐츠 렌더링
  const renderContent = () => {
    if (activeTab === 'hiking') {
      return <MyRecord />;
    } else if (activeTab === 'posts') {
      return <MyPost />;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.wrapper}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.leftBtn}>
            <IconButton
              iconName='chevron-left'
              onPress={() => {
                navigation.goBack();
              }}
            />
          </View>
          <Text style={styles.headerTitle}>기록</Text>
          <View style={styles.btns}>
            <IconButton iconName='search' />
            <IconButton iconName='bookmark' />
          </View>
        </View>

        {/* Tabs */}
        <View style={styles.tabs}>
          <TouchableOpacity
            onPress={() => setActiveTab('hiking')}
            style={styles.tab}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === 'hiking' && styles.activeTab,
              ]}
            >
              등산기록
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setActiveTab('posts')}
            style={styles.tab}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === 'posts' && styles.activeTab,
              ]}
            >
              작성한 글
            </Text>
          </TouchableOpacity>
        </View>

        {/* Content */}
        <View style={styles.content}>{renderContent()}</View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff', // 전체 배경 흰색으로 설정
    justifyContent: 'center',
    alignItems: 'center',
  },
  wrapper: {
    flex: 1,
    width: '100%',
  },
  header: {
    height: WINDOW_HEIGHT * 0.09,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: WINDOW_HEIGHT * 0.035,
  },
  leftBtn: {
    flex: 2,
  },
  headerTitle: {
    flex: 7,
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
  },
  btns: {
    flexDirection: 'row',
    flex: 2,
  },
  tabs: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    marginBottom: 10,
  },
  tab: {
    padding: 10,
  },
  tabText: {
    fontSize: 16,
    color: '#999',
  },
  activeTab: {
    color: 'black',
    fontWeight: 'bold',
    borderBottomWidth: 2,
    borderBottomColor: 'black',
  },
  content: {
    flex: 1,
    paddingHorizontal: 10,
  },
  recordItem: {
    flexDirection: 'row',
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 10,
    marginVertical: 10,
    borderWidth: 1, // 테두리 추가
    borderColor: '#ddd', // 테두리 색상 설정
    shadowColor: '#000', // 그림자 색상
    shadowOffset: { width: 0, height: 2 }, // 그림자 위치
    shadowOpacity: 0.1, // 그림자 투명도
    shadowRadius: 4, // 그림자 크기
    elevation: 3, // 안드로이드 그림자
    alignItems: 'center', // 모든 항목 수직 중앙 정렬
  },
  hikingImage: {
    width: 70,
    height: 70,
    borderRadius: 10,
  },
  hikingDetails: {
    flex: 1,
    marginLeft: 15,
    justifyContent: 'center', // 텍스트가 수직 중앙에 위치하도록
  },
  hikingHeader: {
    flexDirection: 'column', // D+1을 산 이름 위로 배치
  },
  hikingTitleAndHeight: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8, // 제목과 태그 간격 추가
    marginBottom: 7,
  },
  hikingTitle: {
    fontSize: 18,
    marginRight: 5,
    fontWeight: 'bold',
  },
  hikingHeight: {
    fontSize: 11,
    marginTop: 5,
    color: '#888',
  },
  hikingDateView: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 3,
  },
  timeImg: {
    width: 18,
    height: 18,
    marginRight: 5,
    tintColor: '#aaa',
  },
  hikingDateTime: {
    fontSize: 12,
    color: '#aaa',
    marginTop: 5,
  },
  hikingDistanceView: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  distanceImg: {
    width: 18,
    height: 18,
    marginRight: 5,
    tintColor: '#aaa',
  },
  hikingDistance: {
    fontSize: 12,
    color: '#aaa',
    marginTop: 5,
  },
  dPlusTag: {
    backgroundColor: '#e0f7e0',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 15,
    justifyContent: 'center',
    alignSelf: 'flex-start', // 태그를 제목 위에 고정
  },
  dPlusText: {
    color: '#33a852',
    fontWeight: 'bold',
    fontSize: 12,
  },
  rightBtn: {
    justifyContent: 'center', // chevron이 수직 중앙에 오도록 설정
  },
});
