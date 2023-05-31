import { Image, StyleSheet, Text, View, ScrollView, ImageBackground, TouchableOpacity, StatusBar, Animated } from 'react-native'
import React, { useEffect, useRef } from 'react'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
import Fontisto from 'react-native-vector-icons/Fontisto'
import Ionicons from 'react-native-vector-icons/Ionicons'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons'
import { api_public, colors, deconnexion, images, toastConfig } from '../../../libs'
import { useDispatch, useSelector } from 'react-redux'
import Toast from 'react-native-toast-message';
import { useIsFocused } from '@react-navigation/native';

const Profil = ({ navigation, route }) => {
    const routes = route?.params
    const dispatch = useDispatch();
    const isFocused = useIsFocused();
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const viewRef = useRef(null);
    const { me } = useSelector(state => state?.user)

    useEffect(() => {
        if (routes?.notif && routes?.notif !== null) {
            Toast.show({ type: 'info', text1: 'Informations', text2: routes?.notif, });
            routes.notif = null
        }
    }, [routes])


    useEffect(() => {
        if (isFocused) {
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 500,
                useNativeDriver: true,
            }).start();
        } else {
            Animated.timing(fadeAnim, {
                toValue: 0,
                duration: 500,
                useNativeDriver: true,
            }).start();
        }
    }, [fadeAnim, isFocused]);

    return (
        <Animated.View ref={viewRef} style={{ opacity: fadeAnim, flex: 1 }}>
            <View style={{ zIndex: 1 }}><Toast config={toastConfig} /></View>
            <ScrollView style={styles.container}>


                <StatusBar barStyle={"light-content"} backgroundColor={colors.main} />
                <ImageBackground source={{ uri: `${api_public}/images/${me?.image}` }} style={styles.cover_container}>
                    <View style={styles.profil_container}>
                        <Image source={me?.image ? { uri: `${api_public}/images/${me?.image}` } : images.avatar} style={styles.profil} />
                    </View>
                </ImageBackground>
                <View style={{ justifyContent: "flex-end", alignItems: "flex-end", paddingHorizontal: 10 }}>
                    {me?.name && <Text style={{ fontSize: 16, color: colors.main_dark }}>{me?.name?.slice(0, 20)}{me?.name?.length > 20 && "..."}</Text>}
                    {me?.email && <Text style={{ fontSize: 10, color: colors.main_dark }}>{me?.email?.slice(0, 25)}{me?.email?.length > 25 && "..."}</Text>}
                    {me?.phone && <Text style={{ fontSize: 10, color: colors.main_dark }}>{me?.phone}</Text>}
                    {me?.adresse && <Text style={{ fontSize: 10, color: colors.main_dark }}>{me?.adresse}</Text>}
                </View>

                <View style={styles.section} />
                <View style={styles.separator} />
                <TouchableOpacity style={styles.main_content} onPress={() => navigation.navigate("modifier_le_profil")}><View style={styles.item}><FontAwesome5 name="user-edit" size={18} color={colors.main_light} /><Text style={{ color: colors.main_light }}>Modifier le profil</Text></View><FontAwesome name="angle-right" size={22} color={colors.main_light} /></TouchableOpacity>
                <View style={styles.separator} />
                <TouchableOpacity style={styles.main_content}><View style={styles.item}><Fontisto name="shopping-bag-1" size={18} color={colors.main_light} /><Text style={{ color: colors.main_light }}>Mes Operations</Text></View><FontAwesome name="angle-right" size={22} color={colors.main_light} /></TouchableOpacity>
                <View style={styles.separator} />
                <TouchableOpacity style={styles.main_content}><View style={styles.item}><MaterialIcons name='history' size={18} color={colors.main_light} /><Text style={{ color: colors.main_light }}>Historiques</Text></View><FontAwesome name="angle-right" size={22} color={colors.main_light} /></TouchableOpacity>
                <View style={styles.separator} />
                <TouchableOpacity style={styles.main_content}><View style={styles.item}><Ionicons name="ios-notifications" size={18} color={colors.main_light} /><Text style={{ color: colors.main_light }}>Notifications</Text></View><FontAwesome name="angle-right" size={22} color={colors.main_light} /></TouchableOpacity>
                <View style={styles.separator} />
                <TouchableOpacity style={styles.main_content}><View style={styles.item}><SimpleLineIcons name="screen-desktop" size={18} color={colors.main_light} /><Text style={{ color: colors.main_light }}>Thème</Text></View><FontAwesome name="angle-right" size={22} color={colors.main_light} /></TouchableOpacity>
                <View style={styles.separator} />
                <TouchableOpacity style={styles.main_content}><View style={styles.item}><FontAwesome5 name="info-circle" size={18} color={colors.main_light} /><Text style={{ color: colors.main_light }}>Support</Text></View><FontAwesome name="angle-right" size={22} color={colors.main_light} /></TouchableOpacity>
                <View style={styles.separator} />
                <TouchableOpacity style={styles.main_content}><View style={styles.item}><MaterialIcons name="security" size={18} color={colors.main_light} /><Text style={{ color: colors.main_light }}>Politique de confidentialité</Text></View><FontAwesome name="angle-right" size={22} color={colors.main_light} /></TouchableOpacity>
                <View style={styles.separator} />
                <TouchableOpacity style={styles.main_content} onPress={() => { dispatch(deconnexion()); }}><View style={styles.item}><Ionicons name="ios-power-outline" size={18} color={colors.main_light} /><Text style={{ color: colors.main_light }}>Deconnexion</Text></View><FontAwesome name="angle-right" size={22} color={colors.main_light} /></TouchableOpacity>
                <View style={styles.separator} />
                <View style={styles.section} />
            </ScrollView>
        </Animated.View>
    )
}

export default Profil

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.white },
    cover_container: { flexDirection: "row", height: 200, justifyContent: "center" },
    profil_container: { height: 150, width: 150, },
    profil: { height: "100%", width: "100%", resizeMode: "cover", borderRadius: 100, marginTop: 50, borderWidth: 1, borderColor: colors.main },
    main_content: { flexDirection: "row", justifyContent: "space-between", paddingHorizontal: 15, paddingVertical: 18, marginVertical: 2 },
    separator: { width: "100%", height: 0.4, backgroundColor: colors.main, alignSelf: "flex-end" },
    item: { flexDirection: "row", gap: 3, alignItems: "center" },
    section: { height: 50 }
})