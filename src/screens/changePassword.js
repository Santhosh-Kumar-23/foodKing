import React, {useState, useCallback, useEffect} from 'react';
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
import {useFocusEffect} from '@react-navigation/native';
import {showMessage, hideMessage} from 'react-native-flash-message';
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  gql,
  useQuery,
  useMutation,
} from '@apollo/client';
import {CHNAGE_PASSWORD} from '../Schemas/Schemas';
import Snackbar from 'react-native-snackbar';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ChangePassword = ({navigation}) => {
  const [loading, setLoading] = useState(false);

  const [icon, setIcon] = useState(true);
  const [confirmPasswordIcon, setConfirmPasswordIcon] = useState(true);
  const [oldPasswordIcon, setOldPasswordIcon] = useState(true);

  //focused variables
  const [isActivePassword, setIsActivePassword] = useState(false);
  const [isActiveConfirmPassword, setIsActiveConfirmPassword] = useState(false);
  const [isActiveOldPassword, setIsActiveOldPassword] = useState(false);

  //state variables
  const [password, setPassword] = useState(null);
  const [confirmPassword, setConfirmPassword] = useState(null);
  const [oldPassword, setOldPassword] = useState(null);

  //error variables
  const [passwordError, setPasswordError] = useState(false);
  const [confirmPasswordError, setConfirmPasswordError] = useState(false);
  const [oldPasswordError, setOldPasswordError] = useState(false);

  //check error variabls
  const [checkPassword, setCheckPassword] = useState(null);
  const [checkConfirmPassword, setCheckConfirmPassword] = useState(null);

  const [changePass] = useMutation(CHNAGE_PASSWORD);

  const [editableData, setEditableData] = useState({
    id: '',
  });

  useFocusEffect(
    useCallback(() => {
      AsyncStorage.getItem('Userdatas').then(res => {
        const userData = JSON.parse(res);
        console.log(userData);
        setEditableData(prev => ({
          ...prev,
          id: userData?.id,
        }));
      });
    }, []),
  );

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
    setPasswordError(!Boolean(password));
    setConfirmPasswordError(!Boolean(confirmPassword));
    setOldPasswordError(!Boolean(oldPassword));
    validatePassword(password);
    validateConfirmPassword(confirmPassword);
  };

  const handleLogin = () => {
    setLoading(true);

    if (
      Boolean(oldPassword) &&
      Boolean(password) &&
      Boolean(confirmPassword) &&
      !Boolean(checkPassword) &&
      !Boolean(checkConfirmPassword)
    ) {
      console.log('AAAAAAAAAA', {
        variables: {
          input: {
            userId: editableData?.id,
            confirmPassword: confirmPassword,
            password: password,
            oldPassword: oldPassword,
          },
        },
      });

      changePass({
        variables: {
          input: {
            userId: editableData?.id,
            confirmPassword: confirmPassword,
            newPassword: password,
            oldPassword: oldPassword,
          },
        },
      })
        .then(response => {
          setLoading(false);
            console.log('HIIIIIIIIIIIIIIIIIII', response);
          if (
            response?.data?.changePassword?.message ==
            'Password Changed Successfully'
          ) {
            showMessage({
              message: 'Password Changed Successfully',
              type: 'success',
            });
            navigation.navigate('HomeScreen', {
              screen: 'Profile',
            });
          } else {
            setLoading(false);
            // Snackbar.show({
            //   text: 'Old Password Incorrect!',
            //   duration: Snackbar.LENGTH_LONG,
            // });
            showMessage({
                message: 'Old Password Incorrect!',
                type: 'danger',
              });
          }
        })
        .catch(error => {
          setLoading(false);
          Snackbar.show({
            text: 'Please try againnnnnnnnnnnnnnnnnn!',
            duration: Snackbar.LENGTH_LONG,
          });
          console.log('CATCH ERROR', error);
        });
    } else {
        setLoading(false);
      handleError();
    }
  };

  return (
    <View style={{flex: 1, backgroundColor: 'white'}}>
      <StatusBar backgroundColor={'white'} barStyle={'dark-content'} />
      <View style={{marginHorizontal: 20}}>
        <Text style={{color: 'black', fontWeight: '800', fontSize: 17}}>
          Change Password
        </Text>
      </View>

      <Text style={[Styles.text, {marginTop: 25}]}>Old Password</Text>
      <View>
        <TextInput
          onFocus={() => setIsActiveOldPassword(true)}
          onBlur={() => setIsActiveOldPassword(false)}
          onChangeText={item => {
            setOldPassword(item);
            setOldPasswordError(!Boolean(item));
          }}
          style={[
            Styles.input,
            {borderColor: isActiveOldPassword ? '#ff146c' : '#b0c4de'},
          ]}
          placeholder="Enter Old Password"
          placeholderTextColor={'#b0b9de'}
          secureTextEntry={oldPasswordIcon}
        />

        <TouchableOpacity
          style={{position: 'absolute', right: 45, bottom: 13}}
          onPress={() => {
            setOldPasswordIcon(!oldPasswordIcon);
          }}>
          <Eyes
            name={oldPasswordIcon ? 'eye' : 'eye-off'}
            size={25}
            color={'#b0b9de'}
          />
        </TouchableOpacity>
      </View>

      {oldPasswordError ? (
        <Text
          style={{
            marginHorizontal: 30,
            color: 'red',
            fontWeight: '400',
            marginTop: 6,
            fontSize: 12,
          }}>
          Old password is required!
        </Text>
      ) : (
        <></>
      )}

      <Text style={[Styles.text, {marginTop: 20}]}>New Password</Text>
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
          placeholder="Enter New Password"
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

      <Text style={[Styles.text, {marginTop: 20}]}>Retype New Password</Text>
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
          placeholder="Enter Retype New Password"
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
            Change Password
          </Text>
        ) : (
          <ActivityIndicator size="small" color="white" />
        )}
      </TouchableOpacity>
    </View>
  );
};

export default ChangePassword;

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
