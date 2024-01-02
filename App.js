/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import Navigation from './src/navigations/navigation';
import {ApolloClient, InMemoryCache, ApolloProvider} from '@apollo/client';
import FlashMessage from 'react-native-flash-message';

function App() {
  const client = new ApolloClient({
    uri: 'http://192.168.7.49:3000/graphql',
    cache: new InMemoryCache(),
  });
  return (
    <View style={Styles.Cointainer}>
      <ApolloProvider client={client}>
        <Navigation />
        <FlashMessage icon="auto" duration={3000} animated={true} />
      </ApolloProvider>
    </View>
  );
}

const Styles = StyleSheet.create({
  Cointainer: {
    flex: 1,
  },
  touch: {
    backgroundColor: 'blue',
    padding: 10,
    elevation: 5,
    width: '100%',
    marginVertical: 20,
    // borderRadius: 5,
    // marginLeft:100
  },
  paragraph: {
    textAlign: 'center',
    fontSize: 22,
    color: 'black',
    fontWeight: 'bold',
    marginTop: 20,
  },
});

export default App;
