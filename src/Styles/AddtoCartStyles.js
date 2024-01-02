import React, {useCallback, useEffect, useState} from 'react';
import {View, StyleSheet} from 'react-native';

const style = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  Button: {
    padding: 10,
    width: 100,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
  },
  Text: {
    color: 'white',
    fontSize: 14,
    marginTop: 0,
    paddingVertical: 14,
  },
  sunContainer1: {
    backgroundColor: 'rgb(0, 139, 186)',
    borderTopLeftRadius: 20,
    borderBottomStartRadius: 20,
  },
  sunContainer2: {
    backgroundColor: 'rgb(0, 139, 186)',
    borderTopRightRadius: 20,
    borderBottomEndRadius: 20,
  },
});
export default style;
