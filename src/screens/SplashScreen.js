import React, {useEffect} from 'react';
import {View, Text, Image, StatusBar} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';

const SplashScreen = ({navigation}) => {
  const getToken = async () => {
    const userDetails = await AsyncStorage.getItem('userDetails');

    if (Boolean(userDetails)) {
      setTimeout(() => {
        navigation.navigate('HomeScreen', {
          screen: 'Home',
        });
      }, 2000);
    } else {
      navigation.navigate('LoginScreen');
    }

    console.log('TOKEN:::::::', userDetails);
  };
  useEffect(() => {
    getToken();
  }, []);

  // useEffect(() => {
  //   setTimeout(() => {
  //     // navigation.navigate('HomeScreen', {
  //     //   screen: 'Home',
  //     // });
  //     navigation.navigate('LoginScreen');
  //   }, 2000);
  // }, []);

  return (
    <View style={{backgroundColor: 'white', flex: 1}}>
      <StatusBar backgroundColor={'#ff146c'} barStyle={'light-content'} />
      <View style={{height: '100%', width: '100%'}}>
        <Image
          resizeMode="cover"
          source={require('../assets/splash.png')}
          style={{height: '100%', width: '100%'}}
        />
      </View>
    </View>
  );
};

export default SplashScreen;
