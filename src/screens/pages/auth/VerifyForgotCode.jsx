import { Text, View, Image, ScrollView, TextInput, TouchableOpacity, Animated } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { colors, css, images, isEmpty, toastConfig, verify_recovery_code } from '../../../libs'
import OtpInputs from 'react-native-otp-textinput';
import { useDispatch, useSelector } from 'react-redux';
import Toast from 'react-native-toast-message';
import { useIsFocused } from '@react-navigation/native';


const VerifyForgotCode = ({ navigation, route }) => {
    const routes = route?.params
    const dispatch = useDispatch();
    const isFocused = useIsFocused();
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const viewRef = useRef(null);
    const [codeInputed, setCodeInputed] = useState("")
    const { code, variable, errors } = useSelector(state => state?.user)

    useEffect(() => {
        if (variable) {
            navigation.navigate("reset_password", { phone: routes?.phone })
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



    const handleConfirmCode = () => {
        const data = { code, codeInputed }
        dispatch(verify_recovery_code(data))
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
                            <TouchableOpacity><Text style={{ color: colors.main, textDecorationLine: "underline", }}>{routes?.phone}</Text></TouchableOpacity>
                        </View>

                        <View style={css.auth.form_item}>
                            <OtpInputs autoFocus={true} handleTextChange={otp => setCodeInputed(otp)} inputCount={4} tintColor={colors.main} offTintColor={"gray"} textInputStyle={css.auth.code_item} />
                        </View>

                        <TouchableOpacity style={[css.auth.button]} onPress={handleConfirmCode}><Text style={css.auth.button_text}>Vérification</Text></TouchableOpacity>




                    </View>
                    <View style={{ flexDirection: "row", gap: 5, justifyContent: "center", marginTop: 10 }}>
                        <Text>Vous n'avez pas reçu de code!</Text>
                        <TouchableOpacity onPress={() => navigation.navigate("login")}><Text style={css.auth.register}>réessayer</Text></TouchableOpacity>
                    </View>
                    <View style={css.auth.separator} />
                </ScrollView >
            </Animated.View>
        </>
    )
}

export default VerifyForgotCode