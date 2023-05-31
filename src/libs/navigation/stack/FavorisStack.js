import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useLayoutEffect, useState } from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { DetailOffreTroc, Details, Favoris, Filter, Magasin, Search } from '../../../screens'
import AuthStack from './AuthStack'
import { getFocusedRouteNameFromRoute } from '@react-navigation/native'
import { check_authentification, tous_les_users } from '../../redux/actions/user.action'
import { useDispatch, useSelector } from 'react-redux'
import { isEmpty } from '../../js/functions'
import { all_products } from '../../redux/actions/product.action'

const FavorisStack = ({ route, navigation }) => {
    const stack = createNativeStackNavigator()
    const dispatch = useDispatch();
    const { me } = useSelector(state => state?.user)

    const [screen, setScreen] = useState()

    useEffect(() => {
        dispatch(check_authentification())
        dispatch(all_products())
        dispatch(tous_les_users())
    }, [dispatch, screen])

    useEffect(() => {
        if (screen === "favorite") navigation.navigate("favorite")
    }, [screen])

    useLayoutEffect(() => {
        setScreen(getFocusedRouteNameFromRoute(route))
    }, [route]);

    return (
        <stack.Navigator screenOptions={{ headerShown: false }}>
            <stack.Screen name='favorite' component={Favoris} />
            <stack.Screen name='detail_du_produit' component={Details} />
            <stack.Screen name='detail_offre_troc' component={DetailOffreTroc} />
            <stack.Screen name='search' component={Search} />
            <stack.Screen name='filter' component={Filter} />

            {isEmpty(me) && <stack.Screen name='connexion' component={AuthStack} />}
        </stack.Navigator>
    )
}

export default FavorisStack

const styles = StyleSheet.create({})