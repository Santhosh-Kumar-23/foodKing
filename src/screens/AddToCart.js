import {
  View,
  Text,
  StatusBar,
  Pressable,
  TouchableOpacity,
  Dimensions,
  Image,
} from 'react-native';
import React, {useState} from 'react';
import style from '../Styles/AddtoCartStyles';
import Minus from 'react-native-vector-icons/AntDesign';
const AddToCart = () => {
  const [chnage, setChnage] = useState(true);
  return (
    <View style={[style.container, {backgroundColor: 'gray'}]}>
      <StatusBar backgroundColor={'white'} barStyle={'dark-content'} />
      <View style={{flexDirection: 'row', marginHorizontal: 12, marginTop: 10}}>
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
              setChnage(false);
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
              setChnage(false);
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

      <Pressable
        style={{
          backgroundColor: 'white',

          borderColor: 'gray',

          flexDirection: 'row',
          height: 70,
          overflow: 'hidden',
          marginHorizontal: 20,
          marginTop: 20,
        }}>
        <View style={{flex: 0.2}}>
          <View style={{height: 70, width: '100%'}}>
            <Image
              style={{
                height: '100%',
                width: '100%',
                resizeMode: 'cover',
                // borderRadius: 10,
              }}
              source={{
                uri: 'https://demo.foodking.dev/storage/32/conversions/chicken_dumplings-thumb.png',
              }}
            />
          </View>
        </View>
        <View style={{flex: 0.8, marginHorizontal: 5}}>
          <View style={{flex: 0.6}}>
            <Text style={{fontWeight: '700', color: 'black'}}>sODA</Text>
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
                2.00
              </Text>
            </View>

            <View
              style={{
                flex: 0.4,
                justifyContent: 'space-evenly',
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <TouchableOpacity>
                <Minus name="minuscircleo" size={17} color={'#ff146c'} />
              </TouchableOpacity>
              <View>
                <Text
                  style={{
                    color: 'black',
                    textAlign: 'center',
                  }}>
                  1
                </Text>
              </View>
              <TouchableOpacity>
                <Minus name="pluscircleo" size={17} color={'#ff146c'} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Pressable>
    </View>
  );
};
export default AddToCart;
