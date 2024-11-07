import React from 'react';
import * as AuthSession from 'expo-auth-session';
import { NavigationContainer } from '@react-navigation/native';
import {
  createStackNavigator,
  CardStyleInterpolators,
} from '@react-navigation/stack';
import Home from './mainView/home';
import Start from './mainView/start';
import Kakaologin from './mainView/kakaologin';
import Login from './mainView/login';
import Signup from './mainView/signup';
import Mountain from './mainView/mountaindo/mountain';
import Commu from './mainView/commu';
import Mypage from './mainView/mypage/mypage';
import RouteMore from './mainView/mountaindo/routeMore';
import { HikingMapView } from './mainView/mapdo/mapView';
import AllMountain from './mainView/mountaindo/allMountains';
import CategoryMountain from './mainView/mountaindo/categorymount';
import Route from './mainView/scrapdo/route';
import Header from './mainView/Header/header';
import ScrapMore from './mainView/scrapdo/scrapMore';
import SearchAdd from './mainView/searchAdd';
import MoreMountain from './mainView/mountaindo/moreMountain';
import MountainMainApi from './mainView/mountaindo/mountainMainApi';
import MyContent from './mainView/mypage/mycontent';
import RecordDetail from './mainView/mypage/recordDetail';
import MyProfile from './mainView/mypage/myProfile';

const Stack = createStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false, // 상단 헤더 숨기기
          cardStyleInterpolator: CardStyleInterpolators.forNoAnimation,
        }}
        initialRouteName='Start'
      >
        <Stack.Screen name='Home' component={Home} />
        <Stack.Screen name='Start' component={Start} />
        <Stack.Screen name='Kakaologin' component={Kakaologin} />
        <Stack.Screen name='Login' component={Login} />
        <Stack.Screen name='Signup' component={Signup} />
        <Stack.Screen name='Mountain' component={Mountain} />
        <Stack.Screen name='Commu' component={Commu} />
        <Stack.Screen name='Mypage' component={Mypage} />
        <Stack.Screen name='AllMountain' component={AllMountain} />
        <Stack.Screen name='CategoryMountain' component={CategoryMountain} />
        <Stack.Screen name='RouteMore' component={RouteMore} />
        <Stack.Screen name='Route' component={Route} />
        <Stack.Screen name='HikingMapView' component={HikingMapView} />
        <Stack.Screen name='Header' component={Header} />
        <Stack.Screen name='ScrapMore' component={ScrapMore} />
        <Stack.Screen name='SearchAdd' component={SearchAdd} />
        <Stack.Screen name='MoreMountain' component={MoreMountain} />
        <Stack.Screen name='MountainMainApi' component={MountainMainApi} />
        <Stack.Screen name='MyContent' component={MyContent} />
        <Stack.Screen name='RecordDetail' component={RecordDetail} />
        <Stack.Screen name='MyProfile' component={MyProfile} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
