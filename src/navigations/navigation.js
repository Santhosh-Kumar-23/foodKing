import React from 'react';
import {
  TouchableOpacity,
  Text,
  View,
  useColorScheme,
  Image,
} from 'react-native';
import {createStackNavigator} from '@react-navigation/stack';
import {
  NavigationContainer,
  DarkTheme,
  DefaultTheme,
} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/HomeScreen';
import ProfileScreen from '../screens/ProfileScreen';
import OfferScreen from '../screens/OfferScreen';
import MenuScreen from '../screens/MenuScreen';
import SplashScreen from '../screens/SplashScreen';
import MyCartScreen from '../screens/MyCartScreen';
import Homee from 'react-native-vector-icons/Foundation';
import Menu from 'react-native-vector-icons/FontAwesome5';
import Offer from 'react-native-vector-icons/MaterialCommunityIcons';
import User from 'react-native-vector-icons/FontAwesome5';
import Bag from 'react-native-vector-icons/FontAwesome6';
import LoginScreen from '../screens/LoginScreen';
import SignupScreen from '../screens/SignupScreen';
import OtpScreen from '../screens/OtpScreen';
import MobileNumberScreen from '../screens/MobileNumberScreen';
import ForgetPasswordScreen from '../screens/ForgetPasswordScreen';
import ResetPasswordScreen from '../screens/ResetPasswordScreen';
import CategoriesScreen from '../screens/CategoriesScreen';
import Search from 'react-native-vector-icons/Feather';
import Ma from 'react-native-vector-icons/MaterialIcons';
import OfferList from '../screens/OfferList';
import SearchScreen from '../screens/SearchScreen';
import AddToCart from '../screens/AddToCart';
import CheckOut from '../screens/CheckOut';
import EditProfile from '../screens/EditProfile';
import ChangePassword from '../screens/changePassword';

