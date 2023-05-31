import { Animated, ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useRef } from 'react'
import { useIsFocused } from '@react-navigation/native';
import Toast from 'react-native-toast-message'
import { colors, toastConfig } from '../../../libs';
import { MagasinCard } from '../../../components';
import { useSelector } from 'react-redux';

const Magasin = () => {
    const isFocused = useIsFocused();
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const viewRef = useRef(null);
    const { products } = useSelector(state => state?.product)


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
                    <Text style={[styles.info, { marginBottom: 5 }]}>Dans cette section (Magasin), s'affiche les differents produits mise en ligne par tous nos clients. Vous pouvez utiiser la barre de recherche pour vos recherches et aussi filtrer les produits. Merci</Text>
                    {products?.length > 0 ?
                        products?.map((product, i) => (<MagasinCard key={i} product={product} />)) :
                        <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}><Text>Aucun produit trouvé.</Text></View>
                    }
                    <View style={styles.separator} />
                </ScrollView>
            </Animated.View >
        </>
    )
}

export default Magasin

const styles = StyleSheet.create({
    container: { backgroundColor: colors.white, paddingHorizontal: 10, flex: 1 },
    info: { fontSize: 10, fontStyle: "italic" },
    separator: { height: 5 }
})