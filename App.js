import { StatusBar } from 'react-native'
import React, { useEffect } from 'react'
import { MainTab, Store, colors } from './src/libs'
import { Provider } from 'react-redux'
import SplashScreen from 'react-native-splash-screen'


const App = () => {

  useEffect(() => {
    SplashScreen.hide()
  }, [])

  return (
    <>
      <StatusBar barStyle={"light-content"} backgroundColor={colors.main} />
      <Provider store={Store}><MainTab /></Provider >
    </>
  )
}

export default App
