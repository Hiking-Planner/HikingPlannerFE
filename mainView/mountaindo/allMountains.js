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

const MountainView = ({ mountain }) => {
  const navigation = useNavigation();
  return (
    <TouchableOpacity
      onPress={() => navigation.navigate('MountainMainApi', { mountain })}
    >
      <View style={styles.allMountainCard}>
        <Image
          source={{
            uri: `http://3.34.159.30:8080/${mountain.image_info[0].img_url}`,
          }}
          style={styles.allMountImage}
        />
        <Text style={styles.allMountName}>{mountain.mountain_name}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default function AllMountain() {
  const navigation = useNavigation();
  const [mountains, setMountains] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMountains() {
      try {
        const data = await getMountains();
        setMountains(data);
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

  const all = mountains.length;
  return (
    <View style={styles.allMountainsView}>
      <Text style={styles.titleText}>이번 주엔{'\n'}어느 산으로 갈까요?</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollViewAllMountains}
      >
        {mountains.map((mountain, index) => (
          <MountainView key={index} mountain={mountain} />
        ))}
      </ScrollView>
      <View style={styles.allBtn}>
        <TouchableOpacity>
          <Text
            style={styles.allBtnText}
            onPress={() => navigation.navigate('MoreMountain', { mountains })}
          >
            {all}개 산 전체보기
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleText: {
    marginLeft: 10,
    fontSize: 18,
    fontWeight: 'bold',
  },
  allMountainsView: {
    borderBottomWidth: 8,
    borderBottomColor: colors.vectorGray,
  },
  allMountainCard: {
    alignItems: 'center',
    width: WINDOW_WIDTH * 0.23,
    height: WINDOW_WIDTH * 0.35,
    margin: 5,
  },
  allMountImage: {
    width: WINDOW_WIDTH * 0.23,
    height: WINDOW_WIDTH * 0.23,
    borderRadius: 50,
    marginTop: 5,
  },
  allMountName: {
    marginTop: 5,
    fontSize: 14,
    fontWeight: '900',
  },
  allBtn: {
    alignItems: 'center',
    borderColor: colors.mintGreen,
    borderWidth: 2,
    borderRadius: 20,
    marginTop: -10,
    marginBottom: 10,
    marginHorizontal: 10,
  },
  allBtnText: {
    color: colors.Green,
    fontWeight: '900',
    margin: 5,
  },
});
