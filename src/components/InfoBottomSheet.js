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
import Cancel from 'react-native-vector-icons/MaterialIcons';

const InfoBottomSheet = ({name = '', caution = '', close = () => {}}) => {
  return (
    <View style={{backgroundColor: 'white', paddingVertical: 20}}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          backgroundColor: 'white',
          marginHorizontal: 20,
        }}>
        <Text
          style={{
            color: 'black',
            fontWeight: '800',
          }}>
          {`${name}`}
        </Text>
        <TouchableOpacity
          onPress={() => {
            close();
          }}>
          <Cancel name="cancel" size={22} color={'red'} />
        </TouchableOpacity>
      </View>
      <Text style={{marginHorizontal: 20, marginTop: 15,backgroundColor:"white"}}>{caution}</Text>
    </View>
  );
};

export default InfoBottomSheet;
