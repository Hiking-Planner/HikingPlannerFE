import React, { useEffect, useState } from 'react';
import {
  View,
  ScrollView,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import colors from '../sub/colors';
import { WINDOW_WIDTH } from '../sub/dimensions';
import { useNavigation } from '@react-navigation/native';
import { getMountains } from '../api/mountainService';

const CategorySection = ({ title, data }) => {
  const navigation = useNavigation();
  return (
    <View style={styles.mount}>
      <View style={styles.titleMount}>
        <Text style={styles.titleText}>{title}</Text>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate('MoreMountain', { title, mountains: data })
          }
        >
          <View style={styles.moreBtn}>
            <Text style={styles.moreText}>+ 더보기</Text>
          </View>
        </TouchableOpacity>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {data.map((item, index) => (
          <TouchableOpacity
            key={index}
            onPress={() =>
              navigation.navigate('MountainMainApi', { mountain: item })
            }
          >
            <View style={styles.mountView}>
              <Image
                source={{
                  uri: `http://ec2-3-143-125-20.us-east-2.compute.amazonaws.com:8080/${item.image_info[0].img_url}`,
                }}
                style={styles.mountImage}
              />
              <View style={styles.textContainer}>
                <Text style={styles.mountText}>{item.mountain_name}</Text>
                <Text style={styles.mountHeight}>
                  {`${item.elevation}m - ${item.location}`}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

export default function CategoryMountain() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMountains() {
      try {
        const data = await getMountains();
        const categoryData = [
          {
            title: '금주의 인기 산',
            data: data.slice(0, 3),
          },
          {
            title: '하플이 추천하는 봄꽃 명소 🌸',
            data: data.slice(3, 6),
          },
          {
            title: '등린이 추천 산 🌱',
            data: data.slice(6),
          },
        ];
        setCategories(categoryData);
      } catch (error) {
        console.error('Error fetching mountains:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchMountains();
  }, []);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size='large' color={colors.Green} />
      </View>
    );
  }

  return (
    <View style={styles.categoryMount}>
      {categories.map((category, index) => (
        <CategorySection
          key={index}
          title={category.title}
          data={category.data}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mount: {
    width: WINDOW_WIDTH,
    borderBottomWidth: 8,
    borderBottomColor: colors.vectorGray,
  },
  titleMount: {
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  titleText: {
    marginLeft: 10,
    fontSize: 18,
    fontWeight: 'bold',
  },
  moreBtn: {
    marginRight: 10,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: colors.mintGreen,
    overflow: 'hidden',
  },
  moreText: {
    fontSize: 12,
    fontWeight: '600',
    margin: 4,
    color: colors.Green,
  },
  mountView: {
    margin: 7,
    borderRadius: 10,
    alignItems: 'center',
    width: WINDOW_WIDTH * 0.3,
  },
  mountImage: {
    width: WINDOW_WIDTH * 0.3,
    height: 100,
    borderRadius: 10,
  },
  textContainer: {
    flexDirection: 'row',
  },
  mountText: {
    fontSize: 15,
    fontWeight: 'bold',
    marginTop: 5,
  },
  mountHeight: {
    fontSize: 9,
    color: colors.Gray,
    marginTop: 7,
    marginLeft: 5,
  },
});
