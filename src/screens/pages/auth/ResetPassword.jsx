import { Text, View, Image, ScrollView, TextInput, TouchableOpacity, Animated } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { css, handleChangeMobile, images, isEmpty, reset_password, toastConfig } from '../../../libs'
import { useDispatch, useSelector } from 'react-redux'
import Toast from 'react-native-toast-message';
import { useIsFocused } from '@react-navigation/native';

const ResetPassword = ({ navigation, route }) => {
    const routes = route?.params
    const isFocused = useIsFocused();
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const viewRef = useRef(null);
    const [inputs, setInputs] = useState({ password: "", confirm: "" })
    const { variable, errors } = useSelector(state => state?.user)
    const dispatch = useDispatch();

    useEffect(() => {
        if (variable) {
            navigation.navigate("login", { phone: routes?.phone })
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



    const handleResetPassword = () => {
        dispatch(reset_password({ password: inputs.password, confirm: inputs.confirm, phone: routes?.phone }))
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
                            <TextInput placeholder='Mot de passe*' style={css.auth.input} value={inputs.password} onChangeText={text => handleChangeMobile('password', text, setInputs)} />
                        </View>

                        <View style={css.auth.form_item}>
                            <TextInput placeholder='Confirmer le mot de passe*' style={css.auth.input} value={inputs.confirm} onChangeText={text => handleChangeMobile('confirm', text, setInputs)} />
                        </View>
                        <TouchableOpacity style={css.auth.button} onPress={handleResetPassword}><Text style={css.auth.button_text}>Réinitialiser</Text></TouchableOpacity>
                    </View>

                    <View style={css.auth.separator} />
                </ScrollView >
            </Animated.View>
        </>

    )
}

export default ResetPassword

