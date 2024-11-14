import React from 'react';
import {
  View,
  ScrollView,
  Image,
  StyleSheet,
  TouchableOpacity,
  Linking,
} from 'react-native';
import { WINDOW_WIDTH, WINDOW_HEIGHT } from './sub/dimensions';
import Header from './Header/header';
import Search from './searchSection';
import CategoryMountain from './mountaindo/categorymount';
import Footer from './footer';

export default function Home() {
  const banners = [
    {
      image: require('../assets/banner/banner.png'),
      url: 'https://github.com/Hiking-Planner',
    },
  ];

  const handleBannerPress = (url) => {
    Linking.openURL(url);
  };

  return (
    <View style={styles.container}>
      <View style={styles.wrapper}>
        <Header />
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={styles.homeScroll}
        >
          <ScrollView
            pagingEnabled
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.bannerScroll}
          >
            {banners.map((banner, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => handleBannerPress(banner.url)}
              >
                <Image
                  source={banner.image}
                  style={styles.banner}
                  resizeMode='cover'
                />
              </TouchableOpacity>
            ))}
          </ScrollView>
          <CategoryMountain />
        </ScrollView>
        <Footer />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
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
});
