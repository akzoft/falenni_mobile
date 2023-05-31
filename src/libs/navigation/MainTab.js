import { StyleSheet } from 'react-native'
import React, { useEffect } from 'react'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
import FontAwesome5Brands from 'react-native-vector-icons/FontAwesome5Pro'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import Fontisto from 'react-native-vector-icons/Fontisto'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { Favoris } from '../../screens'
import { NavigationContainer } from '@react-navigation/native'
import { colors } from '../constants/typography'
import AuthStack from './stack/AuthStack'
import { Header } from '../../components'
import ProfilStack from './stack/ProfilStack'
import { useDispatch } from 'react-redux'
import { authentification } from '../redux/actions/user.action'
import NewProductStack from './stack/NewProductStack'
import { all_products } from '../redux/actions/product.action'
import MagasinStack from './stack/MagasinStack'
import HomeStack from './stack/HomeStack'
import FavorisStack from './stack/FavorisStack'

const MainTab = () => {
    const tab = createBottomTabNavigator()
    const dispatch = useDispatch();


    useEffect(() => {
        dispatch(authentification())
        dispatch(all_products())
    }, [dispatch])

    return (
        <NavigationContainer>
            <tab.Navigator screenOptions={{ tabBarActiveTintColor: colors.main, tabBarInactiveTintColor: colors.dark, tabBarHideOnKeyboard: true, header: (() => <Header />) }}>
                <tab.Screen name='Acceuil' component={HomeStack} listeners={({ navigation, route }) => ({ tabPress: () => navigation.navigate(route.name) })} options={{ tabBarIcon: ({ focused }) => <FontAwesome5 name='exchange-alt' size={24} color={focused ? colors.main : colors.dark} /> }} />
                <tab.Screen name='Magasin' component={MagasinStack} listeners={({ navigation, route }) => ({ tabPress: () => navigation.navigate(route.name) })} options={{ tabBarIcon: ({ focused }) => <FontAwesome5Brands name="shopify" size={24} color={focused ? colors.main : colors.dark} /> }} />
                <tab.Screen name='Nouveau' component={NewProductStack} listeners={({ navigation, route }) => ({ tabPress: () => navigation.navigate(route.name) })} options={{ tabBarIcon: ({ focused }) => <FontAwesome5 name="plus-circle" size={24} color={focused ? colors.main : colors.dark} /> }} />
                <tab.Screen name='Favoris' component={FavorisStack} listeners={({ navigation, route }) => ({ tabPress: () => navigation.navigate(route.name) })} options={{ tabBarIcon: ({ focused }) => <Fontisto name="heart" size={24} color={focused ? colors.main : colors.dark} /> }} />
                <tab.Screen name='Profil' component={ProfilStack} listeners={({ navigation, route }) => ({ tabPress: () => navigation.navigate(route.name) })} options={{ tabBarLabel: "Moi", tabBarIcon: ({ focused }) => <FontAwesome name="user" size={24} color={focused ? colors.main : colors.dark} />, headerShown: false }} />

                <tab.Screen name='auth' component={AuthStack} options={{ tabBarItemStyle: { display: "none" }, tabBarStyle: { display: "none" }, headerShown: false, tabBarIcon: ({ focused }) => <FontAwesome name="user" size={24} color={focused ? colors.main : colors.dark} /> }} />
            </tab.Navigator>
        </NavigationContainer>

    )
}

export default MainTab

const styles = StyleSheet.create({})