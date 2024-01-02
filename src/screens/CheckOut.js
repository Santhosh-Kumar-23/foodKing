import React, {useState, useRef, useEffect} from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Pressable,
  StatusBar,
  Image,
  Alert,
  TextInput,
  KeyboardAvoidingView,
} from 'react-native';
import Check from 'react-native-vector-icons/MaterialCommunityIcons';
import Radio from 'react-native-vector-icons/MaterialIcons';
import Right from 'react-native-vector-icons/AntDesign';
import style from '../Styles/AddtoCartStyles';
import RBSheet from 'react-native-raw-bottom-sheet';
import {GET_TIMINGS} from '../Schemas/Schemas';
import Cancel from 'react-native-vector-icons/MaterialIcons';
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  gql,
  useQuery,
  useMutation,
  useLazyQuery,
} from '@apollo/client';

const CheckOut = props => {
  const [state, setState] = useState('today');

  const {data,refetch} = useQuery(GET_TIMINGS, {
    variables: {
      date: state,
    },
  });

  console.log('DATATATATATTATA::::', data?.getTimings ?? []);

  const detail = props?.route?.params?.details;
  const panelRef = useRef();

  const renderModal = () => {
    return (
      <RBSheet
        height={400}
        closeOnDragDown={false}
        closeOnPressMask={true}
        ref={panelRef}
        customStyles={{
          container: {
            backgroundColor: 'white',
            borderTopRightRadius: 20,
            borderTopLeftRadius: 20,
            paddingTop: 10,
          },
        }}>
        <KeyboardAvoidingView
          behavior="padding"
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginHorizontal: 20,
            marginTop: 15,
          }}>
          <View>
            <Text style={{fontWeight: '700', color: 'black', fontSize: 16}}>
              Coupen Code
            </Text>
          </View>
          <View>
            <Cancel
              name="cancel"
              size={23}
              color={'red'}
              style={{marginLeft: 6}}
            />
          </View>
        </KeyboardAvoidingView>

        <View
          style={{flexDirection: 'row', marginHorizontal: 20, marginTop: 10}}>
          <View
            style={{
              flex: 0.8,
              backgroundColor: 'white',
              borderTopLeftRadius: 8,
              borderBottomLeftRadius: 8,
            }}>
            <View
              style={{
                color: 'gray',
                borderTopLeftRadius: 8,
                borderBottomLeftRadius: 8,
                borderTopWidth: 1,
                borderBottomWidth: 1,
                borderLeftWidth: 1,
                borderColor: 'gray',
                height: 50,
              }}></View>
          </View>

          <TouchableOpacity
            style={{
              flex: 0.3,
              backgroundColor: 'rgb(26 183 89)',
              justifyContent: 'center',
              alignItems: 'center',
              borderTopRightRadius: 8,
              borderBottomRightRadius: 8,
            }}>
            <Text style={{color: 'white', fontWeight: '700', fontSize: 16}}>
              Apply
            </Text>
          </TouchableOpacity>
        </View>

        <View style={{marginHorizontal: 20, marginTop: 20}}>
          <Text style={{fontWeight: '700', color: 'black', fontSize: 16}}>
            Offer for you
          </Text>
          <Text style={{color: 'black', fontSize: 12}}>
            Coupon built just for you
          </Text>
        </View>

        <View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              backgroundColor: 'white',
              padding: 0,
              marginTop: 10,
              marginHorizontal: 20,
              borderRadius: 8,
              elevation: 1,
            }}>
            <View
              style={{
                backgroundColor: 'rgb(255 219 31)',
                margin: 10,
                padding: 5,
              }}>
              <Text style={{fontSize: 12, color: 'black', fontWeight: '600'}}>
                Code: shake
              </Text>
            </View>

            <View
              style={{
                backgroundColor: '#ff146c',
                marginBottom: 10,
                paddingHorizontal: 14,
                justifyContent: 'center',
                alignItems: 'center',
                borderTopRightRadius: 8,
                borderBottomLeftRadius: 8,
              }}>
              <Text style={{fontSize: 12, color: 'white', fontWeight: '700'}}>
                Apply
              </Text>
            </View>
          </View>
          <Text style={{marginHorizontal: 27, fontSize: 12, marginTop: 5}}>
            Get 7.00% off on this orders
          </Text>
        </View>
      </RBSheet>
    );
  };

  const modal = () => {
    return <>{renderModal()}</>;
  };

  const days = [
    {
      name: 'Today',
      value: 'Tdy',
    },
    {
      name: 'Tomorrow',
      value: 'Tmrw',
    },
  ];

  return (
    <ScrollView style={{backgroundColor: 'white', flex: 1}}>
      <StatusBar backgroundColor={'white'} barStyle={'dark-content'} />
      <View style={{flex: 0.16, backgroundColor: 'white'}}>
        <Text
          style={{
            fontWeight: '600',
            color: 'black',
            marginHorizontal: 20,
            marginTop: 10,
          }}>
          Preferred Time Frame For Delivery
        </Text>

        <ScrollView
          horizontal={true}
          style={{backgroundColor: 'white', marginHorizontal: 20}}
          showsHorizontalScrollIndicator={false}>
          {days.map(item => {
            return (
              <Pressable
                onPress={() => {
                  setState(item.name);
                  refetch();
                  console.log('STATATATA:::::::::::::', state);
                  // Alert.alert(item.name)
                }}
                style={{
                  borderWidth: 1,
                  borderColor: 'gray',
                  height: 40,
                  width: 200,
                  borderRadius: 10,
                  backgroundColor: '#e6ecf5',
                  flexDirection: 'row',
                  marginTop: 6,
                  marginRight: 10,
                  padding: 5,
                }}>
                <View
                  style={{
                    padding: 5,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <View>
                    {!true ? (
                      <Radio
                        name="radio-button-on"
                        size={17}
                        color={'#ff146c'}
                      />
                    ) : (
                      <Radio name="radio-button-off" size={17} color={'gray'} />
                    )}
                  </View>
                </View>
                <View
                  style={{
                    justifyContent: 'center',
                    padding: 5,
                  }}>
                  <Text style={{fontSize: 13, color: 'black'}}>
                    {item?.name}
                  </Text>
                </View>
              </Pressable>
            );
          })}
        </ScrollView>
        <ScrollView
          horizontal={true}
          style={{backgroundColor: 'white', marginHorizontal: 20}}
          showsHorizontalScrollIndicator={false}>
          {data?.getTimings?.timings?.map(item => {
            return (
              <Pressable
                style={{
                  borderWidth: 1,
                  borderColor: 'gray',
                  height: 40,
                  width: 200,
                  borderRadius: 10,
                  backgroundColor: '#e6ecf5',
                  flexDirection: 'row',
                  marginTop: 6,
                  marginRight: 10,
                  padding: 5,
                }}>
                <View
                  style={{
                    padding: 5,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <View>
                    {false ? (
                      <Radio
                        name="radio-button-on"
                        size={17}
                        color={'#ff146c'}
                      />
                    ) : (
                      <Radio name="radio-button-off" size={17} color={'gray'} />
                    )}
                  </View>
                </View>
                <View
                  style={{
                    justifyContent: 'center',
                    padding: 5,
                  }}>
                  <Text style={{fontSize: 13, color: 'black'}}>{item}</Text>
                </View>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>
      <View style={{flex: 0.84, backgroundColor: 'white'}}>
        <View>
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
              <Text style={{fontWeight: '800', color: '#ff146c'}}>
                Cart Summary
              </Text>
            </View>

            <View
              style={{
                flex: 0.5,
                backgroundColor: 'white',
                flexDirection: 'row',
              }}>
              <Pressable
                // onPress={() => {
                //   setChnage(!chnage);
                // }}
                style={style.sunContainer1}>
                <View
                  style={[
                    style.Button,
                    {
                      backgroundColor: true
                        ? 'rgb(0, 139, 186)'
                        : 'rgb(189 239 255)',
                    },
                  ]}>
                  <Text
                    style={{
                      color: true ? 'white' : 'rgb(0,139,186)',
                      fontWeight: '700',
                    }}>
                    Delivery
                  </Text>
                </View>
              </Pressable>
              <Pressable
                style={style.sunContainer2}
                // onPress={() => {
                //   setChnage(!chnage);
                // }}
              >
                <View
                  style={[
                    style.Button,
                    {
                      backgroundColor: true
                        ? 'rgb(189 239 255)'
                        : 'rgb(0, 139, 186)',
                    },
                  ]}>
                  <Text
                    style={{
                      color: true ? 'rgb(0, 139, 186)' : 'white',
                      fontWeight: '700',
                    }}>
                    Takeaway
                  </Text>
                </View>
              </Pressable>
            </View>
          </View>
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          {detail?.addtoCart?.map(item => {
            return (
              <View
                style={{
                  flexDirection: 'row',
                  marginHorizontal: 20,
                  marginTop: 10,
                  backgroundColor: 'yellow',
                }}>
                <View
                  style={{backgroundColor: 'red', flex: 0.2, borderRadius: 5}}>
                  <View style={{height: 70, width: '100%'}}>
                    <Image
                      source={{
                        uri: item?.subCategory?.image,
                      }}
                      style={{height: '100%', width: '100%', borderRadius: 5}}
                    />
                  </View>
                  <View
                    style={{
                      height: 25,
                      width: 25,
                      backgroundColor: 'rgb(31 31 57)',
                      position: 'absolute',
                      borderRadius: 20,
                      justifyContent: 'center',
                      alignItems: 'center',
                      top: 20,
                      left: -12,
                    }}>
                    <Text style={{color: 'white', fontWeight: '600'}}>
                      {item?.quantity}
                    </Text>
                  </View>
                </View>
                <View
                  style={{
                    backgroundColor: 'white',
                    flex: 0.8,
                    justifyContent: 'space-evenly',
                    paddingLeft: 6,
                  }}>
                  <Text style={{fontWeight: '700', color: 'black'}}>
                    {item?.subCategory?.name}
                  </Text>
                  <Text style={{fontSize: 10}}>
                    {item?.selectedVariation[0]?.name}
                  </Text>
                  <Text
                    style={{fontSize: 12, color: 'black', fontWeight: '700'}}>
                    {item?.subCategory?.price}
                  </Text>
                </View>
              </View>
            );
          })}
        </ScrollView>

        <TouchableOpacity
          onPress={() => {
            panelRef.current.open();
          }}
          style={{
            backgroundColor: 'white',
            elevation: 1,
            justifyContent: 'space-evenly',
            flexDirection: 'row',
            marginHorizontal: 20,
            padding: 13,
            borderRadius: 8,
            marginTop: 10,
          }}>
          <View style={{flex: 0.1}}>
            <Check name="ticket-percent" size={30} color={'#ff146c'} />
          </View>
          <View style={{flex: 0.8, justifyContent: 'center'}}>
            <Text style={{fontSize: 12, fontWeight: '500', color: 'black'}}>
              Select Offer/Apply Coupen
            </Text>
          </View>
          <View
            style={{flex: 0.1, justifyContent: 'center', alignItems: 'center'}}>
            <Right name="right" size={22} color={'#ff146c'} />
          </View>
        </TouchableOpacity>

        <View
          style={{
            elevation: 1,
            marginHorizontal: 20,
            marginTop: 10,
            padding: 15,
            borderRadius: 8,
            backgroundColor: 'white',
          }}>
          <View style={{justifyContent: 'space-between', flexDirection: 'row'}}>
            <Text style={{fontSize: 15, color: 'black'}}>Subtotal</Text>
            <Text style={{fontSize: 15}}>${detail?.subTotal}</Text>
          </View>

          <View
            style={{
              justifyContent: 'space-between',
              flexDirection: 'row',
              marginVertical: 10,
            }}>
            <Text style={{fontSize: 15, color: 'black'}}>Discount</Text>
            <Text style={{fontSize: 15}}>$ 3.00</Text>
          </View>

          <View style={{justifyContent: 'space-between', flexDirection: 'row'}}>
            <Text style={{fontSize: 15, color: 'black'}}>Delivery Charge</Text>
            <Text style={{fontSize: 15}}>$ 3.00</Text>
          </View>

          <View
            style={{
              justifyContent: 'space-between',
              flexDirection: 'row',
              marginTop: 30,
            }}>
            <Text style={{fontWeight: '800', color: 'black'}}>Total</Text>
            <Text style={{fontWeight: '700', color: 'black'}}>$ 3.00</Text>
          </View>
        </View>

        <TouchableOpacity
          style={{
            backgroundColor: '#ff146c',
            marginVertical: 25,
            marginHorizontal: 20,
            padding: 15,
            borderRadius: 30,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <View style={{marginHorizontal: 10}}>
            <Text style={{color: 'white', fontWeight: '700', fontSize: 16}}>
              Place Order
            </Text>
          </View>
        </TouchableOpacity>
      </View>
      {modal()}
    </ScrollView>
  );
};
export default CheckOut;
