import React, {useCallback, useState, useRef} from 'react';
import {
  View,
  Text,
  StatusBar,
  Image,
  StyleSheet,
  TextInput,
  ScrollView,
  Alert,
  FlatList,
  TouchableOpacity,
  KeyboardAvoidingView,
  Pressable,
  Dimensions,
  Button,
  ActivityIndicator
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

import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from '../Styles/HomeScreenStyles';
import stylees from '../Styles/categoriesScreenStyles';
import Col from 'react-native-vector-icons/MaterialIcons';
import Row from 'react-native-vector-icons/Entypo';
import {TouchableWithoutFeedback} from 'react-native-gesture-handler';
import Cancel from 'react-native-vector-icons/MaterialIcons';
import {useFocusEffect} from '@react-navigation/native';
import Spinner from 'react-native-loading-spinner-overlay';
import {
  GET_SUB_CATEGORIES,
  GET_ALL_CATEGORIES,
  GET_POP_UP_SUB_CATEGORIES,
  ADD_TO_CART,
  GET_OFFRS,
  GET_ADD_CART,
} from '../Schemas/Schemas';
import Sample from '../components/Sample';
import Sample2 from '../components/Sample2';
import RBSheet from 'react-native-raw-bottom-sheet';
import InfoBottomSheet from '../components/InfoBottomSheet';
import Bag from 'react-native-vector-icons/FontAwesome6';
import Minus from 'react-native-vector-icons/AntDesign';
import Radio from 'react-native-vector-icons/MaterialIcons';
import Check from 'react-native-vector-icons/MaterialCommunityIcons';
import {showMessage, hideMessage} from 'react-native-flash-message';
import DeviceInfo from 'react-native-device-info';

const CategoriesScreen = props => {
  const [getUserId, setGetUserId] = useState(null);
  const [tkn, setTkn] = useState(null);
  const [instructions, setInstructions] = useState(null);
  const [loading, setLoading] = useState(false);

  AsyncStorage.getItem('userId').then(res => {
    setGetUserId(res);
  });

  AsyncStorage.getItem('userDetails').then(res => {
    setTkn(res);
  });

  const deviceToken = DeviceInfo.getUniqueId();

  const {refetch} = useQuery(GET_ADD_CART, {
    variables: Boolean(tkn)
      ? {
          userId: JSON.parse(getUserId),
        }
      : {
          deviceToken: deviceToken?._j,
        },
  });

  const [addon, setAddon] = useState([]);
  const [extra, setExtra] = useState([]);

  const [variationSelectedItems, setVariationSelectedItems] = useState([]);
  const [quantity, setQuantity] = useState(1);

  //for bottom sheet variables
  const panelRef = useRef();
  const mainPanelRef = useRef();

  const [getSubCategories, setGetSubCategories] = useState(null);
  const [mainSelectedItem, setMainSelectedItem] = useState(null);

  //total count
  const [totalCount, setTotalCount] = useState(null);

  const [getPopUpSubCategories] = useLazyQuery(GET_POP_UP_SUB_CATEGORIES);
  const [Cart] = useMutation(ADD_TO_CART);

  const categoryItem = props?.route?.params?.categoryItem ?? {
    __typename: 'Category',
    id: '64f98497e5735c839b749880',
    image:
      'https://demo.foodking.dev/storage/21/conversions/appetizers-thumb.png',
    index: 0,
    name: 'Appetizers',
  };

  // console.log('ITEM::::::', categoryItem);

  const [selectedItem, setSelectedItem] = useState(categoryItem);

  const [changing, setChnaging] = useState(null);

  const [subCategoryy, setSubCategoryy] = useState([]);

  const [change, setChnage] = useState(true);

  const [subCategory] = useLazyQuery(GET_SUB_CATEGORIES);

  useFocusEffect(
    useCallback(() => {
      subCategory({
        variables: {
          getSubCategoriesforCategoriesId: selectedItem?.id,
          type: changing,
        },
      })
        .then(response => {
          setSubCategoryy(
            response?.data?.getSubCategoriesforCategories?.subCategories ?? [],
          );
        })
        .catch(error => {
          console.log('GET SUB CATEGORIES CATCH ERROR', error);

          setSubCategoryy([]);
        });
    }, [selectedItem, changing]),
  );

  const [infoo, setInfoo] = useState(null);

  const renderInfoModal = () => {
    return (
      <RBSheet
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
        <InfoBottomSheet
          name={infoo?.name}
          caution={infoo?.caution}
          close={() => {
            panelRef.current.close();
          }}
        />
      </RBSheet>
    );
  };

  const modal = () => {
    return <>{renderInfoModal()}</>;
  };

  const hanldeAll = (itemm, item) => {
    let helperArray = [...variationSelectedItems];

    if (!helperArray.some(lol => lol?.id == item?.id)) {
      const helperObject = {
        id: item.id,
        attribute: item.attribute,
        variations: {
          id: itemm.id,
          name: itemm.name,
          add_price: itemm.add_price,
          status: itemm.status,
        },
      };

      helperArray.push(helperObject);
    } else {
      const index = helperArray.findIndex(lol => lol?.id == item?.id);

      helperArray[index].variations = itemm;
    }

    console.log('HELPER ARRAy::: ', JSON.stringify(helperArray));
    setVariationSelectedItems(helperArray);
  };

  const handleAddons = itemm => {
    const helperArray = [...addon];

    if (!helperArray.some(lol => lol?.id == itemm?.id)) {
      helperArray.push({
        id: itemm.id,
        name: itemm.name,
        price: itemm.price,
        description: itemm.description,
        image: itemm.image,
        status: itemm.status,
        quantity: 1,
      });
    } else {
      const index = helperArray.findIndex(lol => lol?.id == itemm?.id);
      index > -1 && helperArray.splice(index, 1);
    }
    console.log('HELPER ARRAy ADDONS::: ', JSON.stringify(helperArray));

    setAddon(helperArray);
  };

  const handleExtras = itemm => {
    const helperArray = [...extra];
    if (!helperArray.some(lol => lol?.id == itemm?.id)) {
      helperArray.push({
        id: itemm.id,
        name: itemm.name,
        add_price: itemm.add_price,
        status: itemm.status,
      });
    } else {
      const index = helperArray.findIndex(lol => lol?.id == itemm?.id);
      index > -1 && helperArray.splice(index, 1);
    }
    console.log('HELPER ARRAy Extras::: ', JSON.stringify(helperArray));
    setExtra(helperArray);
  };

  const mainModal = () => {
    return (
      <RBSheet
        openDuration={300}
        height={660}
        animationType="slide"
        customStyles={{
          container: {
            backgroundColor: 'white',
            borderTopRightRadius: 20,
            borderTopLeftRadius: 20,
            paddingTop: 10,
          },
        }}
        closeOnDragDown={false}
        closeOnPressMask={true}
        ref={mainPanelRef}>
        <KeyboardAvoidingView behavior="padding">
          <ScrollView
            style={{backgroundColor: 'white'}}
            showsVerticalScrollIndicator={false}>
            <View
              style={{
                flexDirection: 'row',
                backgroundColor: 'white',
                marginHorizontal: 20,
                marginVertical: 20,
                height: 85,
                overflow: 'hidden',
              }}>
              <View style={{height: 85, flex: 0.3, backgroundColor: 'white'}}>
                <Image
                  source={{
                    uri: mainSelectedItem?.image,
                  }}
                  style={{
                    height: '100%',
                    width: '100%',
                    resizeMode: 'contain',
                    borderRadius: 10,
                  }}
                />
              </View>
              <View style={{flex: 0.8, backgroundColor: 'white'}}>
                <View
                  style={{
                    justifyContent: 'space-between',
                    flexDirection: 'row',
                    marginHorizontal: 6,
                    flex: 0.3,
                  }}>
                  <Text style={{fontWeight: '900', color: '#000518'}}>
                    {mainSelectedItem?.name}
                  </Text>
                  <TouchableOpacity
                    onPress={() => {
                      mainPanelRef.current.close();
                      setVariationSelectedItems([]);
                      setAddon([]);
                      setExtra([]);
                    }}>
                    <Cancel name="cancel" size={22} color={'red'} />
                  </TouchableOpacity>
                </View>

                <View
                  style={{
                    backgroundColor: 'white',
                    flex: 0.7,
                    justifyContent: 'space-evenly',
                  }}>
                  <Text style={{marginHorizontal: 6, fontSize: 10}}>
                    {mainSelectedItem?.description}
                  </Text>
                  <Text
                    style={{
                      marginHorizontal: 6,
                      fontWeight: '700',
                      color: '#000518',
                    }}>
                    $ {mainSelectedItem?.price}
                  </Text>
                </View>
              </View>
            </View>
            <View style={{marginHorizontal: 20}}>
              <View
                style={{
                  flexDirection: 'row',
                  marginVertical: 10,
                  // marginHorizontal: 10
                }}>
                <View style={{backgroundColor: 'white', flex: 0.7}}>
                  <Text style={{fontWeight: '800', color: '#000518'}}>
                    Quantity :
                  </Text>
                </View>
                <View style={{backgroundColor: 'white', flex: 0.3}}>
                  <View
                    style={{
                      backgroundColor: '#f0f8ff',
                      justifyContent: 'space-evenly',
                      flexDirection: 'row',
                      alignItems: 'center',
                      borderRadius: 10,
                      padding: 5,
                      // paddingVertical:3,
                      // paddingHorizontal:3,
                      elevation: 1,
                    }}>
                    <TouchableOpacity
                      disabled={quantity == 1}
                      onPress={() => {
                        setQuantity(quantity - 1);
                      }}>
                      <Minus name="minuscircleo" size={17} color={'#ff146c'} />
                    </TouchableOpacity>
                    <View>
                      <Text style={{color: 'black'}}>{quantity}</Text>
                    </View>
                    <TouchableOpacity
                      onPress={() => {
                        setQuantity(quantity + 1);
                      }}>
                      <Minus name="pluscircleo" size={17} color={'#ff146c'} />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>

              {getSubCategories?.subCategoryVariation?.map((item, ind) => {
                return (
                  <>
                    <Text style={{fontWeight: '800', color: '#000518'}}>
                      {item?.attribute}
                    </Text>
                    <ScrollView
                      showsHorizontalScrollIndicator={false}
                      horizontal={true}
                      style={{backgroundColor: 'white', marginBottom: 10}}>
                      <View style={{marginTop: 0}} key={ind}>
                        <View style={{flexDirection: 'row'}}>
                          {item.variations?.map((itemm, index) => {
                            const parentIndex =
                              variationSelectedItems.findIndex(
                                lol => lol?.id == item?.id,
                              );

                            const isSelected =
                              variationSelectedItems[parentIndex]?.variations
                                ?.id == itemm?.id;

                            return (
                              <Pressable
                                onPress={() => {
                                  hanldeAll(itemm, item);
                                }}
                                style={{
                                  borderWidth: isSelected ? 1.5 : 0,
                                  borderColor: isSelected ? '#ff146c' : 'gray',
                                  height: 60,
                                  borderRadius: 10,
                                  backgroundColor: isSelected
                                    ? '#FFD9E7'
                                    : '#e6ecf5',
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
                                  {isSelected ? (
                                    <Radio
                                      name="radio-button-on"
                                      size={17}
                                      color={'#ff146c'}
                                    />
                                  ) : (
                                    <Radio
                                      name="radio-button-off"
                                      size={17}
                                      color={'gray'}
                                    />
                                  )}
                                </View>
                                <View
                                  style={{
                                    justifyContent: 'center',
                                    // alignItems: 'center',
                                    padding: 5,
                                  }}>
                                  <Text style={{fontSize: 13, color: 'black'}}>
                                    {itemm?.name}
                                  </Text>
                                  <Text
                                    style={{
                                      fontSize: 13,
                                      color: 'black',
                                      fontWeight: '800',
                                    }}>
                                    $ {itemm?.add_price}
                                  </Text>
                                </View>
                              </Pressable>
                            );
                          })}
                        </View>
                      </View>
                    </ScrollView>
                  </>
                );
              })}

              {getSubCategories?.subCategoryExtra?.length !== 0 ? (
                <View>
                  <Text style={{fontWeight: '800', color: '#000518'}}>
                    Extras :
                  </Text>
                  <ScrollView
                    horizontal={true}
                    style={{backgroundColor: 'white'}}
                    showsHorizontalScrollIndicator={false}>
                    {getSubCategories?.subCategoryExtra?.map(item => {
                      const isSelected = extra.some(lol => lol?.id == item?.id);

                      return (
                        <Pressable
                          onPress={() => {
                            handleExtras(item);
                          }}
                          style={{
                            borderWidth: isSelected ? 1.5 : 0,
                            borderColor: isSelected ? '#ff146c' : 'gray',
                            height: 60,
                            borderRadius: 10,
                            backgroundColor: isSelected ? '#FFD9E7' : '#e6ecf5',
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
                              {isSelected ? (
                                <Check
                                  name="checkbox-marked"
                                  size={17}
                                  color={'#ff146c'}
                                />
                              ) : (
                                <Check
                                  name="checkbox-blank-outline"
                                  size={17}
                                  color={'gray'}
                                />
                              )}
                            </View>
                          </View>
                          <View
                            style={{
                              justifyContent: 'center',
                              // alignItems: 'center',
                              padding: 5,
                            }}>
                            <Text style={{fontSize: 13, color: 'black'}}>
                              {item?.name}
                            </Text>
                            <Text
                              style={{
                                fontSize: 13,
                                color: 'black',
                                fontWeight: '800',
                              }}>
                              $ {item?.add_price}
                            </Text>
                          </View>
                        </Pressable>
                      );
                    })}
                  </ScrollView>
                </View>
              ) : (
                <></>
              )}

              {getSubCategories?.addOn?.length !== 0 ? (
                <View>
                  <View style={{marginVertical: 10}}>
                    <Text style={{fontWeight: '800', color: '#000518'}}>
                      Addons
                    </Text>
                  </View>

                  <ScrollView
                    horizontal={true}
                    style={{backgroundColor: 'white'}}
                    showsHorizontalScrollIndicator={false}>
                    {getSubCategories?.addOn?.map(item => {
                      const isSelected = addon.some(lol => lol?.id == item?.id);
                      const selectedIndex = addon.findIndex(
                        lol => lol?.id == item?.id,
                      );

                      return (
                        <Pressable
                          onPress={() => {
                            handleAddons(item);
                          }}
                          style={{
                            backgroundColor: isSelected ? '#FFD9E7' : 'white',
                            borderWidth: isSelected ? 1.5 : 0.5,
                            borderColor: isSelected ? '#ff146c' : 'gray',
                            width: Dimensions.get('window').width * 0.6,
                            flexDirection: 'row',
                            height: 70,
                            overflow: 'hidden',
                            borderRadius: 10,
                            marginRight: 10,
                          }}>
                          <View style={{flex: 0.3}}>
                            <View style={{height: 70, width: '100%'}}>
                              <Image
                                style={{
                                  height: '100%',
                                  width: '100%',
                                  resizeMode: 'cover',
                                  // borderRadius: 10,
                                }}
                                source={{
                                  uri: item?.image,
                                }}
                              />
                            </View>
                          </View>
                          <View style={{flex: 0.7, marginHorizontal: 5}}>
                            <View style={{flex: 0.6}}>
                              <Text style={{fontWeight: '700', color: 'black'}}>
                                {item?.name}
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
                                  ${item?.price}
                                </Text>
                              </View>
                              {isSelected ? (
                                <View
                                  style={{
                                    flex: 0.4,
                                    justifyContent: 'space-evenly',
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                  }}>
                                  <TouchableOpacity
                                    disabled={
                                      addon[selectedIndex]?.quantity == 1
                                    }
                                    onPress={() => {
                                      const helperArray = [...addon];

                                      helperArray[selectedIndex].quantity =
                                        helperArray[selectedIndex].quantity - 1;

                                      setAddon(helperArray);
                                    }}>
                                    <Minus
                                      name="minuscircleo"
                                      size={17}
                                      color={'#ff146c'}
                                    />
                                  </TouchableOpacity>
                                  <View>
                                    <Text
                                      style={{
                                        color: 'black',
                                        textAlign: 'center',
                                      }}>
                                      {addon[selectedIndex]?.quantity ?? 0}
                                    </Text>
                                  </View>
                                  <TouchableOpacity
                                    onPress={() => {
                                      const helperArray = [...addon];

                                      console.log(
                                        'IN::: ',
                                        JSON.stringify(addon),
                                      );

                                      helperArray[selectedIndex].quantity =
                                        helperArray[selectedIndex].quantity + 1;

                                      setAddon(helperArray);
                                    }}>
                                    <Minus
                                      name="pluscircleo"
                                      size={17}
                                      color={'#ff146c'}
                                    />
                                  </TouchableOpacity>
                                </View>
                              ) : (
                                <></>
                              )}
                            </View>
                          </View>
                        </Pressable>
                      );
                    })}
                  </ScrollView>
                </View>
              ) : (
                <></>
              )}

              <Text
                style={{fontWeight: '800', color: '#000518', marginTop: 10}}>
                Special instructions
              </Text>

              <TextInput  onChangeText={item => {
                  setInstructions(item);
                }}
                style={{
                  borderWidth: 2,
                  borderRadius: 10,
                  paddingHorizontal: 15,
                  marginTop: 10,
                  borderColor: '#b0bcde',
                }}
                placeholder="Add note (extra mayo, cheese, etc.)"
                placeholderTextColor={'gray'}
              />

                <TouchableOpacity
                onPress={() => {
                  setLoading(true)
                  if (Boolean(tkn)) {
                    console.log(
                      JSON.stringify({
                        variables: {
                          input: {
                            subCategory: getSubCategories?.id,
                            quantity: quantity,
                            addOns: addon,
                            userId: JSON.parse(getUserId),
                            subCategoryExtra: extra,
                            subCategoryVariation: variationSelectedItems,
                            specialInstruction:instructions
                          },
                        },
                      }),
                    );

                    Cart({
                      variables: {
                        input: {
                          subCategory: getSubCategories?.id,
                          quantity: quantity,
                          addOns: addon,
                          userId: JSON.parse(getUserId),
                          subCategoryExtra: extra,
                          subCategoryVariation: variationSelectedItems,
                          specialInstruction:instructions
                          
                        },
                      },
                    })
                      .then(res => {
                        setLoading(false)
                        refetch();
                        console.log(
                          'AAAAAAAAAAAAAAAAAA:::::',
                          JSON.stringify(res),
                        );
                        mainPanelRef.current.close();

                        showMessage({
                          message: 'Added to cart',
                          type: 'success',
                        });
                      })
                      .catch(error => {
                        setLoading(false)
                        console.log('ERROR ADD TO CART CATCH:::::::::', error);
                      });
                  } else {
                    setLoading(true)
                    console.log(
                      JSON.stringify({
                        variables: {
                          input: {
                            subCategory: getSubCategories?.id,
                            quantity: quantity,
                            addOns: addon,
                            subCategoryExtra: extra,
                            subCategoryVariation: variationSelectedItems,
                            deviceToken: deviceToken?._j,
                            specialInstruction:instructions
                          },
                        },
                      }),
                    );

                    Cart({
                      variables: {
                        input: {
                          subCategory: getSubCategories?.id,
                          quantity: quantity,
                          addOns: addon,
                          subCategoryExtra: extra,
                          subCategoryVariation: variationSelectedItems,
                          deviceToken: deviceToken?._j,
                          specialInstruction:instructions
                        },
                      },
                    })
                      .then(res => {
                        setLoading(false)
                        refetch();
                        console.log(
                          'AAAAAAAAAAAAAAAAAA:::::',
                          JSON.stringify(res),
                        );
                        mainPanelRef.current.close();

                        showMessage({
                          message: 'Added to cart',
                          type: 'success',
                        });
                      })
                      .catch(error => {
                        setLoading(false)
                        console.log('ERROR ADD TO CART CATCH:::::::::', error);
                      });
                  }
                }}
                style={{
                  backgroundColor: '#ff146c',
                  marginTop: 15,
                  marginBottom: 60,
                  padding: 15,
                  borderRadius: 30,
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                {!loading?(<>
                <View>
                  <Bag name="bag-shopping" size={20} color={'white'} />
                </View>
                <View style={{marginHorizontal: 10}}>
                  <Text style={{color: 'white', fontWeight: '700'}}>
                    Add to Cart
                  </Text>
                </View>
                <View>
                  <Text style={{color: 'white', fontWeight: '700'}}>
                    {((getSubCategories?.price ?? 0) +
                      (variationSelectedItems.length > 0
                        ? variationSelectedItems
                            ?.map(item => item?.variations?.add_price ?? 0)
                            ?.reduce((total, current) => total + current) ?? 0
                        : 0) +
                      (extra.length > 0
                        ? extra
                            ?.map(item => item?.add_price ?? 0)
                            ?.reduce((total, current) => total + current) ?? 0
                        : 0) +
                      (addon.length > 0
                        ? addon
                            ?.map(item =>
                              item?.price && item?.quantity
                                ? item?.price * item?.quantity
                                : 0,
                            )
                            ?.reduce((total, current) => total + current) ?? 0
                        : 0)) *
                      quantity}
                  </Text>
                </View>
                </>):(<ActivityIndicator size="small" color="white" />)}
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </RBSheet>
    );
  };

  _renderItem = ({item}) => (
    <View style={{flex: 0.5, marginHorizontal: 10, marginVertical: 10}}>
      {change ? (
        <Sample
          onPress={() => {
            mainPanelRef.current.open();
            setMainSelectedItem(item);
            setTotalCount(item?.price);
            getPopUpSubCategories({
              variables: {
                getSubCategoryId: item.id,
              },
            })
              .then(res => {
                setGetSubCategories(res?.data?.getSubCategory ?? []);
              })
              .catch(error => {
                console.log('POP UP SUB CATEGORIES CATECH ERRROR', error);
              });
          }}
          image={item.image}
          name={item.name}
          price={item.price}
          description={item.description}
          type={item.subCategoryType}
          onInfo={() => {
            panelRef.current.open();
            setInfoo(item);
          }}
        />
      ) : (
        <Sample2
          onPress={() => {
            mainPanelRef.current.open();
            setMainSelectedItem(item);
            setTotalCount(item?.price);
            getPopUpSubCategories({
              variables: {
                getSubCategoryId: item.id,
              },
            })
              .then(res => {
                setGetSubCategories(res?.data?.getSubCategory ?? []);
              })
              .catch(error => {
                console.log('POP UP SUB CATEGORIES CATECH ERRROR', error);
              });
          }}
          image={item.image}
          name={item.name}
          price={item.price}
          description={item.description}
          type={item.subCategoryType}
          onInfo={() => {
            panelRef.current.open();
            setInfoo(item);
          }}
        />
      )}
    </View>
  );

  function getAllCategories() {
    const {data} = useQuery(GET_ALL_CATEGORIES);

    const categories = data?.getAllCategories ?? [];

    return (
      <ScrollView
        horizontal={true}
        style={[styles.categoryContainer, {backgroundColor: 'white'}]}
        showsHorizontalScrollIndicator={false}>
        {categories.length !== 0 ? (
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            {categories?.map((item, index) => {
              return (
                <TouchableWithoutFeedback
                  key={index}
                  style={{
                    width: 95,
                    borderBottomColor: '#ff146c',
                    borderBottomWidth: selectedItem?.index == index ? 4 : 0,  
                    marginHorizontal: 10,
                  }}
                  onPress={() => {
                    console.log('CATEGORIES D::', item.id);
                    console.log({
                      variables: {
                        getSubCategoriesforCategoriesId: item.id,
                      },
                    });

                    setSelectedItem({...item, index});
                  }}>
                  <View style={styles.category}>
                    <View
                      style={{
                        height: 40,
                        width: '75%',
                        padding: 4,
                        alignSelf: 'center',
                      }}>
                      <Image
                        source={{
                          uri: `${item.image}`,
                        }}
                        style={{
                          height: '100%',
                          width: '100%',
                          resizeMode: 'contain',
                        }}
                      />
                    </View>
                    <View
                      style={{
                        height: 50,
                        padding: 4,
                        justifyContent: 'flex-start',
                        alignItems: 'center',
                      }}>
                      <Text
                        style={[
                          styles.categoryText,
                          {
                            color:
                              selectedItem?.index == index
                                ? '#ff146c'
                                : '#000518',
                          },
                        ]}>
                        {item.name}
                      </Text>
                    </View>
                  </View>
                </TouchableWithoutFeedback>
              );
            })}
          </View>
        ) : (
          <Spinner
            animation="slide"
            //  indicatorStyle={{}}
            visible={true}
            textContent={'Loading...'}
            textStyle={{color: '#ff146c', marginTop: -590}}
          />
        )}
      </ScrollView>
    );
  }

  return (
    <View style={{backgroundColor: 'white', flex: 1}}>
      <StatusBar backgroundColor={'white'} barStyle={'dark-content'} />
      <View style={{flex: 0.2}}>{getAllCategories()}</View>
      <View style={{flex: 0.8}}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {subCategoryy.length !== 0 ? (
            <View>
              <View style={{flexDirection: 'row', marginHorizontal: 20}}>
                <TouchableOpacity
                  style={[stylees.nonVeg, {width: 130}]}
                  onPress={() => {
                    setChnaging(changing == 'Non-Veg' ? null : 'Non-Veg');
                  }}>
                  <Image
                    source={{
                      uri: 'https://demo.foodking.dev/images/item-type/veg.png',
                    }}
                    style={{resizeMode: 'contain', width: 30, height: 25}}
                  />
                  <Text style={stylees.nonVegTxt}>Non-Veg</Text>
                  {changing == 'Non-Veg' ? (
                    <Cancel
                      name="cancel"
                      size={20}
                      color={'red'}
                      style={{marginLeft: 6}}
                    />
                  ) : (
                    <></>
                  )}
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    setChnaging(changing == 'Veg' ? null : 'Veg');
                  }}
                  style={[
                    stylees.nonVeg,
                    {paddingHorizontal: 22, marginHorizontal: 20},
                  ]}>
                  <Image
                    source={{
                      uri: 'https://demo.foodking.dev/images/item-type/non-veg.png',
                    }}
                    style={{resizeMode: 'contain', width: 25, height: 30}}
                  />
                  <Text style={[stylees.nonVegTxt, {}]}>Veg</Text>
                  {changing == 'Veg' ? (
                    <Cancel
                      name="cancel"
                      size={20}
                      color={'red'}
                      style={{marginLeft: 6}}
                    />
                  ) : (
                    <></>
                  )}
                </TouchableOpacity>
              </View>

              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  marginHorizontal: 20,
                }}>
                <Text style={{color: '#ff146c', fontWeight: '700'}}>
                  {selectedItem?.name ?? null}
                </Text>
                <View style={{flexDirection: 'row'}}>
                  <TouchableOpacity
                    onPress={() => {
                      setChnage(true);
                    }}>
                    <Col
                      name="view-agenda"
                      size={20}
                      color={!change ? 'black' : '#ff146c'}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {
                      setChnage(false);
                    }}>
                    <Row
                      name="grid"
                      size={25}
                      color={change ? 'black' : '#ff146c'}
                      style={{marginHorizontal: 10, marginVertical: -2}}
                    />
                  </TouchableOpacity>
                </View>
              </View>
              {change ? (
                <FlatList
                  key={1}
                  data={subCategoryy}
                  renderItem={_renderItem}
                  keyExtractor={item => item.id}
                  numColumns={1}
                  contentContainerStyle={{paddingBottom: 180}}
                />
              ) : (
                <FlatList
                  key={2}
                  data={subCategoryy}
                  renderItem={_renderItem}
                  keyExtractor={item => item.id}
                  numColumns={2}
                  contentContainerStyle={{paddingBottom: 180}}
                />
              )}
            </View>
          ) : (
            <>
              <View
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginTop: 100,
                }}>
                <Image
                  source={require('../assets/data.png')}
                  style={{
                    height: 300,
                    width: 300,
                    resizeMode: 'contain',
                  }}></Image>
              </View>
            </>
          )}
        </ScrollView>
      </View>
      {modal()}
      {mainModal()}
    </View>
  );
};

export default CategoriesScreen;
