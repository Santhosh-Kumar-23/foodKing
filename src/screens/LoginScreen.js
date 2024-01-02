import React, {useState, useRef, useEffect} from 'react';
import {
  View,
  Text,
  StatusBar,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import {TextInput} from 'react-native-gesture-handler';
import Eyes from 'react-native-vector-icons/Ionicons';
import CheckBox from 'react-native-check-box';
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  gql,
  useQuery,
  useMutation,
} from '@apollo/client';

import Snackbar from 'react-native-snackbar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {showMessage, hideMessage} from 'react-native-flash-message';

const LoginScreen = ({navigation}) => {
  const input = useRef(null);
  const inputInterval = useRef(null);

  const [checked, setChecked] = useState(false);
  const [icon, setIcon] = useState(true);

  const [loading, setLoading] = useState(false);

  const [isActiveEmail, setActiveEmail] = useState(false);
  const [isActivePassword, setIsActivePassword] = useState(false);

  //state variables
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);

  //error variables
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);

  //check error variabls
  const [checkEmail, setCheckEmail] = useState(null);
  const [checkPassword, setCheckPassword] = useState(null);

  //create a corresponding GraphQL mutation
  const LOGIN_DETAILS = gql`
    mutation Mutation($password: String!, $email: String) {
      login(password: $password, email: $email) {
        message
        token
        data {
          id
          email
          phoneNo
          firstName
          lastName
          password
          confirmPassword
          profileImage
        }
      }
    }
  `;

  //Inside it, we'll pass our LOGIN_DETAILS mutation to the useMutation hook:
  const [Login] = useMutation(LOGIN_DETAILS);

  const validate = text => {
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;
    setCheckEmail(!reg.test(text));
  };
  const validatePassword = text => {
    let reg = /[0-9a-zA-Z]{6,}/;
    setCheckPassword(!reg.test(text));
  };

  const handleError = () => {
    setEmailError(!Boolean(email));
    setPasswordError(!Boolean(password));
    validate(email);
    validatePassword(password);
    setActiveEmail(true);
    setIsActivePassword(true);
  };

  const handleLogin = () => {
    setLoading(true);
    if (
      Boolean(email) &&
      Boolean(password) &&
      !Boolean(checkEmail) &&
      !Boolean(checkPassword)
    ) {
      Login({
        variables: {
          password: password,
          email: email,
        },
      })
        .then(async response => {
          setLoading(false);
          console.log('LOGIN RESPONSSE::::::::::', response);
          if (response?.data?.login?.message == 'Login Successfully') {
            await AsyncStorage.setItem(
              'userDetails',
              JSON.stringify(response?.data?.login?.token),
            );

            await AsyncStorage.setItem(
              'userInfo',
              JSON.stringify(response?.data?.login?.data?.email),
            );
            await AsyncStorage.setItem(
              'userName',
              JSON.stringify(response?.data?.login?.data?.firstName),
            );
            await AsyncStorage.setItem(
              'userPhoneNumber',
              JSON.stringify(response?.data?.login?.data?.phoneNo),
            );
            await AsyncStorage.setItem(
              'userId',
              JSON.stringify(response?.data?.login?.data?.id),
            );
            await AsyncStorage.setItem(
              'profile',
              JSON.stringify(response?.data?.login?.data?.profileImage),
            );
            await AsyncStorage.setItem(
              'Userdatas',
              JSON.stringify(response?.data?.login?.data),
            );
            // Snackbar.show({
            //   text: response?.data?.login?.message,
            //   duration: Snackbar.LENGTH_LONG,
            // });
            showMessage({
              message: response?.data?.login?.message,
              type: 'success',
            });

            navigation.navigate('HomeScreen', {
              screen: 'Home',
            });
          } else {
            setLoading(false);

            showMessage({
              message: response?.errors[0]?.message,
              type: 'danger',
            });
          }
        })
        .catch(error => {
          setLoading(false);

          showMessage({
            message: 'Invalid username and password',
            type: 'danger',
          });
          console.log('LOGIN CATCH ERROR::', error);
        });
    } else {
      handleError();
      setLoading(false);
    }
  };

  return (
    <ScrollView style={{flex: 1, backgroundColor: 'white'}}>
      <StatusBar backgroundColor={'white'} barStyle={'dark-content'} />
      <View style={{backgroundColor: 'white', flex: 1}}>
        <View
          style={{
            alignSelf: 'center',
            // marginTop: 15,
            height: 120,
            width: '50%',
          }}>
          <Image
            source={require('../assets/foodking.png')}
            style={{height: '100%', width: '100%', resizeMode: 'contain'}}
          />
        </View>
        <Text style={Styles.welcome}>Welcome Back!</Text>
        <Text style={Styles.text}>Email</Text>
        <View>
          <TextInput
            keyboardType="email-address"
            onChangeText={item => {
              setEmail(item);
              setEmailError(!Boolean(item));
              validate(item);
            }}
            onFocus={() => setActiveEmail(true)}
            onBlur={() => setActiveEmail(false)}
            style={[
              Styles.input,
              {borderColor: isActiveEmail ? '#ff146c' : '#b0c4de'},
            ]}
            placeholder="Enter Email"
            placeholderTextColor={'#b0b9de'}
          />
        </View>
        <>
          {emailError ? (
            <Text
              style={{
                marginHorizontal: 30,
                color: 'red',
                fontWeight: '400',
                marginTop: 6,
                fontSize: 12,
              }}>
              Email id is required!
            </Text>
          ) : checkEmail ? (
            <Text
              style={{
                marginHorizontal: 30,
                color: 'red',
                fontWeight: '400',
                marginTop: 6,
                fontSize: 12,
              }}>
              Email id is invalid
            </Text>
          ) : (
            <></>
          )}
        </>

        <Text style={[Styles.text, {marginTop: 15}]}>Password</Text>
        <View>
          <TextInput
            onChangeText={item => {
              setPassword(item);
              setPasswordError(!Boolean(item));
              validatePassword(item);
            }}
            onFocus={() => setIsActivePassword(true)}
            onBlur={() => setIsActivePassword(false)}
            style={[
              Styles.input,
              {borderColor: isActivePassword ? '#ff146c' : '#b0c4de'},
            ]}
            placeholder="Enter Password"
            placeholderTextColor={'#b0b9de'}
            secureTextEntry={icon}
          />
          <TouchableOpacity
            style={{position: 'absolute', right: 45, bottom: 13}}
            onPress={() => {
              setIcon(!icon);
            }}>
            <Eyes name={icon ? 'eye' : 'eye-off'} size={25} color={'#b0b9de'} />
          </TouchableOpacity>
        </View>

        {passwordError ? (
          <Text
            style={{
              marginHorizontal: 30,
              color: 'red',
              fontWeight: '400',
              marginTop: 6,
              fontSize: 12,
            }}>
            Password is required!
          </Text>
        ) : checkPassword ? (
          <Text
            style={{
              marginHorizontal: 30,
              color: 'red',
              fontWeight: '400',
              marginTop: 6,
              fontSize: 12,
            }}>
            Password must be atleast 6 character
          </Text>
        ) : (
          <></>
        )}

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginHorizontal: 30,
            marginTop: 10,
          }}>
          <View>
            {/* <CheckBox
              style={{width: 150}}
              onClick={() => {
                setChecked(!checked);
              }}
              isChecked={checked}
              rightText={'Remember me'}
              rightTextStyle={true}
            /> */}
          </View>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('ForgetPasswordScreen');
            }}>
            <Text style={{color: '#ff1493', fontWeight: '600'}}>
              Forgot Password
            </Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          onPress={() => {
            handleLogin();
          }}
          style={{
            backgroundColor: '#ff146c',
            borderRadius: 25,
            marginHorizontal: 30,
            marginTop: 20,
            elevation: 2,
            paddingVertical: 14,
          }}>
          {!loading ? (
            <Text
              style={[
                {
                  color: 'white',
                  fontSize: 14,
                  marginTop: 0,
                  textAlign: 'center',
                  fontWeight: '700',
                },
              ]}>
              Login
            </Text>
          ) : (
            <ActivityIndicator size="small" color="white" />
          )}
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('MobileNumberScreen');
          }}>
          <Text style={{textAlign: 'center', marginTop: 25, color: '#b0b9de'}}>
            Don't have an account?{' '}
            <Text style={{color: '#ff146c', fontWeight: '700', fontSize: 15}}>
              Sign Up
            </Text>
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('HomeScreen', {
              screen: 'Home',
            });
          }}
          style={{
            borderColor: '#ff146c',
            backgroundColor: 'white',
            borderWidth: 1,
            borderRadius: 25,
            marginHorizontal: 30,
            marginVertical: 20,
          }}>
          <Text
            style={[
              {
                color: '#ff146c',
                fontSize: 14,
                marginTop: 0,
                paddingVertical: 14,
                textAlign: 'center',
                fontWeight: '700',
              },
            ]}>
            Skip to login
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default LoginScreen;

const Styles = StyleSheet.create({
  welcome: {
    color: '#000518',
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
    marginTop: 10,
  },
  text: {
    fontSize: 13,
    fontWeight: '600',
    color: '#000518',
    marginHorizontal: 30,
    marginTop: 25,
  },
  input: {
    borderWidth: 1,
    borderColor: '#b0c4de',
    borderRadius: 8,
    marginHorizontal: 30,
    marginTop: 5,
    paddingHorizontal: 10,
  },
});
