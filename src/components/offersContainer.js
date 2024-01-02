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

const OffersContainer = ({onPress = () => {}, image = ''}) => {
  return (
    <View style={{elevation: 5}}>
      <TouchableOpacity
        style={{
          height: 100,
          width: '100%',
          marginVertical: 8,
          elevation: 10,
        }}
        onPress={() => {
          onPress();
        }}>
        <Image
          source={{uri: image}}
          style={{
            height: '100%',
            width: '100%',
            borderRadius: 10,
            resizeMode: 'contain',
          }}
        />
      </TouchableOpacity>
    </View>
  );
};
export default OffersContainer;
