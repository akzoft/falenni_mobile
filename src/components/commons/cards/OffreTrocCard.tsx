import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { FC } from 'react'
import { RootState, User, api_public, colors } from '../../../libs'
import { useSelector } from 'react-redux';
import moment from 'moment';
import { useNavigation } from '@react-navigation/native';

interface Offres {
    user: any;
    title: String;
    offre: String;
    montant: Number;
    images: any;
    date: Date;
    choice: any;
}

const OffreTrocCard: FC<any> = ({ offre, product }) => {
    const navigation = useNavigation<any>()
    const { users, me } = useSelector((state: RootState) => state?.user)
    const name = users?.find((user: User) => (user?._id === offre?.user))?.name
    const phone = users?.find((user: User) => (user?._id === offre?.user && user?.phone))?.phone
    const proprietaireProduit = users?.find((user: User) => (user?._id === product?.proprietaire))?.name


    const handleDisplayOffer = () => {
        navigation.navigate("detail_offre_troc", { offre, proprietaireProduit, offrantName: name, product })
    }

    return (
        <TouchableOpacity onPress={handleDisplayOffer} style={styles.container}>
            {me?._id === product?.proprietaire && <Text style={styles.info}>Offre de <Text style={{ color: colors.warning, textDecorationLine: "underline" }}>{name}</Text></Text>}
            <View style={styles.content}>
                <View style={{ width: 120, borderRightWidth: 0.5, borderRightColor: colors.main_light }}>
                    <Image source={{ uri: `${api_public}/images/${offre?.images[0]}` }} style={styles.image} />
                </View>
                <View style={styles.infos} >
                    <Text style={styles.title}>{offre?.title}</Text>
                    {offre?.montant && offre?.montant > 0 ?
                        <Text style={styles.montant}>+{offre?.montant} fcfa</Text> :
                        <Text style={styles.montant}>{offre?.montant} fcfa</Text>
                    }

                    <View style={styles.phone}><Text style={{ fontSize: 12 }}>Nom: {name && name}</Text></View>
                    <View style={styles.phone}><Text style={{ fontSize: 12 }}>Contact: {phone && phone}</Text></View>
                    <View style={{ flexDirection: "row", position: "absolute", bottom: 10, right: 0 }}>
                        <Text style={[styles.date, { fontWeight: "bold" }]}>Proposer le: </Text>
                        <Text style={[styles.date, { color: colors.brown }]}>{moment(offre?.date).format('DD/MM/YYYY')}</Text>
                    </View>
                </View>
            </View>

            {/* pour les personnes ayant fait l'offres */}
            {(offre?.montant < 0 && me?._id !== product?.proprietaire) && <Text style={styles.info}>Salutation! <Text style={{ color: colors.brown }}>#{proprietaireProduit},</Text> Vous devez ajouter <Text style={{ color: colors.main }}>{offre?.montant * -1} fcfa</Text> sur votre produit pour pouvoir le troquer avec le mien.</Text>}
            {(offre?.montant > 0 && me?._id !== product?.proprietaire) && <Text style={styles.info}>Salutation! <Text style={{ color: colors.brown }}>#{proprietaireProduit},</Text> Je rajoute <Text style={{ color: colors.main }}>{offre?.montant}  fcfa </Text>sur mon produit pour l'echanger avec le votre.</Text>}

            {/* pour le proprietaire du produit */}
            {(offre?.montant < 0 && me?._id === product?.proprietaire) && <Text style={styles.info}>Salutation! <Text style={{ color: colors.brown }}>#{name}</Text> propose ce produit; mais vous devez ajouter un montant de <Text style={{ color: colors.main }}>{offre?.montant * -1} fcfa</Text> sur votre produit pour pouvoir l'échanger ce <Text style={{ color: colors.warning, textDecorationLine: "underline" }}>"{offre?.title}"</Text> avec le votre.</Text>}
            {(offre?.montant > 0 && me?._id === product?.proprietaire) && <Text style={styles.info}>Salutation! <Text style={{ color: colors.brown }}>#{name}</Text> propose ce produit + un montant de <Text style={{ color: colors.main }}>{offre?.montant}  fcfa </Text> pour l'echanger avec le votre.</Text>}

        </TouchableOpacity>
    )
}

export default OffreTrocCard

const styles = StyleSheet.create({
    container: { backgroundColor: colors.main_card, marginVertical: 3, width: "100%", borderWidth: 0.5, borderColor: colors.main_light },
    image: { height: 120, width: 120, resizeMode: "cover" },
    content: { flexDirection: "row", gap: 3, height: 120 },
    title: { fontSize: 18, color: colors.dark, letterSpacing: 1 },
    montant: { fontSize: 16, color: colors.danger },
    date: { fontSize: 10, },
    info: { fontSize: 10, fontStyle: "italic" },
    infos: { width: "65%", },
    phone: { flexDirection: "row", alignItems: "center", gap: 3, },
})