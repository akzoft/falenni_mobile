import React from 'react';
import { View, Image } from 'react-native';
import Swiper from 'react-native-swiper';
import { Colors, colors, images } from '../../libs';

const CustSwiper = ({ data }) => {

  return (
    <View style={{ flex: 1, borderBottomWidth: 1, borderBottomColor: 'rgba(0,0,0,0.15)' }}>
      <Swiper autoplay={true} activeDotStyle={{ backgroundColor: colors.main }}>
        {data.map(item => (
          <View key={item.id} style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Image source={item.image} style={{ width: '100%', height: '100%', resizeMode: 'cover' }} />
          </View>
        ))}
      </Swiper>
    </View>
  );
};

export default CustSwiper;
