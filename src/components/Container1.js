import React, {useCallback, useState} from 'react';
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
  Pressable,
} from 'react-native';
import styles from '../Styles/HomeScreenStyles';
import stylees from '../Styles/categoriesScreenStyles';
import Info from 'react-native-vector-icons/MaterialIcons';
import Bag from 'react-native-vector-icons/FontAwesome6';
import {TouchableWithoutFeedback} from 'react-native-gesture-handler';

const ContainerOne = ({
  image = {},
  name = '',
  description = '',
  price = '',
  onPress = () => {},
  onInfo = () => {},
  type = '',
}) => {
  return (
    <Pressable
      onPress={() => {
        onPress();
      }}
      style={{
        flexDirection: 'row',
        marginHorizontal: 20,
        elevation: 0.5,
        borderRadius: 10,
        backgroundColor: 'white',
      }}>
      <View style={{flex: 0.3, backgroundColor: 'white', height: 100}}>
        <Image
          source={{uri: image}}
          style={{
            resizeMode: 'contain',
            height: '100%',
            width: '100%',
            // borderBottomLeftRadius:10,
            // borderBottomRightRadius:10
            borderRadius: 10,
          }}
        />
      </View>
      <View style={{backgroundColor: 'white', flex: 0.7}}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginHorizontal: 10,
            marginVertical: 2,
          }}>
          <Text style={styles.text}>{name}</Text>
          <Pressable
            onPress={() => {
              onInfo();
            }}>
            <Info name="info" size={18} />
          </Pressable>
        </View>
        <Text
          style={{fontSize: 10, marginTop: 10, marginHorizontal: 25}}
          numberOfLines={2}>
          {description}
        </Text>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginHorizontal: 10,
            marginVertical: 8,
          }}>
          <Text style={{fontWeight: '800'}}>${price}</Text>
          <View style={styles.add}>
            <Text style={styles.addText}>Add</Text>
            <View
              style={{
                marginLeft: 5,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Bag name="bag-shopping" size={10} color={'#ff146c'} />
            </View>
          </View>
        </View>
      </View>
    </Pressable>
  );
};

export default ContainerOne;
