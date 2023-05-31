import { Animated, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'
import { RootState, Product, colors } from '../../../libs'
import { SearchCard } from '../../../components'
import { useIsFocused } from '@react-navigation/native'

const Search = () => {
    const isFocused = useIsFocused();
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const viewRef = useRef(null);
    const datas: any = useSelector((state: RootState) => state?.product)


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
            {/* <View style={{ width: "100%", height: 220, padding: 10 }}>
                <TouchableOpacity >
                    <Text>Collection</Text>
                    <View style={{ width: "100%", height: 2, backgroundColor: colors.white, marginVertical: 10 }} />
                </TouchableOpacity>
                <TouchableOpacity >
                    <Text>Collection</Text>
                    <View style={{ width: "100%", height: 2, backgroundColor: colors.white, marginVertical: 10 }} />
                </TouchableOpacity>
                <TouchableOpacity >
                    <Text>Collection</Text>
                    <View style={{ width: "100%", height: 2, backgroundColor: colors.white, marginVertical: 10 }} />
                </TouchableOpacity>
                <TouchableOpacity >
                    <Text>Collection</Text>
                    <View style={{ width: "100%", height: 2, backgroundColor: colors.white, marginVertical: 10 }} />
                </TouchableOpacity>
                <TouchableOpacity >
                    <Text>Collection</Text>
                    <View style={{ width: "100%", height: 2, backgroundColor: colors.white, marginVertical: 10 }} />
                </TouchableOpacity>
            </View> */}
            <Animated.View ref={viewRef} style={[styles.container, { opacity: fadeAnim, flex: 1 }]}>
                <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={{ flexGrow: 1 }}>
                    {datas?.searchDatas?.length > 0 ?
                        <View style={{ padding: 10 }}>
                            {datas?.searchDatas?.map((product: Product, i: number) => (<SearchCard key={i} product={product} />))}
                        </View> :
                        <View style={{ flex: 1, alignItems: "center", justifyContent: "center", paddingHorizontal: 10 }}>
                            <Text style={{ textAlign: "center" }}>Aucun produit pour le moment. Veuillez ecrire dans la zone recherche pour filter les produits. Les recherches se font par <Text style={{ fontStyle: "italic", color: colors.danger }}>titre, categorie, etat, type de prix...</Text></Text>
                        </View>
                    }
                    <View style={styles.separator} />
                </ScrollView>
            </Animated.View >
        </>
    )
}

export default Search

const styles = StyleSheet.create({
    container: { backgroundColor: colors.white, flex: 1 },
    info: { fontSize: 10, fontStyle: "italic" },
    separator: { height: 50 }
})