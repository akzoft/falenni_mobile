import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons"
import Foundation from "react-native-vector-icons/Foundation"
import Entypo from "react-native-vector-icons/Entypo"
import { api_public, categorieDisplay, colors, dislikes, images, likes } from '../../../libs'
import { useNavigation } from '@react-navigation/native'
import { useDispatch, useSelector } from 'react-redux'


const MagasinCard = ({ product }) => {
    const navigation = useNavigation()
    const [click, setclick] = useState(false)
    const dispatch = useDispatch();
    const { me } = useSelector(state => state?.user)

    // useEffect(() => {
    //     if (product?.likes?.includes(me?._id)) setclick(true); else setclick(false);
    // }, [product])


    const handleOffer = () => {
        navigation.navigate("detail_du_produit", { product, openOffres: true })
        dispatch({ type: "reset_temp" })
        dispatch({ type: "reset_p_variable" })
    }


    const handleLike = () => {
        if (product?.proprietaire !== me?._id) {
            if (click) dispatch(likes({ me: me?._id, id: product?._id }))
            else dispatch(dislikes({ me: me?._id, id: product?._id }))
            setclick(!click)

        }
    }

    const handleDetail = () => {
        navigation.navigate("detail_du_produit", { product })
        dispatch({ type: "reset_temp" })
        dispatch({ type: "reset_p_variable" })
    }


    return (
        <View activeOpacity={0.6} style={styles.container}>
            <TouchableOpacity onPress={handleDetail} style={styles.imagebox}><Image source={{ uri: `${api_public}/images/${product?.images[0]}` }} style={styles.image} /></TouchableOpacity>
            <View style={styles.cardinfo}>
                <TouchableOpacity onPress={handleDetail} style={{ flexDirection: "row", justifyContent: "space-between" }}>
                    <View>
                        <Text style={styles.title}>{product?.title?.slice(0, 18)}{product?.length > 18 && "..."}</Text>
                        <Text style={styles.categorie}>{categorieDisplay(product?.categories, " | ")}</Text>
                        {product?.conditions?.vendre && <Text style={[styles.typevendre, { textAlign: "left" }]}>{product?.etat}</Text>}

                    </View>
                    {product?.conditions?.vendre ? <View>
                        <Text style={styles.typeprix}>A vendre</Text>
                        <Text style={styles.typevendre}>Prix {product?.prix?.fixe ? "fixe" : product?.prix?.negociation && "negociable"}</Text>
                        <Text style={styles.prix}>{product?.valeurMarchande} fcfa</Text>
                    </View> : product?.conditions?.troc &&
                    <View>
                        <Text style={styles.typeprix}>A Troquer (échanger)</Text>
                        <Text style={styles.typevendre}>{product?.etat}</Text>
                    </View>
                    }
                </TouchableOpacity>

                <View>
                    <Text style={[styles.dispo, { textDecorationLine: !product?.available ? "line-through" : "none" }]}>Disponible</Text>

                    <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                        <View style={{ flexDirection: "row", gap: 2 }}>
                            <Entypo name="location" size={16} color={colors.dark} />
                            <Text style={{ fontSize: 12, color: colors.dark }}>Kalaban Coro</Text>
                        </View>
                        <View style={{ flexDirection: "row", alignSelf: "flex-end", gap: 20, zIndex: 1000 }}>
                            <TouchableOpacity onPress={handleOffer} style={styles.social}><View><MaterialCommunityIcons name="offer" size={25} color={colors.main} /></View><Text style={{ position: "absolute", right: 0, top: -3, fontSize: 10, color: colors.main }}>{product?.offres?.length}</Text></TouchableOpacity>
                            <TouchableOpacity onPress={handleLike} style={styles.social}><View><Foundation name="like" size={25} color={colors.main} /></View><Text style={{ position: "absolute", right: 0, top: -3, fontSize: 10, color: colors.main }}>{product?.likes?.length}</Text></TouchableOpacity>
                            <TouchableOpacity style={styles.social}><View><Foundation name="comments" size={25} color={colors.main} /></View><Text style={{ position: "absolute", right: 0, top: -10, fontSize: 10, color: colors.main }}>{product?.comments?.length}</Text></TouchableOpacity>
                        </View>
                    </View>
                </View>
            </View>
        </View >
    )
}

export default MagasinCard

const styles = StyleSheet.create({
    container: { borderRadius: 5, backgroundColor: colors.main_card, borderWidth: 0.5, borderColor: colors.main_light, marginVertical: 5 },
    imagebox: { height: 220, width: "100%" },
    image: { width: "100%", height: "100%", borderTopRightRadius: 5, borderTopLeftRadius: 5 },
    cardinfo: { padding: 5 },
    title: { fontSize: 17, fontWeight: 200, letterSpacing: 1, color: colors.dark },
    categorie: { color: colors.brown, fontSize: 8 },
    social: { zIndex: 20, width: 30, height: 30, alignItems: "center", justifyContent: "center" },
    typeprix: { fontSize: 14, textAlign: "right", color: colors.dark },
    typevendre: { fontSize: 12, textAlign: "right", color: colors.dark },
    prix: { fontSize: 14, textAlign: "right", color: colors.warning },
    dispo: { fontSize: 13, color: colors.danger }
})