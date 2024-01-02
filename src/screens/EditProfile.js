import React, {useState, useCallback, useEffect} from 'react';
import {
  View,
  Text,
  StatusBar,
  Image,
  StyleSheet,
  ActivityIndicator,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import Snackbar from 'react-native-snackbar';
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  gql,
  useQuery,
  useMutation,
} from '@apollo/client';
import {UPDATE_USER} from '../Schemas/Schemas';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {showMessage, hideMessage} from 'react-native-flash-message';

const EditProfile = ({navigation}) => {
  //loading variables
  const [loading, setLoading] = useState(false);
  //focused variables
  const [isActiveEmail, setActiveEmail] = useState(false);
  const [isActivePhoneNumber, setIsActivePhoneNumber] = useState(false);
  const [isActiveFirst, setIsactiveFirst] = useState(false);
  const [isActiveLast, setIsActiveLast] = useState(false);

  //state variables
  const [email, setEmail] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState(null);
  const [firstName, setFirstName] = useState(null);
  const [lastName, setLastName] = useState(null);

  const [editableData, setEditableData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    id: '',
  });

  //error variables
  const [emailError, setEmailError] = useState(false);
  const [phoneNumberError, setPhoneNumberError] = useState(false);
  const [firstnameError, setFirstNameError] = useState(false);
  const [lastnameError, setLastnameError] = useState(false);

  //check error variabls
  const [checkEmail, setCheckEmail] = useState(null);

  useFocusEffect(
    useCallback(() => {
      AsyncStorage.getItem('Userdatas').then(res => {
        const userData = JSON.parse(res);
        console.log(userData);
        setEditableData(prev => ({
          ...prev,
          firstName: userData?.firstName,
          lastName: userData?.lastName,
          email: userData?.email,
          phoneNumber: userData?.phoneNo,
          id: userData?.id,
        }));
      });
    }, []),
  );

  const validate = text => {
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;
    setCheckEmail(!reg.test(text));
  };

  const handleError = () => {
    setEmailError(!Boolean(editableData?.email));
    setPhoneNumberError(!Boolean(editableData?.phoneNumber));
    setFirstNameError(!Boolean(editableData?.firstName));
    setLastnameError(!Boolean(editableData?.lastName));
    validate(email);
  };

  const [updateUser] = useMutation(UPDATE_USER);

  const handleLogin = () => {
    setLoading(true);
    if (
      Boolean(editableData?.firstName) &&
      Boolean(editableData?.lastName) &&
      Boolean(editableData?.email) &&
      Boolean(editableData?.phoneNumber) &&
      !Boolean(checkEmail)
    ) {
      updateUser({
        variables: {
          updateUserId: editableData.id,
          update: {
            email: editableData?.email,
            firstName: editableData?.firstName,
            lastName: editableData?.lastName,
            phoneNo: editableData?.phoneNumber,
          },
        },
      })
        .then(async(response) => {
          setLoading(false);
          console.log('HIIIIIIIIIIIIIIIIIII', JSON.stringify(response));

           await AsyncStorage.setItem('Userdatas',JSON.stringify(response?.data?.updateUser?.data))

          showMessage({
            message: 'Update successfully',
            type: 'success',
          });

          navigation.navigate('HomeScreen', {
            screen: 'Profile',
          });
        })
        .catch(error => {
          setLoading(false);
          //   Snackbar.show({
          //     text: 'Please try again!',
          //     duration: Snackbar.LENGTH_LONG,
          //   });
          console.log('SIGN UP CATCH ERROR', error);
        });
    } else {
      setLoading(false);
      handleError();
    }
  };

  return (
    <ScrollView style={{flex: 1, backgroundColor: 'white'}} showsVerticalScrollIndicator={false}>
      <StatusBar backgroundColor={'white'} barStyle={'dark-content'} />
      <View style={{marginHorizontal: 20}}>
        <Text style={{color: 'black', fontWeight: '800', fontSize: 17}}>
          Edit Profile
        </Text>
      </View>
      <Text style={Styles.text}>First Name</Text>
      <View>
        <TextInput
          value={editableData.firstName}
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
            setEditableData(prev => ({...prev, firstName: item}));
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
          value={editableData.lastName}
          onFocus={() => setIsActiveLast(true)}
          onBlur={() => setIsActiveLast(false)}
          onChangeText={item => {
            setLastName(item);
            setLastnameError(!Boolean(item));
            setEditableData(prev => ({...prev, lastName: item}));
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

      <Text style={Styles.text}>Phone Number</Text>
      <View>
        <TextInput
          value={editableData.phoneNumber}
          keyboardType="number-pad"
          maxLength={10}
          onFocus={() => setIsActivePhoneNumber(true)}
          onBlur={() => setIsActivePhoneNumber(false)}
          onChangeText={item => {
            setPhoneNumber(item);
            setPhoneNumberError(!Boolean(item));
            setEditableData(prev => ({...prev, phoneNumber: item}));
          }}
          style={[
            Styles.input,
            {borderColor: isActivePhoneNumber ? '#ff146c' : '#b0c4de'},
          ]}
          placeholder="Enter phone number"
          placeholderTextColor={'#b0b9de'}
        />
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
      ) : (
        <></>
      )}

      <Text style={Styles.text}>Email</Text>
      <View>
        <TextInput
          value={editableData.email}
          keyboardType="email-address"
          onFocus={() => setActiveEmail(true)}
          onBlur={() => setActiveEmail(false)}
          onChangeText={item => {
            setEmail(item);
            setEmailError(!Boolean(item));
            validate(item);
            setEditableData(prev => ({...prev, email: item}));
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
            Update Profile
          </Text>
        ) : (
          <ActivityIndicator size="small" color="white" />
        )}
      </TouchableOpacity>
    </ScrollView>
  );
};

export default EditProfile;

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
