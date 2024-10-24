import React, { useEffect, useState } from 'react';
import {
  View,
  FlatList,
  Image,
  StyleSheet,
  Text,
  Platform,
  TouchableOpacity,
} from 'react-native';
import IconButton from '../sub/IconButton';
import { getMountains } from '../api/mountainService';
import colors from '../sub/colors';
import { WINDOW_HEIGHT } from '../sub/dimensions';
import { useNavigation, useRoute } from '@react-navigation/native';
import { basicAxios } from '../api/axios';

const MountainCard = ({ mountain }) => {
  const navigation = useNavigation();
  return (
    <TouchableOpacity
      onPress={() => navigation.navigate('MountainMainApi', { mountain })}
    >
      <View style={styles.card}>
        <Image
          source={{
            uri: `${basicAxios.defaults.baseURL}${mountain.image_info[0].img_url}.jpg`,
          }}
          style={styles.image}
        />
        <View style={styles.infoContainer}>
          <Text style={styles.name}>{mountain.mountain_name}</Text>
          <Text style={styles.details}>
            {mountain.elevation}m - {mountain.location}
          </Text>
        </View>
        <Text style={styles.comments}>{mountain.mountain_comment}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default function MoreMountain() {
  const [mountains, setMountains] = useState([]);
  const navigation = useNavigation();
  const route = useRoute();
  const { mountains: filteredMountains, title } = route.params || {};

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (filteredMountains) {
          setMountains(filteredMountains);
        } else {
          const data = await getMountains();
          setMountains(data);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [filteredMountains]);

  return (
    <View style={styles.container}>
      <View style={styles.wrapper}>
        <View style={styles.header}>
          <View style={styles.leftBtn}>
            <IconButton
              iconName='chevron-left'
              onPress={() => navigation.goBack()}
            />
          </View>
          <Text style={styles.headerTitle}>{title || '전체보기'}</Text>
          <View style={styles.btns}>
            <IconButton
              iconName='search'
              onPress={() => navigation.navigate('SearchAdd')}
            />
            <IconButton
              iconName='bookmark'
              onPress={() => navigation.navigate('ScrapMore')}
            />
          </View>
        </View>
        <FlatList
          data={mountains}
          renderItem={({ item }) => <MountainCard mountain={item} />}
          keyExtractor={(mountain) => mountain.mountain_id.toString()}
          showsVerticalScrollIndicator={false}
        />
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
  wrapper: {
    flex: 1,
  },
  header: {
    height: WINDOW_HEIGHT * 0.09,
    flexDirection: 'row',
    alignItems: 'center',
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
  btns: { flexDirection: 'row', flex: 2 },
  card: {
    marginHorizontal: 15,
    marginBottom: 20,
    borderRadius: 10,
    backgroundColor: colors.white,
    ...Platform.select({
      ios: {
        shadowColor: colors.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  image: {
    width: '100%',
    height: 170,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  infoContainer: {
    padding: 10,
    flexDirection: 'row',
  },
  name: {
    fontWeight: 'bold',
    fontSize: 18,
  },
  details: {
    fontSize: 12,
    marginLeft: 8,
    marginTop: 3,
    color: colors.Gray,
  },
  comments: {
    marginLeft: 10,
    marginBottom: 5,
    fontSize: 12,
    color: colors.Gray,
  },
});
