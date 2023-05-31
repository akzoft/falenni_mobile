import { Text, View, Image, ScrollView, TextInput, TouchableOpacity, Animated } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { colors, css, handleChangeMobile, images, inscription, isEmpty, toastConfig, verifier_telephone } from '../../../libs'
import { useDispatch, useSelector } from 'react-redux'
import AsyncStorage from '@react-native-async-storage/async-storage'
import Toast from 'react-native-toast-message';
import { useIsFocused } from '@react-navigation/native'

const CheckingPhone = ({ navigation }) => {
    const dispatch = useDispatch();
    const isFocused = useIsFocused();
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const viewRef = useRef(null);
    const { me, code, variable, errors } = useSelector(state => state?.user)
    const [inputs, setInputs] = useState({ inputedCode: "" })

    useEffect(() => {
        const func = async () => {
            try {
                if (variable && me) {
                    dispatch({ type: "reset_variable" })
                    await AsyncStorage.removeItem("inputs")
                    dispatch({ type: "reset_code" })
                }
            } catch (error) {
                console.log(error)
            }
        }
        func()
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


    const handleTry = async () => {
        try {
            const raw = await AsyncStorage.getItem("inputs")

            if (!isEmpty(raw)) {
                const toStore = JSON.parse(raw)
                dispatch(verifier_telephone(toStore))
                dispatch({ type: "reset_variable" })
            }
        } catch (error) {

        }
    }

    const handleRegister = async () => {
        try {
            const raw = await AsyncStorage.getItem("inputs")

            if (!isEmpty(raw)) {
                const toStore = JSON.parse(raw)

                toStore.inputedCode = inputs.inputedCode
                toStore.code = code
                dispatch(inscription(toStore))
            }

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

                        <View style={css.auth.forgot}>
                            <Text>Un code de vérification a été envoyé au numéro</Text>
                            <TouchableOpacity><Text style={{ color: colors.main, textDecorationLine: "underline", }}>+223 79 36 43 85</Text></TouchableOpacity>
                        </View>

                        <View style={css.auth.form_item}>
                            <TextInput keyboardType="numeric" placeholder='Code de vérification*' style={css.auth.input} value={inputs.inputedCode} onChangeText={text => handleChangeMobile('inputedCode', text, setInputs)} />
                        </View>

                        <TouchableOpacity style={[css.auth.button]} onPress={handleRegister}><Text style={css.auth.button_text}>Valider votre inscription</Text></TouchableOpacity>




                    </View>
                    <View style={{ flexDirection: "row", gap: 5, justifyContent: "center", marginTop: 10 }}>
                        <Text>Vous n'avez pas reçu de code!</Text>
                        <TouchableOpacity onPress={handleTry}><Text style={css.auth.register}>réessayer</Text></TouchableOpacity>
                    </View>
                    <View style={css.auth.separator} />
                </ScrollView >
            </Animated.View>
        </>
    )
}

export default CheckingPhone