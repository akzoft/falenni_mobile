import { ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { FC, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Product, RootState, colors } from '../../../libs'
import { FilteredCard } from '../../../components'

const Filter: FC<any> = ({ route }) => {
    const routes = route?.params
    const { products } = useSelector((state: RootState) => state?.product)
    const [produits, setProduits] = useState<Product[]>([])

    useEffect(() => {
        setProduits((products as Product[])?.filter((product: Product) => product?.categories?.includes(routes?.categorie?.title)) || []);
    }, [products])


    return (
        <View style={{ flex: 1, backgroundColor: colors.white, padding: 10 }}>
            <View style={{ marginVertical: 10 }}>
                {produits?.length > 0 && <Text>Résultat(s) du filtrage de : <Text style={{ color: colors.brown }}>{routes?.categorie?.title}</Text></Text>}
            </View>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ flexGrow: 1 }}>
                {produits?.length > 0 ?
                    produits?.map((product, i) => (
                        <FilteredCard key={i} product={product} />
                    )) :
                    <View style={{ flex: 1, height: "100%", alignItems: "center", justifyContent: "center" }}>
                        <Text>Aucun resultat trouvé pour le filtrage du mot:</Text>
                        <Text style={{ color: colors.brown, fontStyle: "italic", textDecorationLine: "underline" }}>{routes?.categorie?.title}</Text>
                    </View>
                }
            </ScrollView>
        </View>
    )
}

export default Filter

const styles = StyleSheet.create({})