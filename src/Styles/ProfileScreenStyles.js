import React, {useCallback, useEffect, useState} from 'react';
import {View, StyleSheet} from 'react-native';

const style = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  loginButton: {
    backgroundColor: '#ff146c',
    borderRadius: 25,
    marginHorizontal: 30,
    marginTop: 20,
    elevation: 2,
  },
  loginButtonText: {
    color: 'white',
    fontSize: 14,
    marginTop: 0,
    paddingVertical: 14,
  },
  menuText: {
    borderBottomWidth: 0,
    borderBottomColorL:"red",
    marginTop: 15,
    marginHorizontal: 15,
  },
});
export default style;
