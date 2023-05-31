import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native'
import React, { FC } from 'react'
import { colors, images } from '../../../libs'
import { useNavigation } from '@react-navigation/native'


const CategorieCard: FC<{ categorie: any }> = ({ categorie }) => {
    const navigation = useNavigation<any>()

    const handleFilter = () => {
        navigation.navigate("filter", { categorie: categorie?.item })
    }

    return (
        <TouchableOpacity onPress={handleFilter} style={{ backgroundColor: colors.main, width: 120, marginRight: 15, }}>
            <Image source={categorie?.item?.image} style={{ width: 120, height: 120, resizeMode: "cover" }} />
            <Text style={{ textAlign: "center", justifyContent: "center", textDecorationLine: "underline", padding: 4, color: colors.white }}>{categorie?.item?.title}</Text>
        </TouchableOpacity>
    )
}

export default CategorieCard

const styles = StyleSheet.create({})