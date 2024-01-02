import React from 'react';
import {View, Text, StatusBar, Image, TouchableOpacity} from 'react-native';
import {useQuery} from '@apollo/client';
import {GET_OFFRS} from '../Schemas/Schemas';

const OfferScreen = ({navigation}) => {
  const {data} = useQuery(GET_OFFRS);
  const offers = data?.getAllOffers ?? [];
  return (
    <View style={{flex: 1}}>
      <StatusBar backgroundColor={'white'} barStyle={'dark-content'} />

      <View style={{flex: 1, backgroundColor: 'white'}}>
        <View style={{marginHorizontal: 20, marginTop: 15}}>
          {offers.map((item, index) => {
            return (
              <TouchableOpacity key={index}
                style={{height: 100, width: '100%', marginVertical: 8}}
                onPress={() => {
                  navigation.navigate('offers',{
                    img:item.image,
                    id:item.id
                  });
                }}>
                <Image
                  source={{uri: item.image}}
                  style={{
                    height: '100%',
                    width: '100%',
                    borderRadius: 10,
                    resizeMode: 'contain',
                  }}
                />
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    </View>
  );
};

export default OfferScreen;
