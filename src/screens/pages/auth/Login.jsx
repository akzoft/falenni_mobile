import { Text, View, Image, ScrollView, TextInput, TouchableOpacity, Animated } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { colors, connexion, css, handleChangeMobile, images, isEmpty, isOK, toastConfig } from '../../../libs'
import { useDispatch, useSelector } from 'react-redux'
import Toast from 'react-native-toast-message'
import { useIsFocused } from '@react-navigation/native'

const Login = ({ navigation, route }) => {
    const routes = route?.params
    const isFocused = useIsFocused();
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const viewRef = useRef(null);
    const dispatch = useDispatch();
    const [inputs, setInputs] = useState({ phone: "", password: "" })
    const { variable, errors } = useSelector(state => state?.user)

    useEffect(() => {
        if (variable) dispatch({ type: "reset_variable" })
    }, [variable])

    useEffect(() => {
        if (errors && !isEmpty(errors)) {
            Toast.show({ type: 'warning', text1: 'Informations', text2: errors });
            dispatch({ type: "reset_errors" })
        }
    }, [errors])

    useEffect(() => {
        setInputs(old => { return { ...old, phone: routes?.phone } })
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


    const handleLogin = () => {
        dispatch(connexion(inputs))
        if (routes?.phone) routes.phone = null
    }

    return (
        <>
            <View style={{ zIndex: 100, }}><Toast config={toastConfig} /></View>
            <Animated.View ref={viewRef} style={{ opacity: fadeAnim, flex: 1 }}>
                <ScrollView style={css.auth.container} keyboardShouldPersistTaps="handled">
                    <View style={css.auth.logo_box}>
                        <Image source={images.logo} style={css.auth.logo} />
                    </View>
                    <Text style={css.auth.logo_text}>falenni</Text>

                    <View style={css.auth.forms}>
                        <View style={css.auth.form_item}>
                            <TextInput keyboardType="phone-pad" placeholder='Numéro de téléphone*' style={css.auth.input} value={inputs.phone} onChangeText={text => handleChangeMobile('phone', text, setInputs)} />
                        </View>

                        <View style={css.auth.form_item}>
                            <TextInput secureTextEntry={true} placeholder='Mot de passe*' style={css.auth.input} value={inputs.password} onChangeText={text => handleChangeMobile('password', text, setInputs)} />
                        </View>

                        <TouchableOpacity style={css.auth.button} onPress={handleLogin}><Text style={css.auth.button_text}>se connecter</Text></TouchableOpacity>

                        <View style={css.auth.forgot}>
                            <Text >Avez-vous oublier votre </Text>
                            <TouchableOpacity onPress={() => navigation.navigate("forgot")}><Text style={{ color: colors.main }}>mot de passe?</Text></TouchableOpacity>
                        </View>

                        <View style={css.auth.forgot}>
                            <Text>Pour toutes vos questions, veuillez-nous contacter au </Text>
                            <TouchableOpacity><Text style={{ color: colors.main, textDecorationLine: "underline", }}>+223 79 36 43 85</Text></TouchableOpacity>
                        </View>


                    </View>
                    <View style={{ flexDirection: "row", gap: 5, justifyContent: "center" }}>
                        <Text>Vous n'avez pas encore de compte?</Text>
                        <TouchableOpacity onPress={() => navigation.navigate("register")}><Text style={css.auth.register}>Inscrivez-vous</Text></TouchableOpacity>
                    </View>
                    <View style={css.auth.separator} />
                </ScrollView >
            </Animated.View>
        </>
    )
}

export default Login

