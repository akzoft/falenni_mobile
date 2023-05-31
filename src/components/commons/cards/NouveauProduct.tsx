import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native'
import React, { FC } from 'react'
import Entypo from "react-native-vector-icons/Entypo"
import { api_public, colors } from '../../../libs'
import { useNavigation } from '@react-navigation/native'


const NouveauProduct: FC<any> = (props) => {
    const navigation = useNavigation<any>()
    const { product } = props

    const handleDetail = () => {
        navigation.navigate("detail_du_produit", { product: product?.item })
    }


    return (
        <TouchableOpacity onPress={handleDetail} style={{ backgroundColor: colors.dark, width: 260, marginRight: 15 }}>
            <Image source={{ uri: `${api_public}/images/${product?.item?.images[0]}` }} style={{ width: "100%", height: 160, resizeMode: "cover" }} />

            <View style={{ width: "100%", flexDirection: "row", justifyContent: "space-between", paddingHorizontal: 10 }}>
                <View>
                    <Text style={{ textDecorationLine: "underline", color: colors.white }}>{product?.item?.title}</Text>
                </View>
                <Entypo name="new" size={20} color={colors.warning} />
            </View>
            <View style={{ paddingHorizontal: 10 }}>
                {product?.item?.conditions?.troc && <Text style={{ fontSize: 10, color: colors.white }}>{"Produit à troquer"}</Text>}
                {product?.item?.conditions?.vendre &&
                    <View style={{ flexDirection: "row", justifyContent: "space-between", }}>
                        <Text style={{ fontSize: 10, color: colors.white }}>{"Produit à vendre"}</Text>
                        {product?.item?.prix?.negociation ? <Text style={{ fontSize: 10, color: colors.white }}>négociable</Text> : <Text style={{ fontSize: 10, color: colors.white }}>Prix fixe</Text>}
                    </View>
                }

                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                    <Text style={{ fontSize: 10, color: colors.white, textDecorationLine: product?.item?.available ? "none" : "line-through" }}>Disponible</Text>
                    {(product?.item?.conditions?.troc || product?.item?.prix?.negociation) && <Text style={{ color: colors.white, }}>Offres ({product?.item?.offres?.length})</Text>}
                </View>
            </View>
        </TouchableOpacity>
    )
}

export default NouveauProduct

const styles = StyleSheet.create({})