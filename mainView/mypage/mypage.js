import React from 'react';
import {
  View,
  ScrollView,
  Image,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { WINDOW_WIDTH, WINDOW_HEIGHT } from '../sub/dimensions';
import { useNavigation } from '@react-navigation/native';
import Header from '../Header/searchheader';
import Footer from '../footer';
import Login from '../login';
import useUserInfoStore from '../stores/userInfoStore'; // `useUserInfoStore`로 변경

export default function Mypage() {
  const navigation = useNavigation();
  const { userInfo } = useUserInfoStore(); // 상태 가져오기
  const { isLoggedIn, nickname } = userInfo; // 상태에서 값 추출
  console.log(isLoggedIn, nickname);

  return (
    <View style={styles.container}>
      <View style={styles.wrapper}>
        <Header></Header>
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={styles.homeScroll}
          bounces
          contentInset={{ bottom: 300 }}
        >
          <TouchableOpacity
            onPress={() => {
              isLoggedIn ? navigation.navigate('MyProfile') : navigation.navigate(Login);
            }}
          >
            <View style={styles.userContainer}>
              <Image
                source={require('../../assets/icon/user.png')}
                style={styles.userIcon}
              />
              <View style={styles.textContainer}>
                {isLoggedIn ? (
                  <>
                    <Text style={styles.loginSignupText}>{nickname}님</Text>
                    <Text style={styles.memberText}>
                      하이킹 플래너의 회원이 되어주셔서 감사합니다
                    </Text>
                  </>
                ) : (
                  <>
                    <Text style={styles.loginSignupText}>로그인 및 회원가입</Text>
                    <Text style={styles.memberText}>
                      하이킹 플래너의 회원이 되어주세요
                    </Text>
                  </>
                )}
              </View>
            </View>
          </TouchableOpacity>

          {isLoggedIn && (
            <>
              <View style={styles.section}>
                <View style={styles.header}>
                  <Text style={styles.headerText}>마이 컨텐츠</Text>
                </View>
                <TouchableOpacity
                  style={styles.menuItem}
                  onPress={() => navigation.navigate('MyContent')}
                >
                  <Image
                    source={require('../../assets/icon/course_icon.png')}
                    style={styles.icon}
                  />
                  <Text style={styles.menuText}>나의 코스</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.menuItem}>
                  <Image
                    source={require('../../assets/icon/hiking_icon.png')}
                    style={styles.icon}
                  />
                  <Text style={styles.menuText}>등산 기록</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.menuItem}>
                  <Image
                    source={require('../../assets/icon/write_icon.png')}
                    style={styles.icon}
                  />
                  <Text style={styles.menuText}>작성한 글</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.menuItem}>
                  <Image
                    source={require('../../assets/icon/comment_icon.png')}
                    style={styles.icon}
                  />
                  <Text style={styles.menuText}>나의 댓글</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.divider}></View>
              <View style={styles.section}>
                <View style={styles.header}>
                  <Text style={styles.headerText}>회원 설정</Text>
                </View>
                <TouchableOpacity style={styles.menuItem}>
                  <Image
                    source={require('../../assets/icon/logout_icon.png')}
                    style={styles.icon}
                  />
                  <Text style={styles.menuText}>로그 아웃</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.menuItem}>
                  <Image
                    source={require('../../assets/icon/delete_icon.png')}
                    style={styles.icon}
                  />
                  <Text style={styles.menuText}>회원 탈퇴</Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        </ScrollView>
        <Footer></Footer>
      </View>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    alightItems: 'center',
    justifyContent: 'center',
    height: WINDOW_HEIGHT,
    backgroundColor: '#FFFFFF',
  },
  homeScroll: {
    height: WINDOW_HEIGHT,
  },
  wrapper: {
    flex: 1,
    paddingBottom: WINDOW_HEIGHT * 0.1,
  },
  bannerScroll: {
    height: WINDOW_HEIGHT * 0.22,
    marginTop: 15,
  },
  banner: {
    width: WINDOW_WIDTH,
    height: WINDOW_HEIGHT * 0.22,
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
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    marginLeft: 10,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'left',
    marginBottom: 10,
    marginLeft: 5,
  },
  menuText: {
    fontSize: 18,
    color: 'black',
    alignItems: 'baseline',
  },
  icon: {
    width: 20,
    height: 20,
    marginRight: 5,
  },
  divider: {
    height: 5,
    width: '100%',
    backgroundColor: '#E0E0E0',
    marginTop: 10,
    marginBottom: 10,
  },
});
