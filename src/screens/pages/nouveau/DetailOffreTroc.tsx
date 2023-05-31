import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { FC, useEffect, useState } from 'react'
import { api_public, colors, Product, RootState } from '../../../libs'
import { ParamListBase, useRoute } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { useSelector } from 'react-redux'

type props = { route: ReturnType<typeof useRoute>, navigation: NativeStackNavigationProp<ParamListBase, string, undefined> }
type Offre = { _id: string, images: string[], offre: string, title: String, montant?: number }


const DetailOffreTroc: FC<props> = (props) => {
    const routes: any = props?.route?.params
    const [product, setProduct] = useState<Offre>()
    const { me } = useSelector((state: RootState) => state?.user)

    useEffect(() => {
        setProduct(routes?.offre)
    }, [routes])

    return (
        <View style={{ alignItems: "center", flex: 1, backgroundColor: colors.white }}>
            <ScrollView contentContainerStyle={{ flexGrow: 1, padding: 10, alignItems: "center" }}>
                <View >
                    <View style={{ height: 240, flexDirection: "row", gap: 5, justifyContent: "center", borderBottomWidth: 0.5, borderBottomColor: colors.main_dark, paddingVertical: 5 }}>
                        <Image source={{ uri: `${api_public}/images/${product?.images[0]}` }} style={{ height: "100%", width: (product?.images && product?.images?.length === 1) ? "100%" : "80%", resizeMode: "cover" }} />
                        <View style={{ gap: 5, width: "20%", alignItems: "center" }}>
                            {product?.images && product?.images?.length > 1 && product?.images?.map((image, i) => (< Image key={i} source={{ uri: `${api_public}/images/${product?.images[i + 1]}` }} style={{ height: 60, width: 60, resizeMode: "contain" }} />))}
                        </View>
                    </View>

                    <View style={{ paddingHorizontal: 20, width: "100%" }}>
                        <Text style={{ fontSize: 18, color: colors.dark, letterSpacing: 1.5, fontWeight: "bold", marginTop: 10 }}>{product?.title}</Text>
                        {/* <Text style={{ fontSize: 16, marginVertical: 4 }}>{product?.montant && product?.montant?.toString()} fcfa</Text> */}


                        {product?.montant && product?.montant < 0 && me?._id !== routes?.product?.proprietaire && <Text style={styles.info}>Salutation! <Text style={{ color: colors.brown }}>#{routes?.proprietaireProduit},</Text>  Vous devez ajouter <Text style={{ color: colors.main, fontSize: 18 }}>{product?.montant * -1} fcfa</Text> sur votre produit  pour pouvoir le troquer avec le mien.</Text>}
                        {product?.montant && product?.montant > 0 && me?._id !== routes?.product?.proprietaire && <Text style={styles.info}>Je rajoute <Text style={{ color: colors.main, fontSize: 18 }}>{product?.montant} fcfa </Text>sur ce produit pour l'echanger avec le votre.</Text>}

                        {/* pour le proprietaire du produit */}
                        {(product?.montant && product?.montant < 0 && me?._id === routes?.product?.proprietaire) && <Text style={styles.info}><Text style={{ color: colors.brown }}>#{routes?.offrantName}</Text> propose ce produit; mais vous devez ajouter un montant de <Text style={{ color: colors.main }}>{product?.montant * -1} fcfa</Text> sur votre produit pour pouvoir échanger ce <Text style={{ color: colors.warning, textDecorationLine: "underline" }}>"{product?.title}"</Text> avec le votre.</Text>}
                        {(product?.montant && product?.montant > 0 && me?._id === routes?.product?.proprietaire) && <Text style={styles.info}><Text style={{ color: colors.brown }}>#{routes?.offrantName}</Text> propose ce produit + un montant de <Text style={{ color: colors.main }}>{product?.montant}  fcfa </Text> pour l'echanger avec le votre.</Text>}


                        <Text style={{ fontSize: 17, marginTop: 15, color: colors.dark }}>Details de l'offre</Text>
                        <Text style={{ textAlign: "justify", fontSize: 13 }}>{product?.offre}</Text>
                    </View>
                </View>
            </ScrollView>

            <View style={{ gap: 10, position: "absolute", bottom: 10, flexDirection: "row", alignItems: "center", backgroundColor: colors.white }}>
                <TouchableOpacity style={{ width: "35%", padding: 15, backgroundColor: colors.danger }}>
                    <Text style={{ color: colors.white, textAlign: "center" }}>Refuser l'offre</Text>
                </TouchableOpacity>

                <TouchableOpacity style={{ width: "60%", padding: 15, backgroundColor: colors.main_dark }}>
                    <Text style={{ color: colors.white, textAlign: "center" }}>Accepter l'offre</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

export default DetailOffreTroc

const styles = StyleSheet.create({
    info: { fontSize: 10, fontStyle: "italic" },
})