import { Image, Text, View, ScrollView, TextInput, TouchableOpacity, StyleSheet, Modal, TouchableWithoutFeedback, StatusBar } from 'react-native'
import React, { useEffect, useState } from 'react'
import DatePicker from 'react-native-date-picker'
import { format } from 'date-fns'
import DocumentPicker from 'react-native-document-picker';
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons"
import { api_public, colors, css, handleChangeMobile, mise_a_jour, } from '../../../../libs'
import { useDispatch, useSelector } from 'react-redux'

const Modifier_le_profil = ({ navigation }) => {
    const dispatch = useDispatch();
    const [inputs, setInputs] = useState({ name: "", adresse: "", email: "", birthday: "" })
    const [image, setImage] = useState(null)
    const [birthday, setBirthday] = useState(new Date(new Date().getTime()))
    const [modalVisible, setModalVisible] = useState(false)
    const { me, variable } = useSelector(state => state?.user)
    const toggleModal = () => setModalVisible(!modalVisible)

    useEffect(() => {
        if (variable) {
            navigation.navigate("compte", { notif: "Votre compte a été jour." })
            dispatch({ type: "reset_variable" })
        }
    }, [variable])



    //init
    useEffect(() => {
        setInputs({ name: me?.name, adresse: me?.adresse, email: me?.email })
        if (me?.birthday) setBirthday(new Date(me?.birthday))
        setImage(me?.image)
    }, [me, variable])


    const pickImage = async () => {
        try {
            const result = await DocumentPicker.pick({ type: [DocumentPicker.types.images], });
            setImage(result[0]);
        } catch (error) {
            console.log(error);
        }
    };


    const handleUpdate = () => {

        const blob = new FormData()
        let filename = me?.image

        if (image && typeof image !== "string") {
            filename = image?.filename
            blob.append('file', image);
        }

        inputs.id = me?._id
        inputs.birthday = birthday
        inputs.image = filename;

        if (me?.image) inputs.old_img = me?.image
        if (image && typeof image !== "string")
            dispatch(mise_a_jour(inputs, blob))
        else dispatch(mise_a_jour(inputs))
    }

    return (
        <View style={[css.auth.container, { justifyContent: "center" }]}>
            <StatusBar barStyle={"light-content"} backgroundColor={colors.main} />

            <ScrollView contentContainerStyle={{ flexGrow: 1, alignItems: "center", justifyContent: "center", paddingVertical: 20 }} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps={"handled"}>
                <View style={[{ height: 150, width: 150, borderWidth: 0.5, borderRadius: 150, borderColor: colors.main }]}>
                    <TouchableOpacity onPress={pickImage} style={{ alignItems: "center", justifyContent: "center", height: "100%" }}>
                        {image && <Image source={{ uri: image?.uri || `${api_public}/images/` + image }} style={{ width: "100%", height: "100%", borderRadius: 150 }} />}
                        <MaterialCommunityIcons name="image-plus" size={32} style={{ backgroundColor: colors.main_light, color: colors.white, borderRadius: 20, padding: 10, position: "absolute", opacity: image ? 0.6 : 1 }} />
                    </TouchableOpacity>
                </View>
                <Text style={css.auth.logo_text}>Modifier vos informations</Text>

                <View style={[css.auth.forms, { width: "100%" }]}>
                    <View style={css.auth.form_item}>
                        <TextInput placeholder='Nom complet*' style={css.auth.input} value={inputs.name} onChangeText={text => handleChangeMobile('name', text, setInputs)} />
                    </View>

                    <View style={css.auth.form_item}>
                        <TextInput placeholder='Adresse' style={css.auth.input} value={inputs.adresse} onChangeText={text => handleChangeMobile('adresse', text, setInputs)} />
                    </View>

                    <View style={css.auth.form_item}>
                        <TextInput placeholder='E-mail' style={css.auth.input} value={inputs.email} onChangeText={text => handleChangeMobile('email', text, setInputs)} />
                    </View>

                    <View style={css.auth.form_item}>
                        <Text style={{ marginTop: 5 }}>Date de naissance<Text>*</Text></Text>
                        <TouchableOpacity activeOpacity={0.8} onPress={toggleModal} style={[css.auth.input, { paddingVertical: 15 }]}>
                            <TouchableWithoutFeedback >
                                <Text style={[{ color: colors.main }]}>{format(birthday, 'dd/MM/yyyy')}</Text>
                            </TouchableWithoutFeedback>
                        </TouchableOpacity>

                        <Modal visible={modalVisible} animationType="slide" transparent={true} onRequestClose={toggleModal} style={{ alignItems: "center" }}>
                            <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
                                <View style={styles.modal}>
                                    <DatePicker
                                        date={birthday}
                                        onDateChange={setBirthday}
                                        mode="date"
                                        style={{ backgroundColor: "white" }}
                                    />
                                    <TouchableOpacity onPress={toggleModal} style={[css.auth.button, { width: "75%", borderRadius: 0 }]}>
                                        <Text style={{ textAlign: "center", color: colors.white, letterSpacing: 1, fontSize: 14 }}>Selectionner</Text>
                                    </TouchableOpacity>
                                </View>
                            </TouchableWithoutFeedback>
                        </Modal>
                    </View>

                    <TouchableOpacity style={css.auth.button} onPress={handleUpdate}><Text style={css.auth.button_text}>Mettre à jour</Text></TouchableOpacity>
                </View>

                <View style={css.auth.separator} />
            </ScrollView >
        </View>
    )
}

export default Modifier_le_profil


const styles = StyleSheet.create({
    modal: { alignItems: "center", justifyContent: "center", backgroundColor: colors.overlay, height: "100%" },
})

