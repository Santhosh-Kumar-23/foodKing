import React, {useRef, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Button,
  Image,
  StatusBar,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import OTPTextInput from 'react-native-otp-textinput';
import Snackbar from 'react-native-snackbar';
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  gql,
  useQuery,
  useMutation,
} from '@apollo/client';

const OtpScreen = ({navigation, route}) => {
  let otpInput = useRef(null);
  const [userTypedOtp, setUserTypedOtp] = useState(null);
  const [otpError, setOtpError] = useState(false);

  //loading
  const [loading, setLoading] = useState(false);

  //create a corresponding GraphQL mutation
  const VALIDATE_OTP = gql`
    mutation OtpValidate($otp: String, $phoneNo: String) {
      otpValidate(otp: $otp, phoneNo: $phoneNo) {
        message
      }
    }
  `;

  //Inside it, we'll pass our LOGIN_DETAILS mutation to the useMutation hook:
  const [otpValidate] = useMutation(VALIDATE_OTP);

  const otpp = route.params.otp;
  const number = route.params.number;

  // const handleOtpValidate=()=>{
  //   if(otp==userTypedOtp){
  //     Snackbar.show({
  //       text: 'Otp verification successfully',
  //       duration: Snackbar.LENGTH_LONG,
  //     });
  //      navigation.navigate('SignupScreen');
  //   }
  //   else{
  //     Snackbar.show({
  //       text: 'Otp not matched',
  //       duration: Snackbar.LENGTH_LONG,
  //     });
  //   }
  // }

  // const handleError = () => {
  //   setOtpError(!Boolean(userTypedOtp));
  // };

  const handleOtpValidate = () => {
    console.log(JSON.stringify(number));
    console.log(JSON.stringify(userTypedOtp));
    console.log(otpp == userTypedOtp);
    if (otpp == userTypedOtp) {
      // Alert.alert('true');
      otpValidate({
        variables: {
          phoneNo: number,
          otp:otpp,
        },
      })
        .then(response => {
          console.log(
            'RESPONSE:::::::::::',
            response?.data?.otpValidate?.message,
          );
          if (
            response?.data?.otpValidate?.message == 'Otp verified successfully'
          ) {
            Snackbar.show({
              text: 'Otp verified successfully',
              duration: Snackbar.LENGTH_LONG,
            });
            navigation.navigate('SignupScreen', {
              mobileNumber: number,
            });
          } else {
            Snackbar.show({
              text: 'Please try again!',
              duration: Snackbar.LENGTH_LONG,
            });
          }
        })
        .catch(error => {
          console.log('OTP VALIDATE CATCH ERROR::::::', error);
        });
    } else {
      Snackbar.show({
        text: 'Invalid Otp Please try again',
        duration: Snackbar.LENGTH_LONG,
      });
    }
  };

  return (
    <ScrollView style={{backgroundColor: 'white', flex: 1}}>
      <StatusBar backgroundColor={'white'} barStyle={'dark-content'} />
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <View
          style={{
            alignSelf: 'center',
            // marginTop: 15,
            height: 100,
            width: '50%',
          }}>
          <Image
            source={require('../assets/foodking.png')}
            style={{height: '100%', width: '100%', resizeMode: 'contain'}}
          />
        </View>
        <Text
          style={{
            color: 'black',
            fontSize: 20,
            fontWeight: '800',
            marginBottom: 20,
          }}>
          Enter <Text style={{color: '#ff146c'}}>OTP</Text>
        </Text>
        <View style={{height: 300, width: '70%'}}>
          <Image
            source={require('../assets/a.jpg')}
            style={{height: '100%', width: '100%', resizeMode: 'contain'}}
          />
        </View>

        <Text style={{fontWeight: '800', marginTop: 10}}>
          We sent OTP code to verify your number
        </Text>
        <OTPTextInput
          // defaultValue={s}
          textInputStyle={{width: 30}}
          inputCount={6}
          inputCellLength={1}
          offTintColor={'gray'}
          tintColor={'#ff146c'}
          ref={e => (otpInput = e)}
          handleTextChange={itme => {
            setUserTypedOtp(itme);
            // setOtpError(!Boolean(itme));
            console.log(itme);
          }}></OTPTextInput>
        <Text style={{marginTop: 10, color: 'black', fontWeight: '800'}}>
          {otpp}
        </Text>

        {/* {otpError ? (
          <Text style={{marginTop: 10, color: 'red'}}>
            Please enter valid otp
          </Text>
        ) : (
          <></>
        )} */}
        <TouchableOpacity
          style={{
            backgroundColor: '#ff146c',
            padding: 10,
            borderRadius: 10,
            paddingHorizontal: 40,
            marginVertical: 20,
          }}
          onPress={() => {
            handleOtpValidate();
          }}>
          <Text style={{color: 'white', fontWeight: '700'}}>Submit</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default OtpScreen;
