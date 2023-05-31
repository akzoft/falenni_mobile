import React, { useEffect, useState } from 'react';
import { View, Image, Text } from 'react-native';
import Swiper from 'react-native-swiper';
import Fontisto from "react-native-vector-icons/Fontisto"
import { Colors, api_public, colors, images } from '../../libs';

const DetailSwiper = ({ product }) => {
  const [datas, setDatas] = useState([])
  //const data = [{ id: 1, image: images.background }, { id: 2, image: images.ok }, { id: 3, image: images.background }, { id: 4, image: images.ok }]



  useEffect(() => {
    const tab = []
    product?.images?.forEach((image, i) => {
      tab.push({ id: i, image: image })
    })
    setDatas(tab)
  }, [product])


  return (
    <View style={{ flex: 1, borderBottomWidth: 1, borderBottomColor: 'rgba(0,0,0,0.15)' }}>
      {product?.images?.length > 0 &&
        <Swiper autoplay activeDotStyle={{ backgroundColor: colors.main }} showsButtons={product?.images?.length > 1 ? true : false} nextButton={<Fontisto name='angle-right' size={26} color={colors.main} />} dotStyle={{ backgroundColor: colors.white }} prevButton={<Fontisto name='angle-left' size={26} color={colors.main} />}>
          {datas?.map(item => (
            <View key={item.id} style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
              <Image source={{ uri: `${api_public}/images/${item?.image}` }} style={{ width: '100%', height: '100%', resizeMode: 'cover' }} />
            </View>
          ))}
        </Swiper>}
    </View>
  );
};

export default DetailSwiper;
