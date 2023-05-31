import { Text, View, Image, ScrollView, TextInput, TouchableOpacity, Animated } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { css, handleChangeMobile, images, isEmpty, toastConfig, verifier_forgot_telephone, verifier_telephone } from '../../../libs'
import { useDispatch, useSelector } from 'react-redux';
import Toast from 'react-native-toast-message';
import { useIsFocused } from '@react-navigation/native';


const Forgot = ({ navigation }) => {
    const dispatch = useDispatch();
    const isFocused = useIsFocused();
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const viewRef = useRef(null);
    const [inputs, setInputs] = useState({ phone: "" })
    const { variable, errors } = useSelector(state => state?.user)

    useEffect(() => {
        if (variable) {
            navigation.navigate("verify_code", { phone: inputs.phone })
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


    const handleForgot = () => {
        dispatch(verifier_forgot_telephone(inputs))
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
                            <Text style={{ textAlign: "center" }}>Un numéro de téléphone est requis pour la recuperation de votre mot de passe.</Text>
                        </View>

                        <View style={css.auth.form_item}>
                            <TextInput keyboardType="phone-pad" placeholder='Numéro de téléphone*' style={css.auth.input} value={inputs.phone} onChangeText={text => handleChangeMobile('phone', text, setInputs)} />
                        </View>

                        <TouchableOpacity style={[css.auth.button]} onPress={handleForgot}><Text style={css.auth.button_text}>confirmer</Text></TouchableOpacity>
                    </View>

                </ScrollView >
            </Animated.View>
        </>
    )
}

export default Forgot