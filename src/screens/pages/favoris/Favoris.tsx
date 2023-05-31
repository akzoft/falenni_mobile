import { Animated, ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { useIsFocused } from '@react-navigation/native';
import Toast from 'react-native-toast-message'
import { Product, RootState, colors, toastConfig } from '../../../libs';
import { FavorisCard } from '../../../components';
import { useSelector } from 'react-redux';

const Favoris = () => {
    const isFocused = useIsFocused();
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const [produits, setProduits] = useState<Product[]>([])
    const viewRef = useRef(null);
    const { me } = useSelector((state: RootState) => state?.user)
    const { products } = useSelector((state: RootState) => state?.product)

    useEffect(() => {
        setProduits((products as Product[])?.filter((product: Product) => product?.proprietaire !== me?._id && product?.likes?.includes(me?._id)))
    }, [products])


    useEffect(() => {
        if (isFocused) {
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 500,
                useNativeDriver: true,
            }).start();
        } else {
            Animated.timing(fadeAnim, {
                toValue: 0,
                duration: 500,
                useNativeDriver: true,
            }).start();
        }
    }, [fadeAnim, isFocused]);

    return (
        <>
            <View style={{ zIndex: 100, }}><Toast config={toastConfig} /></View>
            <Animated.View ref={viewRef} style={[styles.container, { opacity: fadeAnim, flex: 1 }]}>
                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ flexGrow: 1 }}>
                    <Text style={[styles.info, { marginBottom: 5 }]}>Dans cette section (Favoris), s'affiche la liste differents produits que vous avez aimés. Merci</Text>
                    {produits?.length > 0 ?
                        produits?.map((product, i) => (<FavorisCard key={i} product={product} />)) :
                        <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}><Text>Aucun produit trouvé dans la liste des favoris.</Text></View>
                    }
                    <View style={styles.separator} />
                </ScrollView>
            </Animated.View >
        </>
    )
}

export default Favoris

const styles = StyleSheet.create({
    container: { backgroundColor: colors.white, paddingHorizontal: 10, flex: 1 },
    info: { fontSize: 10, fontStyle: "italic" },
    separator: { height: 5 }
})