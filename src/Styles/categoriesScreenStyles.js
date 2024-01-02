import React, {useCallback, useEffect, useState} from 'react';
import {View, StyleSheet} from 'react-native';

const style = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  nonVeg: {
    flexDirection: 'row',
    width: 110,
    borderRadius: 20,
    // justifyContent: 'space-around',
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: '#f0f8ff',
    alignItems: 'center',
    marginVertical: 20,
    elevation:1,
    shadowColor:"black"
    // shadowColor:"blue"
  },
  nonVegTxt: {
    color: '#000518',
    fontWeight: '700',
    fontSize: 13,
  },
  foodimage: {
    marginHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
});
export default style;
