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
} from '../Schemas/Schemas';

import style from '../Styles/AddtoCartStyles';
import Minus from 'react-native-vector-icons/AntDesign';
import Delete from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const MyCartScreen = () => {
  const [chnage, setChnage] = useState(false);
  const [cart, setCart] = useState([]);

  // useEffect(() => {
  //   Alert.alert('CALLED ME');
  // }, []);

  // useFocusEffect(useCallback(()=>{
  //   Alert.alert("CALLED MEEEEEEE")
  // }))

  const [updateCartItems, setUpdateCartItems] = useState([]);

  const [getcart] = useLazyQuery(GET_ADD_CART);

  const [updateCart] = useMutation(UPDATE_ADD_CART);

  const [deleteCart] = useMutation(ADD_CART_DELETE);

  useFocusEffect(
    useCallback(async () => {
      const userId = await AsyncStorage.getItem('userId');

      console.log('USER ID::: ', userId);

      getcart({
        variables: {
          userId: JSON.parse(userId),
        },
      })
        .then(response => {
          setCart(response?.data?.getUserAddToCart ?? []);
          console.log(
            'CARTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT',
            cart,
          );
        })
        .catch(error => {
          console.log(error);
        });
    }, []),
  );

  const handleUpdateCartItems = (id, qty) => {
    const helperArray = [...updateCartItems];

    const index = helperArray.findIndex(lol => lol?.id == id);

    if (index > -1) {
      helperArray[index].qty = qty;
    } else {
      const helperObject = {id, qty, isDeleted: false};

      helperArray.push(helperObject);
    }

    setUpdateCartItems(helperArray);
  };

  const handleDeleteCartItems = (id, qty) => {
    const helperArray = [...updateCartItems];

    const index = helperArray.findIndex(lol => lol?.id == id);

    if (index > -1) {
      helperArray[index].isDeleted = true;
    } else {
      const helperObject = {id, qty, isDeleted: true};

      helperArray.push(helperObject);
    }

    setUpdateCartItems(helperArray);
  };

  return (
    <View style={[style.container, {backgroundColor: 'gray'}]}>
      <StatusBar backgroundColor={'white'} barStyle={'dark-content'} />

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
            style={{flex: 0.5, backgroundColor: 'white', flexDirection: 'row'}}>
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
      <View style={{backgroundColor: 'white', flex: 0.7}}>
        {cart?.length !== 0 ? (
          <ScrollView showsVerticalScrollIndicator={false}>
            {cart?.map(item => {
              console.log("ITEM",item);
              const upadteCartItemIndex = updateCartItems.findIndex(
                lol => lol?.id == item?.id,
              );

              const qty =
                upadteCartItemIndex > -1
                  ? updateCartItems[upadteCartItemIndex]?.qty ?? item.quantity
                  : item.quantity;

              const isDeleted =
                upadteCartItemIndex > -1
                  ? updateCartItems[upadteCartItemIndex]?.isDeleted ?? false
                  : false;

              return (
                !isDeleted && (
                  <>
                    <Pressable
                      style={{
                        backgroundColor: '#f5f5f5',
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
                              ₹ {item.subCategory.price}
                            </Text>
                          </View>

                          <View
                            style={{
                              flex: 0.4,
                              justifyContent: 'space-evenly',
                              flexDirection: 'row',
                              alignItems: 'center',
                            }}>
                            {qty > 1 ? (
                              <Pressable
                                onPress={() => {
                                  handleUpdateCartItems(item.id, qty - 1);
                                  updateCart({
                                    variables: {
                                      operator: -1,
                                      updateCartItemId: item.id,
                                    },
                                  })
                                    .then(response => {
                                      // setCart();
                                      console.log(
                                        'PODAAAAAA:::::::',
                                        response?.data?.updateCartItem,
                                      );
                                    })
                                    .catch(error => {
                                      console.log(
                                        'UPDATE ADD TO CARt CATCH ERROR',
                                        error,
                                      );
                                    });
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
                                      console.log('DELETE::::::::::', response);
                                      handleDeleteCartItems(item.id, qty);
                                    })
                                    .catch(error => {
                                      console.log(
                                        'DELETE ADD TO CARt CATCH ERROR',
                                        error,
                                      );
                                    });
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
                                {qty}
                              </Text>
                            </View>
                            <Pressable
                              onPress={() => {
                                handleUpdateCartItems(item.id, qty + 1);
                                updateCart({
                                  variables: {
                                    operator: 1,
                                    updateCartItemId: item.id,
                                  },
                                })
                                  .then(response => {
                                    console.log(
                                      'PODAAAAAA:::::::',
                                      response?.data?.updateCartItem,
                                    );
                                  })
                                  .catch(error => {
                                    console.log(
                                      'UPDATE ADD TO CARt CATCH ERROR',
                                      error,
                                    );
                                  });
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
                    {item.addOns?.map(addon => (
                  console.log("AAAAAAAAAAAAAAAAAAAAA",addon),
                   <Pressable
                   style={{
                     backgroundColor: '#f5f5f5',
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
                           uri: addon?.addOn?.image,
                         }}
                       />
                     </View>
                   </View>
                   <View style={{flex: 0.8, marginHorizontal: 5}}>
                     <View style={{flex: 0.6}}>
                       <Text style={{fontWeight: '700', color: '#000518'}}>
                         {addon?.addOn?.name}
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
                           ₹ {addon?.addOn?.price}
                         </Text>
                       </View>

                       <View
                         style={{
                           flex: 0.4,
                           justifyContent: 'space-evenly',
                           flexDirection: 'row',
                           alignItems: 'center',
                         }}>
                         {qty > 1 ? (
                           <Pressable
                             onPress={() => {
                               handleUpdateCartItems(item.id, qty - 1);
                               updateCart({
                                 variables: {
                                   operator: -1,
                                   updateCartItemId: item.id,
                                 },
                               })
                                 .then(response => {
                                   // setCart();
                                   console.log(
                                     'PODAAAAAA:::::::',
                                     response?.data?.updateCartItem,
                                   );
                                 })
                                 .catch(error => {
                                   console.log(
                                     'UPDATE ADD TO CARt CATCH ERROR',
                                     error,
                                   );
                                 });
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
                                   console.log('DELETE::::::::::', response);
                                   handleDeleteCartItems(item.id, qty);
                                 })
                                 .catch(error => {
                                   console.log(
                                     'DELETE ADD TO CARt CATCH ERROR',
                                     error,
                                   );
                                 });
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
                             {qty}
                           </Text>
                         </View>
                         <Pressable
                           onPress={() => {
                             handleUpdateCartItems(item.id, qty + 1);
                             updateCart({
                               variables: {
                                 operator: 1,
                                 updateCartItemId: item.id,
                               },
                             })
                               .then(response => {
                                 console.log(
                                   'PODAAAAAA:::::::',
                                   response?.data?.updateCartItem,
                                 );
                               })
                               .catch(error => {
                                 console.log(
                                   'UPDATE ADD TO CARt CATCH ERROR',
                                   error,
                                 );
                               });
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
              ))}
                  

                  </>
                )
              );
            })}
          </ScrollView>
        ) : (
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: 200,
            }}>
            <Image
              source={require('../assets/empty.gif')}
              style={{height: 200, width: 200, resizeMode: 'contain'}}></Image>
          </View>
        )}
      </View>

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
                ₹{' '}
                {cart.length > 0
                  ? cart
                      ?.map(item => {
                        const upadteCartItemIndex = updateCartItems.findIndex(
                          lol => lol?.id == item?.id,
                        );

                        if (upadteCartItemIndex > -1) {
                          const qty =
                            updateCartItems[upadteCartItemIndex].qty ??
                            item?.quantity;

                          return (item?.totalPrice ?? 0) * qty;
                        } else {
                          return item?.totalPrice ?? 0;
                        }
                      })
                      ?.reduce((total, current) => total + current) ?? 0
                  : 0}
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
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
    </View>
  );
};
export default MyCartScreen;
