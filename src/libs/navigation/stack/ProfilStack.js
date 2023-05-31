import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useLayoutEffect, useState } from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { Modifier_le_profil, Profil } from '../../../screens'
import { useDispatch, useSelector } from 'react-redux'
import AuthStack from './AuthStack'
import { check_authentification, tous_les_users } from '../../redux/actions/user.action'
import { getFocusedRouteNameFromRoute } from '@react-navigation/native'
import { all_products } from '../../redux/actions/product.action'

const ProfilStack = ({ route, navigation }) => {
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
        if (screen === "compte") navigation.navigate("compte")
    }, [screen])

    useLayoutEffect(() => {
        setScreen(getFocusedRouteNameFromRoute(route))
    }, [route]);

    return (
        <stack.Navigator screenOptions={{ headerShown: false, }}>
            {me ? <>
                <stack.Screen name='compte' component={Profil} />
                <stack.Screen name='modifier_le_profil' component={Modifier_le_profil} />
            </> :
                <stack.Screen name='auth' component={AuthStack} />}
        </stack.Navigator>
    )
}

export default ProfilStack

const styles = StyleSheet.create({})