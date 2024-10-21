import React from 'react';
import { View, ScrollView, Image, StyleSheet } from 'react-native';
import { WINDOW_WIDTH, WINDOW_HEIGHT } from './sub/dimensions';
import Header from './Header/header';
import Search from './searchSection';
import CategoryMountain from './mountaindo/categorymount';
import Footer from './footer';

export default function Home() {
  const banners = [
    {
      image: require('../assets/banner/6kbanner.jpg'),
    },
    {
      image: require('../assets/banner/mountbanner.jpg'),
    },
    {
      image: require('../assets/banner/warnbanner.jpg'),
    },
    {
      image: require('../assets/banner/pointbanner.jpg'),
    },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.wrapper}>
        <Header></Header>
        <Search></Search>
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
              <Image
                key={index}
                source={banner.image}
                style={styles.banner}
                resizeMode='cover'
              />
            ))}
          </ScrollView>
          <CategoryMountain></CategoryMountain>
        </ScrollView>
        <Footer></Footer>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
