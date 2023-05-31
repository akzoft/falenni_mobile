import { StyleSheet } from 'react-native'
import React, { useEffect, useLayoutEffect, useState } from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { Details, Filter, Nouveau, Search } from '../../../screens'
import AuthStack from './AuthStack'
import { useDispatch, useSelector, } from 'react-redux'
import { check_authentification, tous_les_users } from '../../redux/actions/user.action'
import { getFocusedRouteNameFromRoute } from '@react-navigation/native'
import { all_products } from '../../redux/actions/product.action'

const NewProductStack = ({ route, navigation }) => {
    const stack = createNativeStackNavigator()
    const { me } = useSelector(state => state?.user)

    const dispatch = useDispatch();
    const [screen, setScreen] = useState()

    useEffect(() => {
        dispatch(check_authentification())
        dispatch(all_products())
        dispatch(tous_les_users())
    }, [dispatch, screen])

    useEffect(() => {
        if (screen === "nouveau_produit") navigation.navigate("nouveau_produit")
    }, [screen])

    useLayoutEffect(() => {
        setScreen(getFocusedRouteNameFromRoute(route))
    }, [route]);



    return (
        <stack.Navigator screenOptions={{ headerShown: false, }}>
            {me ? <>
                <stack.Screen name='nouveau_produit' component={Nouveau} />
                <stack.Screen name='detail_du_produit' component={Details} />
                <stack.Screen name='search' component={Search} />
                <stack.Screen name='filter' component={Filter} />
            </> :
                <stack.Screen name='auth' component={AuthStack} />}
        </stack.Navigator>
    )
}

export default NewProductStack

const styles = StyleSheet.create({})