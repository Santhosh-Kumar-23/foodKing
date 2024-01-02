import React, {useState} from 'react';
import {
  View,
  Text,
  StatusBar,
  Image,
  StyleSheet,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import Eyes from 'react-native-vector-icons/Ionicons';

import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  gql,
  useQuery,
  useMutation,
} from '@apollo/client';
import Snackbar from 'react-native-snackbar';

const ResetPasswordScreen = ({navigation, route}) => {
  const otp = route.params.otp;
  console.log('AAAAAAAAAAAAAAAAA', otp);

  //create a corresponding GraphQL mutation
  const RESET_PASSWORD = gql`
    mutation ResetPassword($otp: String!, $password: String!, $confirmPassword: String!) {
  resetPassword(otp: $otp, password: $password, confirmPassword: $confirmPassword) {
    message
    status
  }
}
  `;
  //Inside it, we'll pass our LOGIN_DETAILS mutation to the useMutation hook:
  const [resetPassword] = useMutation(RESET_PASSWORD);

  //focused variables
  const [isActiveVerication, setIsActiveVerification] = useState(false);
  const [isActivePassword, setIsActivePassword] = useState(false);
  const [isActiveConfirmPassword, setIsActiveConfirmPassword] = useState(false);
  //state variable
  const [verification, setVerification] = useState(otp);
  const [password, setPassword] = useState(null);
  const [confirmPassword, setConfirmPassword] = useState(null);
  //error variables
  const [verificationError, setVerificationError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [confirmPasswordError, setConfirmPasswordError] = useState(false);
  //check error variabls
  const [checkVerifation, setCheckVerification] = useState(null);
  const [checkPassword, setCheckPassword] = useState(null);
  const [checkConfirmPassword, setCheckConfirmPassword] = useState(null);

  //loading
  const [loading, setLoading] = useState(false);

  const validateConfirmPassword = text => {
    if (password == text) {
      setCheckConfirmPassword(!true);
    } else {
      setCheckConfirmPassword(!false);
    }
  };

  const validatePassword = text => {
    let reg = /[0-9a-zA-Z]{6,}/;
    setCheckPassword(!reg.test(text));
  };

  const handleError = () => {
    setVerificationError(!Boolean(verification));
    setPasswordError(!Boolean(password));
    setConfirmPasswordError(!Boolean(confirmPassword));
    validatePassword(password);
    validateConfirmPassword(confirmPassword);
  };

  const handleRest = () => {
    setLoading(true);
    console.log({
      variables: {
        otp: otp,
        password: password,
        confirmPassword: confirmPassword,
      },
    });
    if (
      Boolean(verification) &&
      Boolean(password) &&
      Boolean(confirmPassword) &&
      !Boolean(checkPassword) &&
      !Boolean(checkConfirmPassword)
    ) {
      resetPassword({
        variables: {
          otp:otp,
          password:password ,
          confirmPassword:confirmPassword,
        },
        // variables: {
        //     otp: JSON.stringify(otp) ,
        //     password: JSON.stringify(password) ,
        //     confirmPassword: JSON.stringify(confirmPassword),
        //   },
      })
        .then(response => {
          setLoading(false);
          console.log('RRRRRRRRRRRRRRRRR::', response);
          if (response?.data?.resetPassword?.status == true) {
            Snackbar.show({
              text: response?.data?.resetPassword?.message,
              duration: Snackbar.LENGTH_LONG,
            });
            navigation.navigate('LoginScreen');
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
          console.log('RESET PASSWORD CATCH ERROR:::::', error);
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

  const [icon, setIcon] = useState(true);
  const [confirmPasswordIcon, setConfirmPasswordIcon] = useState(true);
  return (
    <ScrollView style={{flex: 1, backgroundColor: 'white'}}>
      <StatusBar backgroundColor={'white'} barStyle={'dark-content'} />
      <View
        style={{
          alignSelf: 'center',
          //   marginTop: 15,
          height: 120,
          width: '50%',
        }}>
        <Image
          source={require('../assets/foodking.png')}
          style={{height: '100%', width: '100%', resizeMode: 'contain'}}
        />
      </View>
      <Text style={Styles.welcome}>Reset Password</Text>
      {/* <View
        style={{
          height: 200,
          width: '100%',
          alignItems: 'center',
          backgroundColor: 'white',
        }}>
        <Image
          source={require('../assets/re.jpg')}
          style={{height: '100%', width: '100%', resizeMode: 'contain'}}
        />
      </View> */}
      <Text style={Styles.text}>Verification Code</Text>
      <View>
        <TextInput
          value={otp}
          onFocus={() => setIsActiveVerification(true)}
          onBlur={() => setIsActiveVerification(false)}
          onChangeText={item => {
            setVerification(item);
            setVerificationError(!Boolean(item));
          }}
          style={[
            Styles.input,
            {borderColor: isActiveVerication ? '#ff146c' : '#b0c4de'},
          ]}
          placeholder="Enter verification code"
          placeholderTextColor={'#b0b9de'}
        />
      </View>
      {verificationError ? (
        <Text
          style={{
            marginHorizontal: 30,
            color: 'red',
            fontWeight: '400',
            marginTop: 6,
            fontSize: 12,
          }}>
          Verification code is required!
        </Text>
      ) : (
        <></>
      )}

      <Text style={[Styles.text, {marginTop: 25}]}>Password</Text>
      <View>
        <TextInput
          onFocus={() => setIsActivePassword(true)}
          onBlur={() => setIsActivePassword(false)}
          onChangeText={item => {
            setPassword(item);
            setPasswordError(!Boolean(item));
            validatePassword(item);
          }}
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
      <Text style={[Styles.text, {marginTop: 25}]}>Confirm Password</Text>
      <View>
        <TextInput
          onFocus={() => setIsActiveConfirmPassword(true)}
          onBlur={() => setIsActiveConfirmPassword(false)}
          onChangeText={item => {
            setConfirmPassword(item);
            setConfirmPasswordError(!Boolean(item));
            validateConfirmPassword(item);
          }}
          style={[
            Styles.input,
            {borderColor: isActiveConfirmPassword ? '#ff146c' : '#b0c4de'},
          ]}
          placeholder="Enter Confirm Password"
          placeholderTextColor={'#b0b9de'}
          secureTextEntry={confirmPasswordIcon}
        />

        <TouchableOpacity
          style={{position: 'absolute', right: 45, bottom: 13}}
          onPress={() => {
            setConfirmPasswordIcon(!confirmPasswordIcon);
          }}>
          <Eyes
            name={confirmPasswordIcon ? 'eye' : 'eye-off'}
            size={25}
            color={'#b0b9de'}
          />
        </TouchableOpacity>
      </View>
      {confirmPasswordError ? (
        <Text
          style={{
            marginHorizontal: 30,
            color: 'red',
            fontWeight: '400',
            marginTop: 6,
            fontSize: 12,
          }}>
          Confirm Password is required!
        </Text>
      ) : checkConfirmPassword ? (
        <Text
          style={{
            marginHorizontal: 30,
            color: 'red',
            fontWeight: '400',
            marginTop: 6,
            fontSize: 12,
          }}>
          Password Mismatch
        </Text>
      ) : (
        <></>
      )}

      <TouchableOpacity
        onPress={() => {
          handleRest();
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
            Submit
          </Text>
        ) : (
          <ActivityIndicator size="small" color="white" />
        )}
      </TouchableOpacity>
    </ScrollView>
  );
};

export default ResetPasswordScreen;

const Styles = StyleSheet.create({
  welcome: {
    color: '#000518',
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
    //   marginTop: 10,
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
