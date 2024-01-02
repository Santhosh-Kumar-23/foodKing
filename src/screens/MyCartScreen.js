import React, {createContext, useCallback, useState, useEffect} from 'react';
import {
  View,
  Text,
  StatusBar,
  Pressable,
  TouchableOpacity,
  Dimensions,
  Image,
  ScrollView,
  Alert,
} from 'react-native';
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  gql,
  useQuery,
  useMutation,
  useLazyQuery,
} from '@apollo/client';
import {useFocusEffect} from '@react-navigation/native';
import {
  GET_ADD_CART,
  UPDATE_ADD_CART,
  ADD_CART_DELETE,
  PROCEED_TO_CHECKOUT,
} from '../Schemas/Schemas';

import style from '../Styles/AddtoCartStyles';
import Minus from 'react-native-vector-icons/AntDesign';
import Delete from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DeviceInfo from 'react-native-device-info';

const MyCartScreen = ({navigation}) => {
  const [getUserId, setGetUserId] = useState(null);
  const [tkn, setTkn] = useState(null);
  const [chnage, setChnage] = useState(false);
  const [total, setTotal] = useState(null);

  const [updateCart] = useMutation(UPDATE_ADD_CART);
  const [deleteCart] = useMutation(ADD_CART_DELETE);

  AsyncStorage.getItem('userId').then(res => {
    setGetUserId(res);
  });

  AsyncStorage.getItem('userDetails').then(res => {
    setTkn(res);
  });

  const deviceToken = DeviceInfo.getUniqueId();
  // console.log('Device Token:', JSON.stringify(deviceToken?._j));

  const [proceedCheckout] = useMutation(PROCEED_TO_CHECKOUT, {
    context: {
      headers: {
        Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1MjY1YjgyNmViNjg4MTgzZmM3MzQ5ZiIsImVtYWlsIjoibWR1QGdtYWlsLmNvbSIsInJvbGUiOlsidXNlciJdLCJpYXQiOjE2OTcxMTM3NzcsImV4cCI6MTY5NzEyNDU3N30.lOLcUKHHaMynzWwrCeHhYXM2WGbQSlwwJAXpBKBI0_I`,
      },
    },
  });

  const {data, refetch} = useQuery(GET_ADD_CART, {
    variables: Boolean(tkn)
      ? {
          userId: JSON.parse(getUserId),
        }
      : {
          deviceToken: deviceToken._j,
        },
  });

  const TotalPrice = data?.getUserAddToCart?.map(val => {
    return val?.totalPrice;
  });

  const addTotalPrice = TotalPrice?.reduce(
    (total, current) => total + current,
    0,
  );

  useEffect(() => {
    setTotal(addTotalPrice);
    console.log('TOTALLLLLLLL', total);
  }, [data, total]);

  return (
    <View style={[style.container, {backgroundColor: 'gray'}]}>
      <StatusBar backgroundColor={'white'} barStyle={'dark-content'} />

      {data?.getUserAddToCart.length !== 0 ? (
        <View style={{backgroundColor: 'white', flex: 0.1}}>
          <View
            style={{
              flexDirection: 'row',
              marginHorizontal: 12,
              marginVertical: 20,
            }}>
            <View
              style={{
                flex: 0.5,
                backgroundColor: 'white',
                justifyContent: 'center',
              }}>
              <Text style={{fontWeight: '800', color: '#ff146c'}}>My Cart</Text>
            </View>

            <View
              style={{
                flex: 0.5,
                backgroundColor: 'white',
                flexDirection: 'row',
              }}>
              <Pressable
                onPress={() => {
                  setChnage(!chnage);
                }}
                style={style.sunContainer1}>
                <View
                  style={[
                    style.Button,
                    {
                      backgroundColor: chnage
                        ? 'rgb(0, 139, 186)'
                        : 'rgb(189 239 255)',
                    },
                  ]}>
                  <Text
                    style={{
                      color: chnage ? 'white' : 'rgb(0,139,186)',
                      fontWeight: '700',
                    }}>
                    Delivery
                  </Text>
                </View>
              </Pressable>
              <Pressable
                style={style.sunContainer2}
                onPress={() => {
                  setChnage(!chnage);
                }}>
                <View
                  style={[
                    style.Button,
                    {
                      backgroundColor: chnage
                        ? 'rgb(189 239 255)'
                        : 'rgb(0, 139, 186)',
                    },
                  ]}>
                  <Text
                    style={{
                      color: chnage ? 'rgb(0, 139, 186)' : 'white',
                      fontWeight: '700',
                    }}>
                    Takeaway
                  </Text>
                </View>
              </Pressable>
            </View>
          </View>
        </View>
      ) : (
        <>
          <View style={{flex: 0.3, backgroundColor: 'white'}}></View>
        </>
      )}

      <View style={{backgroundColor: 'white', flex: 0.7}}>
        {data?.getUserAddToCart?.length !== 0 ? (
          <ScrollView showsVerticalScrollIndicator={false}>
            {data?.getUserAddToCart?.map(item => {
              return (
                <>
                  <Pressable
                    style={{
                      backgroundColor: 'white',
                      borderColor: 'gray',
                      flexDirection: 'row',
                      height: 70,
                      overflow: 'hidden',
                      marginHorizontal: 20,
                      marginVertical: 10,
                      elevation: 1,
                      borderRadius: 10,
                    }}>
                    <View style={{flex: 0.2}}>
                      <View style={{height: 70, width: '100%'}}>
                        <Image
                          style={{
                            height: '100%',
                            width: '100%',
                            resizeMode: 'cover',
                            borderRadius: 10,
                          }}
                          source={{
                            uri: item.subCategory.image,
                          }}
                        />
                      </View>
                    </View>
                    <View style={{flex: 0.8, marginHorizontal: 5}}>
                      <View style={{flex: 0.6}}>
                        <Text style={{fontWeight: '700', color: '#000518'}}>
                          {item?.subCategory?.name}
                        </Text>
                        <Text style={{color: '#000518', fontSize: 12}}>
                          {item?.selectedVariation[0]?.name}
                        </Text>
                      </View>
                      <View
                        style={{
                          flex: 0.4,
                          flexDirection: 'row',
                          paddingVertical: 10,
                        }}>
                        <View style={{flex: 0.6}}>
                          <Text
                            style={{
                              fontSize: 13,
                              fontWeight: '600',
                              color: 'black',
                            }}>
                            ₹ {item?.totalPrice}
                          </Text>
                        </View>

                        <View
                          style={{
                            flex: 0.4,
                            justifyContent: 'space-evenly',
                            flexDirection: 'row',
                            alignItems: 'center',
                          }}>
                          {item?.quantity > 1 ? (
                            <Pressable
                              onPress={() => {
                                updateCart({
                                  variables: {
                                    operator: -1,
                                    updateCartItemId: item.id,
                                  },
                                })
                                  .then(response => {
                                    refetch();
                                  })
                                  .catch(error => {});
                              }}>
                              <Minus
                                name="minuscircleo"
                                size={17}
                                color={'#ff146c'}
                              />
                            </Pressable>
                          ) : (
                            <Pressable
                              onPress={() => {
                                deleteCart({
                                  variables: {
                                    addToCartDeleteId: item.id,
                                  },
                                })
                                  .then(response => {
                                    refetch();
                                  })
                                  .catch(error => {});
                              }}>
                              <Delete
                                name="delete"
                                size={19}
                                color={'#ff146c'}
                              />
                            </Pressable>
                          )}

                          <View>
                            <Text
                              style={{
                                color: 'black',
                                textAlign: 'center',
                              }}>
                              {item?.quantity}
                            </Text>
                          </View>
                          <Pressable
                            onPress={() => {
                              updateCart({
                                variables: {
                                  operator: 1,
                                  updateCartItemId: item.id,
                                },
                              })
                                .then(response => {
                                  refetch();
                                })
                                .catch(error => {});
                            }}>
                            <Minus
                              name="pluscircleo"
                              size={17}
                              color={'#ff146c'}
                            />
                          </Pressable>
                        </View>
                      </View>
                    </View>
                  </Pressable>

                  <View
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      marginHorizontal: 20,
                    }}>
                    {item.subCategoryExtra.length !== 0 ? (
                      <Text
                        style={{
                          fontWeight: '400',
                          color: 'black',
                          fontSize: 12,
                        }}>
                        Extras:{' '}
                      </Text>
                    ) : (
                      <></>
                    )}
                    {item.subCategoryExtra.map(itm => {
                      return (
                        <>
                          <Text style={{fontSize: 12}}>{itm.name}, </Text>
                        </>
                      );
                    })}
                  </View>
                  <View style={{borderBottomWidth:0.2,marginHorizontal:20,marginVertical:5}}></View>
                </>
              );
            })}
          </ScrollView>
        ) : (
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              // marginTop: 200,
            }}>
            <Text
              style={{
                textAlign: 'center',
                marginBottom: 20,
                fontWeight: '800',
                color: 'black',
                fontSize: 15,
              }}>
              My Cart
            </Text>
            <Image
              source={require('../assets/empty.gif')}
              style={{height: 200, width: 200, resizeMode: 'contain'}}></Image>
            <Text
              style={{
                textAlign: 'center',
                marginTop: 20,
                marginHorizontal: 20,
                color: 'black',
                fontWeight: '600',
                fontSize: 16,
              }}>
              Good food is always cooking! Go ahead, order some yummy items from
              the menu.
            </Text>
          </View>
        )}
      </View>

      {data?.getUserAddToCart?.length !== 0 ? (
        <View style={{flex: 0.2, backgroundColor: 'white'}}>
          <View>
            <TouchableOpacity
              style={{
                borderWidth: 0.5,
                borderRadius: 10,
                padding: 13,
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginHorizontal: 20,
                marginTop: 10,
              }}>
              <View>
                <Text style={{fontWeight: '700', color: '#000518'}}>
                  Subtotal
                </Text>
              </View>
              <View>
                <Text style={{color: '#32cd32', fontWeight: '700'}}>
                  ₹ {total}
                </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={async () => {
                const uId = await AsyncStorage.getItem('userId');
                const token = await AsyncStorage.getItem('userDetails');

                console.log('TOKNNNNN:::::::::::', token);

                if (Boolean(token)) {
                  proceedCheckout({
                    variables: {
                      userId: JSON.parse(uId),
                    },
                  })
                    .then(response => {
                      console.log(response);

                      navigation.navigate('CheckOut', {
                        details: response?.data?.proceedCheckout,
                      });
                    })
                    .catch(error => {
                      console.log('ERRORRRORORO::::', error);
                    });
                } else {
                  navigation.navigate('LoginScreen');
                }
              }}
              style={{
                backgroundColor: '#ff146c',
                borderRadius: 25,
                marginHorizontal: 20,
                marginTop: 10,
                elevation: 2,
                paddingVertical: 14,
              }}>
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
                Proceed To Checkout
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <></>
      )}
    </View>
  );
};
export default MyCartScreen;
