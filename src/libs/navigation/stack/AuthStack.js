import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { CheckingPhone, Forgot, Login, Register, ResetPassword, VerifyForgotCode } from '../../../screens'

const AuthStack = () => {
    const stack = createNativeStackNavigator()
    return (
        <stack.Navigator screenOptions={{ headerShown: false, }}>
            <stack.Screen name='login' component={Login} options={{}} />
            <stack.Screen name='checking_phone' component={CheckingPhone} />
            <stack.Screen name='register' component={Register} />
            <stack.Screen name='forgot' component={Forgot} />
            <stack.Screen name='verify_code' component={VerifyForgotCode} />
            <stack.Screen name='reset_password' component={ResetPassword} />
        </stack.Navigator>
    )
}

export default AuthStack

const styles = StyleSheet.create({})