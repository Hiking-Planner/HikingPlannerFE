import React from 'react';
import {
  View,
  ScrollView,
  Image,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { WINDOW_WIDTH, WINDOW_HEIGHT } from './sub/dimensions';
import Header from './Header/searchheader';
import Footer from './footer';
import { useNavigation } from '@react-navigation/native'; // useNavigation 훅 가져오기

export default function Mypage() {
  const navigation = useNavigation(); // navigation 객체 생성

  return (
    <View style={styles.container}>
      <View style={styles.wrapper}>
        <Header />
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={styles.homeScroll}
          bounces
          contentInset={{ bottom: 300 }}
        >
          <TouchableOpacity
            onPress={() => navigation.navigate('Login')} // Login 페이지로 이동
          >
            <View style={styles.userContainer}>
              <Image
                source={require('../assets/icon/user.png')}
                style={styles.userIcon}
              />
              <View style={styles.textContainer}>
                <Text style={styles.loginSignupText}>로그인 및 회원가입</Text>
                <Text style={styles.memberText}>
                  하이킹 플래너의 회원이 되어주세요
                </Text>
              </View>
            </View>
          </TouchableOpacity>
          <View style={styles.section}>
            <View style={styles.header}>
              <Text style={styles.headerText}>마이 컨텐츠</Text>
            </View>
            <TouchableOpacity style={styles.menuItem}>
              <Image
                source={require('../assets/icon/course_icon.png')}
                style={styles.icon}
              />
              <Text style={styles.menuText}>나의 코스</Text>
              <Text style={styles.arrow}>&gt;</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem}>
              <Image
                source={require('../assets/icon/hiking_icon.png')}
                style={styles.icon}
              />
              <Text style={styles.menuText}>등산 기록</Text>
              <Text style={styles.arrow}>&gt;</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem}>
              <Image
                source={require('../assets/icon/write_icon.png')}
                style={styles.icon}
              />
              <Text style={styles.menuText}>작성한 글</Text>
              <Text style={styles.arrow}>&gt;</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem}>
              <Image
                source={require('../assets/icon/comment_icon.png')}
                style={styles.icon}
              />
              <Text style={styles.menuText}>나의 댓글</Text>
              <Text style={styles.arrow}>&gt;</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.divider}></View>
          <View style={styles.section}>
            <View style={styles.header}>
              <Text style={styles.headerText}>하플 이용하기</Text>
            </View>
            <TouchableOpacity style={styles.menuItem}>
              <Image
                source={require('../assets/icon/notification_icon.png')}
                style={styles.icon}
              />
              <Text style={styles.menuText}>공지 사항</Text>
              <Text style={styles.arrow}>&gt;</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem}>
              <Image
                source={require('../assets/icon/question_icon.png')}
                style={styles.icon}
              />
              <Text style={styles.menuText}>1:1 문의</Text>
              <Text style={styles.arrow}>&gt;</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.divider}></View>
          <View style={styles.section}>
            <View style={styles.header}>
              <Text style={styles.headerText}>이용 정책</Text>
            </View>
            <TouchableOpacity style={styles.menuItem}>
              <Image
                source={require('../assets/icon/policy_icon.png')}
                style={styles.icon}
              />
              <Text style={styles.menuText}>이용 약관</Text>
              <Text style={styles.arrow}>&gt;</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem}>
              <Image
                source={require('../assets/icon/privacy_icon.png')}
                style={styles.icon}
              />
              <Text style={styles.menuText}>개인정보 처리 방침</Text>
              <Text style={styles.arrow}>&gt;</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.divider}></View>
          <View style={styles.section}>
            <View style={styles.header}>
              <Text style={styles.headerText}>회원 설정</Text>
            </View>
            <TouchableOpacity style={styles.menuItem}>
              <Image
                source={require('../assets/icon/logout_icon.png')}
                style={styles.icon}
              />
              <Text style={styles.menuText}>로그 아웃</Text>
              <Text style={styles.arrow}>&gt;</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem}>
              <Image
                source={require('../assets/icon/delete_icon.png')}
                style={styles.icon}
              />
              <Text style={styles.menuText}>회원 탈퇴</Text>
              <Text style={styles.arrow}>&gt;</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
        <Footer />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alightItems: 'center',
    justifyContent: 'center',
    height: WINDOW_HEIGHT,
  },
  homeScroll: {
    height: WINDOW_HEIGHT,
  },
  wrapper: {
    flex: 1,
    paddingBottom: WINDOW_HEIGHT * 0.1,
  },
  userContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userIcon: {
    width: 70,
    height: 70,
    marginTop: 10,
    marginLeft: 20,
    marginBottom: 20,
    marginRight: 10,
  },
  textContainer: {
    flex: 1,
    marginLeft: 10,
  },
  loginSignupText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
    marginBottom: 5,
  },
  memberText: {
    fontSize: 14,
    color: 'grey',
    marginBottom: 10,
  },
  section: {
    marginTop: 10,
  },
  headerText: {
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 10,
    marginLeft: 10,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
    marginLeft: 5,
  },
  menuText: {
    fontSize: 16,
    color: 'black',
  },
  arrow: {
    fontSize: 16,
    color: 'black',
    marginLeft: 'auto',
  },
  icon: {
    width: 20,
    height: 20,
    marginRight: 5,
  },
  divider: {
    height: 5,
    width: '100%',
    backgroundColor: '#CCCCCC',
    marginTop: 10,
  },
});
