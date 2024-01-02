import React, {useState} from 'react';
import {
  View,
  Text,
  StatusBar,
  Image,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  ScrollView,
} from 'react-native';

import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  gql,
  useQuery,
  useMutation,
} from '@apollo/client';
import Snackbar from 'react-native-snackbar';

const ForgetPasswordScreen = ({navigation}) => {
  //focused variables
  const [isActiveEmail, setIsActiveEmail] = useState(false);
  //state variable
  const [email, setEmail] = useState(null);
  //error variables
  const [emailError, setEmailError] = useState(false);
  //check error variabls
  const [checkEmail, setCheckEmail] = useState(null);

  //loading
  const [loading, setLoading] = useState(false);

  //create a corresponding GraphQL mutation
  const FORGOT_PASSWORD = gql`
    mutation Mutation($email: String!) {
      forgetPassword(email: $email) {
        message
        otp
        status
      }
    }
  `;
  //Inside it, we'll pass our LOGIN_DETAILS mutation to the useMutation hook:
  const [forgetPassword] = useMutation(FORGOT_PASSWORD);

  const handleError = () => {
    setEmailError(!Boolean(email));
    setIsActiveEmail(true);
    validate(email);
  };
  const validate = text => {
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;
    setCheckEmail(!reg.test(text));
  };

  const handleEmail = () => {
    setLoading(true);
    if (Boolean(email) && !Boolean(checkEmail)) {
      forgetPassword({
        variables: {
          email: email,
        },
      })
        .then(response => {
          setLoading(false);
          console.log('RESPONSE:::::::::', response);
          if (response?.data?.forgetPassword?.status == true) {
            Snackbar.show({
              text: response?.data?.forgetPassword?.message,
              duration: Snackbar.LENGTH_LONG,
            });
            navigation.navigate('ResetPasswordScreen', {
              otp: response?.data?.forgetPassword?.otp,
            });
          } else {
            setLoading(false);
            Snackbar.show({
              text: 'Please try again!',
              duration: Snackbar.LENGTH_LONG,
            });
          }
        })
        .catch(error => {
          setLoading(false);
          console.log('FORGOT PASSOWRD CATCH ERRROR::::::', error);
          Snackbar.show({
            text: 'Please try again!',
            duration: Snackbar.LENGTH_LONG,
          });
        });
    } else {
      setLoading(false);
      handleError();
    }
  };

  return (
    <ScrollView style={{flex: 1, backgroundColor: 'white'}}>
      <StatusBar backgroundColor={'white'} barStyle={'dark-content'} />
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
      <Text style={Styles.welcome}>Forgot Password</Text>
      <View
        style={{
          height: 300,
          width: '100%',
          alignItems: 'center',
          backgroundColor: 'white',
        }}>
        <Image
          source={require('../assets/for.jpg')}
          style={{height: '100%', width: '100%', resizeMode: 'contain'}}
        />
      </View>
      <Text style={Styles.text}>Email</Text>
      <View>
        <TextInput
          keyboardType="email-address"
          //
          onFocus={() => setIsActiveEmail(true)}
          onBlur={() => setIsActiveEmail(false)}
          onChangeText={item => {
            setEmail(item);
            setEmailError(!Boolean(item));
            validate(item);
          }}
          style={[
            Styles.input,
            {borderColor: isActiveEmail ? '#ff146c' : '#b0c4de'},
          ]}
          placeholder="Enter email"
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

      <TouchableOpacity
        onPress={() => {
          handleEmail();
        }}
        style={{
          backgroundColor: '#ff146c',
          borderRadius: 25,
          marginHorizontal: 30,
          marginVertical: 20,
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
            Continue
          </Text>
        ) : (
          <ActivityIndicator size="small" color="white" />
        )}
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          navigation.navigate('LoginScreen');
        }}>
        <Text style={{textAlign: 'center', marginTop: 0, color: '#b0b9de'}}>
          Already have an account?{'   '}
          <Text style={{color: '#ff146c', fontWeight: '700'}}>Login</Text>
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default ForgetPasswordScreen;

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
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#b0c4de',
    borderRadius: 8,
    marginHorizontal: 30,
    marginTop: 5,
    paddingHorizontal: 12,
  },
});