const Navigation = ({navigation}) => {
  function BottomTab({navigation}) {
    const Tab = createBottomTabNavigator();

    return (
      <Tab.Navigator
        screenOptions={{
          tabBarActiveTintColor: '#ff146c',
          tabBarInactiveTintColor: '#000518',
          tabBarStyle: {
            height: 55,
            borderTopRightRadius: 10,
            borderTopLeftRadius: 10,
            backgroundColor: 'white',
          },
          tabBarLabelStyle: {fontSize: 10, paddingBottom: 5},
        }}>
        <Tab.Screen
          name="Home"
          component={HomeScreen}
          options={{
            headerShown: false,
            unmountOnBlur: true,
            tabBarIcon: ({focused, color}) => (
              <Homee
                name="home"
                size={21}
                color={focused ? '#ff146c' : '#000518'}
              />
            ),
          }}
        />
        <Tab.Screen
          name="Menu"
          component={CategoriesScreen}
          options={{
            headerTitleStyle: {color: 'white'},
            headerShown: true,
            tabBarIcon: ({focused}) => (
              <Menu
                name="file-alt"
                size={21}
                color={focused ? '#ff146c' : '#000518'}
              />
            ),
            headerLeft: () => {
              return (
                <View
                  style={{
                    marginLeft: 5,
                  }}>
                  <Image
                    source={require('../assets/foodking.png')}
                    style={{
                      height: 32,
                      width: 70,
                      resizeMode: 'contain',
                      marginHorizontal: 20,
                    }}
                  />
                </View>
              );
            },
            headerRight: () => {
              return (
                <TouchableOpacity
                  style={{marginHorizontal: 20}}
                  onPress={() => {
                    navigation.navigate('Search');
                  }}>
                  <Search name="search" size={25} color={'#000518'} />
                </TouchableOpacity>
              );
            },
          }}
        />
        <Tab.Screen
          name="MyCart"
          component={MyCartScreen}
          options={{
            headerShown: false,
            unmountOnBlur: true,

            tabBarIcon: ({focused}) => (
              <View
                style={{
                  position: 'absolute',
                  bottom: 10, // space from bottombar
                  height: 58,
                  width: 58,
                  borderRadius: 58,
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: '#ff146c',
                  elevation: 10,
                  shadowColor: 'blue',
                  shadowOpacity: 0.5,
                }}>
                <Bag name="bag-shopping" size={23} color={'white'} />
              </View>
            ),
          }}
        />
        <Tab.Screen
          name="Offers"
          component={OfferScreen}
          options={{
            headerShown: true,
            headerTitleStyle: {fontWeight: 'bold', fontSize: 15},

            tabBarIcon: ({focused}) => (
              <Offer
                name="brightness-percent"
                size={21}
                color={focused ? '#ff146c' : '#000518'}
              />
            ),
          }}
        />
        <Tab.Screen
          name="Profile"
          component={ProfileScreen}
          options={{
            headerShown: false,
            unmountOnBlur: true,

            tabBarIcon: ({focused}) => (
              <User
                name="user-circle"
                size={21}
                color={focused ? '#ff146c' : '#000518'}
              />
            ),
          }}
        />
      </Tab.Navigator>
    );
  }
  

  const Stack = createStackNavigator();
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="SplashScreen">
        <Stack.Screen
          name="SplashScreen"
          component={SplashScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="HomeScreen"
          component={BottomTab}
          options={{headerShown: false}}
        />

        <Stack.Screen
          name="LoginScreen"
          component={LoginScreen}
          options={{
            headerShown: true,
            headerMode: 'float',
            headerLeft: () => null,
            headerTitleStyle: {color: 'white'},
            headerShadowVisible: false,
            headerTintColor: '#ff146c',
          }}
        />
        <Stack.Screen
          name="EditProfile"
          component={EditProfile}
          options={{
            headerShown: true,
            headerMode: 'float',
            // headerLeft: () => null,
            headerTitleStyle: {color: 'white'},
            headerShadowVisible: false,
            headerTintColor: '#ff146c',
          }}
        />
        <Stack.Screen
          name="ChangePassword"
          component={ChangePassword}
          options={{
            headerShown: true,
            headerMode: 'float',
            // headerLeft: () => null,
            headerTitleStyle: {color: 'white'},
            headerShadowVisible: false,
            headerTintColor: '#ff146c',
          }}
        />
        <Stack.Screen
          name="CheckOut"
          component={CheckOut}
          options={{
            headerShown: false,
            headerMode: 'float',
            headerLeft: () => null,
            headerTitleStyle: {color: 'white'},
            headerShadowVisible: false,
            headerTintColor: '#ff146c',
          }}
        />
        <Stack.Screen
          name="OtpScreen"
          component={OtpScreen}
          options={{
            headerShown: true,
            headerMode: 'float',
            headerTitleStyle: {color: 'white'},
            headerShadowVisible: false,
            headerTintColor: '#ff146c',
          }}
        />
        <Stack.Screen
          name="SignupScreen"
          component={SignupScreen}
          options={{
            headerShown: true,
            headerMode: 'screen',
            headerTitleStyle: {color: 'white'},
            headerShadowVisible: false,
            headerTintColor: '#ff146c',
          }}
        />
        <Stack.Screen
          name="offers"
          component={OfferList}
          options={{
            headerShown: true,
            headerMode: 'screen',
            headerTitleStyle: {
              color: '#ff146c',
              fontWeight: '700',
              fontSize: 15,
            },
            headerShadowVisible: false,
            headerTintColor: '#ff146c',
          }}
        />
        <Stack.Screen
          name="Search"
          component={SearchScreen}
          options={{
            headerShown: true,
            headerMode: 'screen',
            headerTitleStyle: {
              color: '#ff146c',
              fontWeight: '700',
              fontSize: 15,
            },
            headerShadowVisible: false,
            headerTintColor: '#ff146c',
          }}
        />
        <Stack.Screen
          name="MobileNumberScreen"
          component={MobileNumberScreen}
          options={{
            headerShown: true,
            headerMode: 'screen',
            headerTitleStyle: {color: 'white'},
            headerShadowVisible: false,
            headerTintColor: '#ff146c',
          }}
        />
        <Stack.Screen
          name="ForgetPasswordScreen"
          component={ForgetPasswordScreen}
          options={{
            headerShown: true,
            headerMode: 'screen',
            headerTitleStyle: {color: 'white'},
            headerShadowVisible: false,
            headerTintColor: '#ff146c',
          }}
        />
        <Stack.Screen
          name="ResetPasswordScreen"
          component={ResetPasswordScreen}
          options={{
            headerShown: true,
            headerMode: 'screen',
            headerTitleStyle: {color: 'white'},
            headerShadowVisible: false,
            headerTintColor: '#ff146c',
          }}
        />
        <Stack.Screen
          name="AddToCart"
          component={AddToCart}
          options={{
            headerShown: false,
            headerMode: 'screen',
            headerTitleStyle: {color: 'white'},
            headerShadowVisible: false,
            headerTintColor: '#ff146c',
          }}
        />
        <Stack.Screen
          name="CategoriesScreen"
          component={CategoriesScreen}
          options={({navigation}) => ({
            headerShown: true,
            unmountOnBlur: true,
            headerMode: 'screen',
            headerTitleStyle: {color: 'white'},
            headerShadowVisible: false,
            headerTintColor: '#ff146c',
            headerRightContainerStyle: {
              paddingHorizontal: 15,
              backgroundColor: 'white',
            },
            headerLeft: () => {
              return (
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginLeft: 5,
                  }}>
                  <TouchableOpacity
                    onPress={() => {
                      navigation.navigate('HomeScreen', {
                        screen: 'Home',
                      });
                    }}>
                    <Ma name="arrow-back" size={25} color={'#ff146c'} />
                  </TouchableOpacity>
                  <Image
                    source={require('../assets/foodking.png')}
                    style={{
                      height: 32,
                      width: 70,
                      resizeMode: 'contain',
                      marginHorizontal: 10,
                    }}
                  />
                </View>
              );
            },
            headerRight: () => {
              return (
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate('Search');
                  }}>
                  <Search name="search" size={25} color={'#000518'} />
                </TouchableOpacity>
              );
            },
          })}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Navigation;
