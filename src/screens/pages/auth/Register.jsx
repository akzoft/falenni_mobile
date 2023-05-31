import { Text, View, Image, ScrollView, TextInput, TouchableOpacity, Animated } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { colors, css, handleChangeMobile, images, inscription, isEmpty, toastConfig, verifier_telephone } from '../../../libs'
import { useDispatch, useSelector } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
import { useIsFocused } from '@react-navigation/native';


const Register = ({ navigation }) => {
    const dispatch = useDispatch();
    const isFocused = useIsFocused();
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const viewRef = useRef(null);
    const [inputs, setInputs] = useState({ name: "", phone: "", password: "" })
    const { variable, code, errors } = useSelector(state => state?.user)

    useEffect(() => {
        if (variable && !isEmpty(code) && code) {
            navigation.navigate("checking_phone")
            dispatch({ type: "reset_variable" })
        }
    }, [variable])

    useEffect(() => {
        if (errors && !isEmpty(errors)) {
            Toast.show({ type: 'warning', text1: 'Informations', text2: errors, });
            dispatch({ type: "reset_errors" })
        }
    }, [errors])


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


    const handleRegister = async () => {
        try {
            await AsyncStorage.setItem("inputs", JSON.stringify(inputs))
            dispatch(verifier_telephone(inputs))
        } catch (error) {

        }
    }


    return (
        <>
            <View style={{ zIndex: 1 }}><Toast config={toastConfig} /></View>
            <Animated.View ref={viewRef} style={{ opacity: fadeAnim, flex: 1 }}>
                <ScrollView style={css.auth.container} keyboardShouldPersistTaps="handled">
                    <View style={css.auth.logo_box}>
                        <Image source={images.logo} style={css.auth.logo} />
                    </View>
                    <Text style={css.auth.logo_text}>falenni</Text>

                    <View style={css.auth.forms}>
                        <View style={css.auth.form_item}>
                            <TextInput placeholder='Nom complet*' style={css.auth.input} value={inputs.name} onChangeText={text => handleChangeMobile('name', text, setInputs)} />
                        </View>

                        <View style={css.auth.form_item}>
                            <TextInput keyboardType="phone-pad" placeholder='Numéro de téléphone*' style={css.auth.input} value={inputs.phone} onChangeText={text => handleChangeMobile('phone', text, setInputs)} />
                        </View>

                        <View style={css.auth.form_item}>
                            <TextInput placeholder='Mot de passe*' style={css.auth.input} value={inputs.password} onChangeText={text => handleChangeMobile('password', text, setInputs)} />
                        </View>

                        <TouchableOpacity style={css.auth.button} onPress={handleRegister}><Text style={css.auth.button_text}>s'inscrire</Text></TouchableOpacity>

                        <View style={css.auth.forgot}>
                            <Text>Pour toutes vos questions, veuillez-nous contacter au </Text>
                            <TouchableOpacity><Text style={{ color: colors.main, textDecorationLine: "underline", }}>+223 79 36 43 85</Text></TouchableOpacity>
                        </View>


                    </View>
                    <View style={{ flexDirection: "row", gap: 5, justifyContent: "center" }}>
                        <Text>Vous possedez déjà un compte!</Text>
                        <TouchableOpacity onPress={() => navigation.navigate("login")}><Text style={css.auth.register}>Connectez-vous</Text></TouchableOpacity>
                    </View>
                    <View style={css.auth.separator} />
                </ScrollView >
            </Animated.View>
        </>
    )
}

export default Register

