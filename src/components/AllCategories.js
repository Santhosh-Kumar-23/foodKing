import React, {useCallback, useEffect, useState, useRef} from 'react';
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
  ActivityIndicator,
} from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import styles from '../Styles/HomeScreenStyles';

const AllCategories = ({
  categories = '',
  onPress = () => {},
  image = '',
  name = '',
  index=""
}) => {
  return (
    <TouchableOpacity
      style={[styles.cat]}
      key={index}
      onPress={() => {
        onPress();
      }}>
      <Image
        source={{
          uri: `${image}`,
        }}
        style={{height: 55, width: 55, resizeMode: 'contain'}}
      />
      <Text style={styles.categoryText}>{name}</Text>
    </TouchableOpacity>
  );
};
export default AllCategories;
