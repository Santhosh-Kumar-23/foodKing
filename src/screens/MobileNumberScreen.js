import React, {useState} from 'react';
import {
  View,
  Text,
  StatusBar,
  Image,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
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

const MobileNumberScreen = ({navigation}) => {
  //focused variables
  const [isActivePhoneNumber, setIsActivePhoneNumber] = useState(false);
  //state variable
  const [phoneNumber, setPhoneNumber] = useState(null);
  //error variables
  const [phoneNumberError, setPhoneNumberError] = useState(false);
  //check error variabls
  const [checkPhoneNumber, setCheckPhoneNumber] = useState(null);

  //loading
  const [loading, setLoading] = useState(false);

  //create a corresponding GraphQL mutation
  const GENERATE_OTP = gql`
    mutation OtpGenerate($phoneNo: String!) {
      otpGenerate(phoneNo: $phoneNo) {
        message
        otp
      }
    }
  `;

  //Inside it, we'll pass our LOGIN_DETAILS mutation to the useMutation hook:
  const [OtpGenerate] = useMutation(GENERATE_OTP);

  const handleError = () => {
    setPhoneNumberError(!Boolean(phoneNumber));
    setIsActivePhoneNumber(true);
    validatePhoneNumber(phoneNumber);
  };

  const handleOtpGenerate = () => {
    setLoading(true);
    if (Boolean(phoneNumber) && !Boolean(checkPhoneNumber)) {
      OtpGenerate({
        variables: {
          phoneNo:phoneNumber,
        },
      })
        .then(response => {
          setLoading(false);
          console.log('RESPONSE::::::', response);
          if (response?.data?.otpGenerate?.message == 'Otp send successfully') {
            Snackbar.show({
              text: 'Otp sent successfully',
              duration: Snackbar.LENGTH_LONG,
            });
            navigation.navigate('OtpScreen', {
              otp: response?.data?.otpGenerate?.otp,
              number: phoneNumber,
            });
          } else {
            setLoading(false);
            Snackbar.show({
              text: response?.errors[0]?.message,
              duration: Snackbar.LENGTH_LONG,
            });
          }
        })
        .catch(error => {
          setLoading(false);
          console.log('GENERATE OTP CATCH ERROR::::', error);
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

  const validatePhoneNumber = text => {
    let reg = /^\d{10}$/;
    setCheckPhoneNumber(!reg.test(text));
  };

  return (
    <View style={{flex: 1, backgroundColor: 'white'}}>
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
      <Text style={Styles.welcome}>Let's get started</Text>
      <Text style={Styles.text}>Mobile Number</Text>
      <View>
        <TextInput
          keyboardType="number-pad"
          maxLength={10}
          onFocus={() => setIsActivePhoneNumber(true)}
          onBlur={() => setIsActivePhoneNumber(false)}
          onChangeText={item => {
            setPhoneNumber(item);
            setPhoneNumberError(!Boolean(item));
            validatePhoneNumber(item);
          }}
          style={[
            Styles.input,
            {borderColor: isActivePhoneNumber ? '#ff146c' : '#b0c4de'},
          ]}
          placeholder="Enter phone number"
          placeholderTextColor={'#b0b9de'}
        />
        <View style={{position: 'absolute', top: 14, left: 38}}>
          <View>
            <Image
              source={require('../assets/flag.png')}
              style={{height: 30, width: 35}}
            />
          </View>
        </View>
      </View>

      {phoneNumberError ? (
        <Text
          style={{
            marginHorizontal: 30,
            color: 'red',
            fontWeight: '400',
            marginTop: 6,
            fontSize: 12,
          }}>
          Phone number is required!
        </Text>
      ) : checkPhoneNumber ? (
        <Text
          style={{
            marginHorizontal: 30,
            color: 'red',
            fontWeight: '400',
            marginTop: 6,
            fontSize: 12,
          }}>
          Phone number must be contain 10 digits
        </Text>
      ) : (
        <></>
      )}

      <TouchableOpacity
        onPress={() => {
          handleOtpGenerate();
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
          Don't have an account?{'   '}
          <Text style={{color: '#ff146c', fontWeight: '700'}}>Login</Text>
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default MobileNumberScreen;

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
    paddingHorizontal: 52,
  },
});
