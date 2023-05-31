import { StyleSheet, Text, StatusBar, View, FlatList, ScrollView, Animated } from 'react-native'
import React, { useEffect, useRef, } from 'react'
import FontAwesome from "react-native-vector-icons/FontAwesome"
import { useSelector } from "react-redux"
import { CategorieCard, CustSwiper, NouveauProduct } from '../../../components'
import { category, colors, images } from '../../../libs'
import { useIsFocused } from '@react-navigation/native'

const Home = () => {

    const constImage = [{ id: 1, image: images.img1 }, { id: 2, image: images.img2 }, { id: 3, image: images.img3 }, { id: 4, image: images.img4 }, { id: 5, image: images.img5 }, { id: 6, image: images.img6 }]
    const { products } = useSelector(state => state?.product)

    const isFocused = useIsFocused();
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const viewRef = useRef(null);
    //animation
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
            <StatusBar barStyle={"light-content"} backgroundColor={colors.main} />
            <Animated.View ref={viewRef} style={[styles.container, { opacity: fadeAnim, flex: 1 }]}>
                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ flexGrow: 1 }}>
                    <View style={{ height: 240 }}><CustSwiper data={constImage} /></View>
                    <View style={{ marginVertical: 5, padding: 10, width: "100%" }}>
                        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}><Text style={{ fontSize: 18, color: colors.dark }}>Categories</Text><FontAwesome name='arrows-h' size={20} color={colors.danger} /></View>
                        <FlatList data={category} showsHorizontalScrollIndicator={false} keyExtractor={(item) => item?.title} horizontal renderItem={(item) => <CategorieCard categorie={item} />} />
                        <Text style={styles.info}>la liste des différentes categorie de produit. vous pouvez les cliqués pour voir les produits au même categories.</Text>
                    </View>


                    <View style={{ marginVertical: 10, padding: 10, width: "100%" }}>
                        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}><Text style={{ fontSize: 18, color: colors.dark }}>Nouveau produit</Text><FontAwesome name='arrows-h' size={20} color={colors.danger} /></View>
                        <FlatList data={products?.slice(0, 15)} showsHorizontalScrollIndicator={false} keyExtractor={(item) => item?.title} horizontal renderItem={(item) => <NouveauProduct product={item} />} />
                        <Text style={styles.info}>La liste des 15 derniers produits recemment ajoutés. vous pouvez les cliqués pour voir leur details.</Text>
                    </View>
                    <View style={styles.separator} />

                </ScrollView>
            </Animated.View >
        </>
    )
}

export default Home

const styles = StyleSheet.create({
    separator: { marginVertical: 10 },
    info: { fontSize: 10, fontStyle: "italic" }
})