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

const ContainerTwo = ({
  image = {},
  name = '',
  description = '',
  price = '',
  onInfo = () => {},
  onPress = () => {},
}) => {
  return (
    <Pressable
      style={[styles.featuredContainer, {backgroundColor: 'white'}]}
      onPress={() => {
        onPress();
      }}>
      <View style={{height: 95, width: '100%'}}>
        <Image
          source={{
            uri: `${image}`,
          }}
          style={styles.featuredImag}
        />
      </View>
      <View style={styles.imgSub}>
        <View style={{backgroundColor: 'white', flex: 0.9}}>
          <Text style={styles.text}>{name}</Text>
        </View>

        <Pressable
          style={styles.info}
          onPress={() => {
            onInfo();
          }}>
          <Info name="info" size={18} />
        </Pressable>
      </View>
      <Text
        style={{fontSize: 10, marginTop: 5, marginHorizontal: 5}}
        numberOfLines={2}>
        {description}
      </Text>
      <View style={styles.price}>
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
    </Pressable>
  );
};

export default ContainerTwo;
