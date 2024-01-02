import React, {useEffect, useState, useCallback} from 'react';
import {
  View,
  Text,
  StatusBar,
  StyleSheet,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import Language from 'react-native-vector-icons/MaterialIcons';
import {useFocusEffect} from '@react-navigation/native';
import Menu from 'react-native-vector-icons/FontAwesome5';
import Log from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from '../Styles/ProfileScreenStyles';
import Edit from 'react-native-vector-icons/Feather';
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  gql,
  useQuery,
  useMutation,
} from '@apollo/client';
import Snackbar from 'react-native-snackbar';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import {showMessage, hideMessage} from 'react-native-flash-message';

const ProfileScreen = ({navigation}) => {
  const [editableData, setEditableData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    id: '',
  });

  useFocusEffect(
    useCallback(() => {
      AsyncStorage.getItem('Userdatas').then(res => {
        const userData = JSON.parse(res);
        console.log('SANTHOSHSHSHSHSH', userData);
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

  const [token, setToken] = useState(null);
  const [information, setInformation] = useState(null);
  const [name, setName] = useState(null);
  const [mobNumber, setMobNumber] = useState(null);
  const [id, setId] = useState(null);
  const [avatar, setAvatar] = useState(null);

  const [retriveImage, setRetriveImage] = useState(null);

  //loading
  const [loading, setLoading] = useState(false);

  const [userInfo, setUserInfo] = useState(null);

  //create a corresponding GraphQL mutation
  const DELETE_ACCOUNT = gql`
    mutation Mutation($deleteUserId: String!) {
      deleteUser(id: $deleteUserId) {
        status
        message
      }
    }
  `;

  const UPDATE_IMAGE = gql`
    mutation Mutation($updateUserId: String!, $update: userUpdate) {
      updateUser(id: $updateUserId, update: $update) {
        status
        data {
          profileImage
        }
      }
    }
  `;

  //Inside it, we'll pass our LOGIN_DETAILS mutation to the useMutation hook:
  const [updateImage] = useMutation(UPDATE_IMAGE);

  //Inside it, we'll pass our LOGIN_DETAILS mutation to the useMutation hook:
  const [accountDelete] = useMutation(DELETE_ACCOUNT);

  const get = AsyncStorage.getItem('userDetails').then(res => {
    // console.log('AAAAAAAAAAAAAAAAAA', res);
    setToken(res);
  });

  AsyncStorage.getItem('userInfo').then(res => {
    setInformation(res);
  });

  AsyncStorage.getItem('userName').then(res => {
    setName(res);
  });

  AsyncStorage.getItem('userPhoneNumber').then(res => {
    setMobNumber(res);
  });
  AsyncStorage.getItem('userId').then(res => {
    const parse = JSON.parse(res);
    setId(parse);
  });
  // AsyncStorage.getItem('profile').then(res => {
  //   const parse = JSON.parse(res);
  //   setAvatar(parse);
  // });

  const selectLibrary = () => {
    const options = {
      maxWidth: 1000,
      maxHeight: 2000,
      includeBase64: true,
    };

    launchImageLibrary(options, response => {
      if (response.didCancel) {
        Snackbar.show({
          text: 'User cancelled image picker',
          duration: Snackbar.LENGTH_LONG,
        });
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else {
        const source = response.assets[0].base64;
        const imageFormet = response.assets[0].type;
        // console.log(imageFormet);
        const base = `data:${imageFormet};base64,`;
        const result = base.concat(source);

        console.log({
          variables: {
            updateUserId: id,
            update: {
              profileImage: result,
            },
          },
        });

        updateImage({
          variables: {
            updateUserId: id,
            update: {
              profileImage: result,
              lastName:"hello"
            },
          },
        })
          .then(async response => {
            console.log('response', response);
            if (response?.data?.updateUser?.status == true) {
              setRetriveImage(response?.data?.updateUser?.data?.profileImage);
              showMessage({
                message: "Image Upload successfully",
                type: 'success',
              });
              // Snackbar.show({
              //   text: 'Image Upload successfully',
              //   duration: Snackbar.LENGTH_LONG,
              // });
            } else {
              Snackbar.show({
                text: response?.errors[0]?.message,
                duration: Snackbar.LENGTH_LONG,
              });
            }
          })
          .catch(error => {
            console.log('UPDATE IMAGE CATCH ERROR:::::::::', error);
            Snackbar.show({
              text: 'Please try again!',
              duration: Snackbar.LENGTH_LONG,
            });
          });
        // console.log('URIIIII:::::', source);
      }
    });
  };

  return (
    <View style={{flex: 1}}>
      <StatusBar backgroundColor={'white'} barStyle={'dark-content'} />
      <View style={{flex: 0.9, backgroundColor: 'white'}}>
        <Text style={Styles.text}>My Profile</Text>
        <View style={{alignItems: 'center'}}>
          {Boolean(!token) ? (
            <Image source={require('../assets/ava.jpg')} style={Styles.image} />
          ) : (
            <TouchableOpacity
              onPress={() => {
                selectLibrary();
              }}>
              {Boolean(!retriveImage) ? (
                <View
                  style={{
                    borderWidth: 1.5,
                    borderColor: '#ff146c',
                    borderStyle: 'dashed',
                    borderRadius: 150,
                    padding: 2,
                    marginTop: 20,
                  }}>
                  <Image
                    source={require('../assets/profile.png')}
                    style={[Styles.image]}
                  />
                </View>
              ) : (
                <Image source={{uri: retriveImage}} style={Styles.image} />
              )}
            </TouchableOpacity>
          )}
        </View>

        {Boolean(!token) ? (
          <Text style={[Styles.text, {fontSize: 14, fontWeight: '700'}]}>
            Login to see your info
          </Text>
        ) : (
          <View>
            <Text style={[Styles.text, {fontSize: 14, fontWeight: '700'}]}>
              {editableData.firstName}
            </Text>
            <Text style={[Styles.text, {fontSize: 14, fontWeight: '700'}]}>
              {editableData.email}
            </Text>
            <Text style={[Styles.text, {fontSize: 14, fontWeight: '700'}]}>
              {editableData.phoneNumber}
            </Text>
          </View>
        )}
        {Boolean(!token) ? (
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('LoginScreen');
            }}
            style={styles.loginButton}>
            <Text style={[Styles.text, styles.loginButtonText]}>Login</Text>
          </TouchableOpacity>
        ) : (
          <></>
        )}
        {/* <View
          style={{flexDirection: 'row', marginTop: 20, marginHorizontal: 15}}>
          <View
            style={{flex: 0.1, backgroundColor: 'white', alignItems: 'center'}}>
            <Language name="language" size={18} color={'#b0c4de'} />
          </View>
          <View style={{flex: 0.9, backgroundColor: 'white'}}>
            <Text style={{color: '#000518', fontWeight: '700'}}>
              Change Language
            </Text>
          </View>
        </View>
        <View style={styles.menuText}></View> */}

        {/* <View
          style={{flexDirection: 'row', marginTop: 10, marginHorizontal: 15}}>
          <View
            style={{flex: 0.1, backgroundColor: 'white', alignItems: 'center'}}>
            <Menu name="file-alt" size={18} color={'#b0c4de'} />
          </View>
          <View style={{flex: 0.9, backgroundColor: 'white'}}>
            <Text style={{color: '#000518', fontWeight: '700'}}>
              Contact Us
            </Text>
          </View>
        </View>
        <View style={styles.menuText}></View> */}

        {Boolean(token) ? (
          <>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('EditProfile');
              }}
              style={{
                flexDirection: 'row',
                marginTop: 10,
                marginHorizontal: 15,
              }}>
              <View
                style={{
                  flex: 0.1,
                  backgroundColor: 'white',
                  alignItems: 'center',
                }}>
                <Edit name="edit" size={18} color={'#b0c4de'} />
              </View>
              <View style={{flex: 0.9, backgroundColor: 'white'}}>
                <Text style={{color: '#000518', fontWeight: '700'}}>
                  Edit Profile
                </Text>
              </View>
            </TouchableOpacity>

            <View style={styles.menuText}></View>
          </>
        ) : (
          <></>
        )}

        {Boolean(token) ? (
          <>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('ChangePassword');
              }}
              style={{
                flexDirection: 'row',
                marginTop: 10,
                marginHorizontal: 15,
              }}>
              <View
                style={{
                  flex: 0.1,
                  backgroundColor: 'white',
                  alignItems: 'center',
                }}>
                <Menu name="key" size={18} color={'#b0c4de'} />
              </View>
              <View style={{flex: 0.9, backgroundColor: 'white'}}>
                <Text style={{color: '#000518', fontWeight: '700'}}>
                  Change Password
                </Text>
              </View>
            </TouchableOpacity>

            <View style={styles.menuText}></View>
          </>
        ) : (
          <></>
        )}

        {/* <View
          style={{flexDirection: 'row', marginTop: 10, marginHorizontal: 15}}>
          <View
            style={{flex: 0.1, backgroundColor: 'white', alignItems: 'center'}}>
            <Menu name="file-alt" size={18} color={'#b0c4de'} />
          </View>
          <View style={{flex: 0.9, backgroundColor: 'white'}}>
            <Text style={{color: '#000518', fontWeight: '700'}}>About Us</Text>
          </View>
        </View>
        <View style={styles.menuText}></View>

        <View
          style={{flexDirection: 'row', marginTop: 10, marginHorizontal: 15}}>
          <View
            style={{flex: 0.1, backgroundColor: 'white', alignItems: 'center'}}>
            <Menu name="file-alt" size={18} color={'#b0c4de'} />
          </View>
          <View style={{flex: 0.9, backgroundColor: 'white'}}>
            <Text style={{color: '#000518', fontWeight: '700'}}>
              Cookies Policy
            </Text>
          </View>
        </View>
        <View style={styles.menuText}></View> */}
        {Boolean(token) ? (
          <TouchableOpacity
            onPress={async () => {
              AsyncStorage.removeItem('userDetails');

              showMessage({
                message: 'Logout successfully',
                type: 'success',
              });
              navigation.navigate('LoginScreen');
            }}
            style={{flexDirection: 'row', marginTop: 10, marginHorizontal: 15}}>
            <View
              style={{
                flex: 0.1,
                backgroundColor: 'white',
                alignItems: 'center',
              }}>
              <Log name="logout" size={18} color={'#b0c4de'} />
            </View>
            <View style={{flex: 0.9, backgroundColor: 'white'}}>
              <Text style={{color: '#000518', fontWeight: '700'}}>Log Out</Text>
            </View>
          </TouchableOpacity>
        ) : (
          <></>
        )}
        <View style={styles.menuText}></View>
        {Boolean(token) ? (
          <TouchableOpacity
            onPress={() => {
              console.log({
                variables: {
                  deleteUserId: id,
                },
              });
              setLoading(true);
              AsyncStorage.removeItem('userDetails');
              accountDelete({
                variables: {
                  deleteUserId: id,
                },
              })
                .then(response => {
                  setLoading(false);
                  console.log('RES:::::::::', response);
                  if (response?.data?.deleteUser?.status == true) {
                    showMessage({
                      message: response?.data?.deleteUser?.message,
                      type: 'success',
                    });
                    // navigation.navigate('LoginScreen');
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
                  console.log('DELETE USE CATCH ERROR:::::', error);
                  Snackbar.show({
                    text: 'Please try again!',
                    duration: Snackbar.LENGTH_LONG,
                  });
                });
            }}
            style={styles.loginButton}>
            {!loading ? (
              <Text style={[Styles.text, styles.loginButtonText]}>
                Delete Account
              </Text>
            ) : (
              <ActivityIndicator size="small" color="white" />
            )}
          </TouchableOpacity>
        ) : (
          <></>
        )}
      </View>
      <View style={{flex: 0.1, backgroundColor: 'white'}}></View>
    </View>
  );
};

export default ProfileScreen;

const Styles = StyleSheet.create({
  text: {
    fontSize: 17,
    fontWeight: '700',
    textAlign: 'center',
    marginTop: 10,
    color: '#000518',
  },
  image: {
    height: 100,
    width: 100,
    borderRadius: 170,
    // marginTop: 25,
    // borderWidth:1,
  },
});
