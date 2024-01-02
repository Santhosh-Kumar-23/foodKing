import React, {useState} from 'react';
import {
  View,
  Text,
  StatusBar,
  Image,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
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
import DeviceInfo from 'react-native-device-info';

const SignupScreen = ({navigation, route}) => {
  const [icon, setIcon] = useState(true);
  const [confirmPasswordIcon, setConfirmPasswordIcon] = useState(true);

  const deviceToken = DeviceInfo.getUniqueId();
  console.log('Device Token:', JSON.stringify(deviceToken?._j));

  const [loading, setLoading] = useState(false);

  const mN = route.params.mobileNumber;
  console.log(mN);

  const CREATE_USER = gql`
    mutation Mutation($input: createUser!) {
      createUser(input: $input) {
        data {
          confirmPassword
          email
          firstName
          id
          lastName
          password
        }
        message
      }
    }
  `;

  const [createUser] = useMutation(CREATE_USER);

  //focused variables
  const [isActiveEmail, setActiveEmail] = useState(false);
  const [isActivePhoneNumber, setIsActivePhoneNumber] = useState(false);
  const [isActivePassword, setIsActivePassword] = useState(false);
  const [isActiveConfirmPassword, setIsActiveConfirmPassword] = useState(false);
  const [isActiveFirst, setIsactiveFirst] = useState(false);
  const [isActiveLast, setIsActiveLast] = useState(false);

  //state variables
  const [email, setEmail] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState(null);
  const [password, setPassword] = useState(null);
  const [confirmPassword, setConfirmPassword] = useState(null);
  const [firstName, setFirstName] = useState(null);
  const [lastName, setLastName] = useState(null);

  //error variables
  const [emailError, setEmailError] = useState(false);
  const [phoneNumberError, setPhoneNumberError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [confirmPasswordError, setConfirmPasswordError] = useState(false);
  const [firstnameError, setFirstNameError] = useState(false);
  const [lastnameError, setLastnameError] = useState(false);

  //check error variabls
  const [checkEmail, setCheckEmail] = useState(null);
  const [checkPassword, setCheckPassword] = useState(null);
  const [checkConfirmPassword, setCheckConfirmPassword] = useState(null);

  const validate = text => {
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;
    setCheckEmail(!reg.test(text));
  };

  const validatePassword = text => {
    let reg = /[0-9a-zA-Z]{6,}/;
    setCheckPassword(!reg.test(text));
  };

  const validateConfirmPassword = text => {
    if (password == text) {
      setCheckConfirmPassword(!true);
    } else {
      setCheckConfirmPassword(!false);
    }
  };

  const handleError = () => {
    setEmailError(!Boolean(email));
    // setPhoneNumberError(!Boolean(phoneNumber))
    setFirstNameError(!Boolean(firstName));
    setLastnameError(!Boolean(lastName));
    setPasswordError(!Boolean(password));
    setConfirmPasswordError(!Boolean(confirmPassword));
    validate(email);
    validatePassword(password);
    validateConfirmPassword(confirmPassword);
  };

  const handleLogin = () => {
    setLoading(true);
    if (
      Boolean(firstName) &&
      Boolean(lastName) &&
      Boolean(email) &&
      // Boolean(phoneNumber)&&
      Boolean(password) &&
      Boolean(confirmPassword) &&
      !Boolean(checkEmail) &&
      !Boolean(checkPassword) &&
      !Boolean(checkConfirmPassword)
    ) {
      // Alert.alert('true');

      console.log({
        variables: {
          input: {
            confirmPassword: confirmPassword,
            email: email,
            firstName: firstName,
            password: password,
            lastName: lastName,
            phoneNo: mN,
            deviceToken:deviceToken?._j
          },
        },
      });

      createUser({
        variables: {
          input: {
            confirmPassword: confirmPassword,
            email: email,
            firstName: firstName,
            password: password,
            lastName: lastName,
            phoneNo: mN,
            deviceToken:deviceToken?._j
          },
        },
      })
        .then(response => {
          setLoading(false);
          console.log('HIIIIIIIIIIIIIIIIIII', JSON.stringify(response));
          if (response?.data?.createUser?.message == 'Register successfully') {
            Snackbar.show({
              text: response?.data?.createUser?.message,
              duration: Snackbar.LENGTH_LONG,
            });
            navigation.navigate('LoginScreen');
          } else {
            setLoading(false);
            Snackbar.show({
              text: 'Please Try again!',
              duration: Snackbar.LENGTH_LONG,
            });
          }
        })
        .catch(error => {
          setLoading(false);
          Snackbar.show({
            text: 'Please try again!',
            duration: Snackbar.LENGTH_LONG,
          });
          console.log('SIGN UP CATCH ERROR', error);
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
      <Text style={Styles.welcome}>Create Account</Text>
      <Text style={Styles.text}>First Name</Text>
      <View>
        <TextInput
          style={[
            Styles.input,
            {borderColor: isActiveFirst ? '#ff146c' : '#b0c4de'},
          ]}
          placeholder="Enter first name"
          placeholderTextColor={'#b0b9de'}
          onFocus={() => setIsactiveFirst(true)}
          onBlur={() => setIsactiveFirst(false)}
          onChangeText={item => {
            setFirstName(item);
            setFirstNameError(!Boolean(item));
          }}
        />
      </View>
      {firstnameError ? (
        <Text
          style={{
            marginHorizontal: 30,
            color: 'red',
            fontWeight: '400',
            marginTop: 6,
            fontSize: 12,
          }}>
          First name is required!
        </Text>
      ) : (
        <></>
      )}
      <Text style={Styles.text}>Last Name</Text>
      <View>
        <TextInput
          onFocus={() => setIsActiveLast(true)}
          onBlur={() => setIsActiveLast(false)}
          onChangeText={item => {
            setLastName(item);
            setLastnameError(!Boolean(item));
          }}
          style={[
            Styles.input,
            {borderColor: isActiveLast ? '#ff146c' : '#b0c4de'},
          ]}
          placeholder="Enter last name"
          placeholderTextColor={'#b0b9de'}
        />
      </View>
      {lastnameError ? (
        <Text
          style={{
            marginHorizontal: 30,
            color: 'red',
            fontWeight: '400',
            marginTop: 6,
            fontSize: 12,
          }}>
          Last name is required!
        </Text>
      ) : (
        <></>
      )}

      {/* <Text style={Styles.text}>Phone Number</Text>
      <View>
        <TextInput
        keyboardType="number-pad"
        maxLength={10}
          onFocus={() => setIsActivePhoneNumber(true)}
          onBlur={() => setIsActivePhoneNumber(false)}
          onChangeText={item => {
            setPhoneNumber(item);
            setPhoneNumberError(!Boolean(item));
          }}
          style={[
            Styles.input,
            {borderColor: isActivePhoneNumber ? '#ff146c' : '#b0c4de'},
          ]}
          placeholder="Enter phone number"
          placeholderTextColor={'#b0b9de'}
        />
      </View> */}

      {/* {phoneNumberError ? (
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
      ) : (
        <></>
      )} */}

      <Text style={Styles.text}>Email</Text>
      <View>
        <TextInput
          keyboardType="email-address"
          onFocus={() => setActiveEmail(true)}
          onBlur={() => setActiveEmail(false)}
          onChangeText={item => {
            setEmail(item);
            setEmailError(!Boolean(item));
            validate(item);
          }}
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
          handleLogin();
        }}
        style={{
          backgroundColor: '#ff146c',
          borderRadius: 25,
          marginHorizontal: 30,
          marginVertical: 25,
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
            Sign Up
          </Text>
        ) : (
          <ActivityIndicator size="small" color="white" />
        )}
      </TouchableOpacity>
    </ScrollView>
  );
};

export default SignupScreen;

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
