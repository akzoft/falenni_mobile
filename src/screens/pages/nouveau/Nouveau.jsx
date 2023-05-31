import { Animated, StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView, Image, TouchableWithoutFeedback } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { useIsFocused } from '@react-navigation/native';
import Toast from 'react-native-toast-message'
import { catgs, colors, creation_produit, etatProduit, handleChangeMobile, isEmpty, isImage, toastConfig } from '../../../libs';
import { MultipleSelectList, SelectList } from 'react-native-dropdown-select-list';
import { CheckBox } from 'react-native-elements';
import DocumentPicker from 'react-native-document-picker'
import Dialog from "react-native-dialog";
import { useDispatch, useSelector } from 'react-redux';

const Nouveau = ({ navigation }) => {
    const dispatch = useDispatch();
    const isFocused = useIsFocused();
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const viewRef = useRef(null);
    const init = { title: "", images: [], conditions: "", categories: [], etat: "", description: "", valeurMarchande: "", montantNegociation: "", proprietaire: "" }
    const [inputs, setInputs] = useState(init)
    const [images, setImages] = useState([])
    const [categories, setCategories] = useState([])
    const [etat, setEtat] = useState()
    const [prix, setPrix] = useState({ fixe: true, negociation: false })
    const [conditions, setConditions] = useState({ troc: true, vendre: false })
    const [add, setAdd] = useState(false)
    const [visible, setVisible] = useState(false);
    const [error, setError] = useState()
    const [index, setIndex] = useState()
    const { errors, temp, p_variable } = useSelector(state => state?.product)
    const { me } = useSelector(state => state?.user)


    //animation
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

    useEffect(() => {
        if (conditions.troc) setPrix({ fixe: false, negociation: false })
    }, [conditions])


    useEffect(() => {
        if (errors && !isEmpty(errors)) {
            Toast.show({ type: 'warning', text1: 'Informations', text2: errors });
            dispatch({ type: "reset_product_errors" })
        }
        if (error) {
            Toast.show({ type: 'warning', text1: 'Informations', text2: error });
            setError("")
        }
    }, [errors, error])

    useEffect(() => {
        if (temp) {
            handleCancel()
            navigation.navigate("detail_du_produit", { product: p_variable })
            dispatch({ type: "reset_temp" })
            dispatch({ type: "reset_p_variable" })
        }
        dispatch({ type: "reset_temp" })
        dispatch({ type: "reset_p_variable" })
    }, [temp, p_variable, navigation, dispatch])


    // gestion upload image
    async function pickMultiple() {
        try {
            const results = await DocumentPicker.pickMultiple({ type: [DocumentPicker.types.images] });
            const filesToAdd = [];
            for (const result of results) {
                if (images.length + filesToAdd.length >= 4) {
                    break;
                }
                if (isImage(result)) {
                    filesToAdd.push(result);
                }
            }
            setImages([...images, ...filesToAdd]);
        } catch (err) {
            if (DocumentPicker.isCancel(err)) {
                console.log('User cancelled document picker');
            } else {
                console.error('Error picking multiple files:', err);
            }
        }
    }

    function switchImage(index) {
        DocumentPicker.pick({ type: [DocumentPicker.types.images] })
            .then((newImage) => {
                if (newImage) {
                    setImages(prevImages => {
                        const updatedImages = [...prevImages];
                        updatedImages[index] = newImage[0];
                        return updatedImages;
                    });
                }
                setVisible(false);
            })
            .catch((error) => {
                console.log('Error picking image:', error);
            });
        setVisible(false);
    }

    const removeImage = (index) => {
        images?.splice(index, 1)
        setVisible(false)
    }

    const showDialog = (index) => {
        setVisible(true);
        setIndex(index)
    };


    //annuler la creation
    const handleCancel = () => {
        setInputs(init)
        setPrix({ fixe: true, negociation: false })
        setImages([])
        setCategories([])
        setConditions({ troc: true, vendre: false })
        setAdd(false)
    }

    //creer un produit
    const handleCreate = () => {
        inputs.categories = categories
        inputs.conditions = conditions
        inputs.prix = prix
        inputs.etat = etat
        inputs.proprietaire = me?._id


        // inputs.images = images
        if (images?.length > 0) {
            let blob = new FormData()

            for (const image of images) {
                blob.append('file', image)
            }
            inputs.blob = blob
            dispatch(creation_produit(inputs))
        } else setError("Le choix d'au moins une image est obligatoire")


    }

    return (
        <>
            <View style={{ zIndex: 100, }}><Toast config={toastConfig} /></View>
            <Animated.View ref={viewRef} style={[styles.container, { opacity: fadeAnim, flex: 1 }]}>
                <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                    {add ? <View style={styles.forms}>
                        <View style={{ height: 20 }} />
                        <View>
                            <Text>Uploader des images <Text style={styles.required}>*</Text></Text>
                        </View>
                        <View style={[styles.form_item, styles.input, { paddingLeft: 0, gap: 10 }]}>

                            <TouchableOpacity onPress={pickMultiple} style={[styles.input, styles.uploadbtn]}><Text style={[styles.info, { color: colors.white }]}>Cliquer ici pour:</Text><Text style={{ color: colors.white }}>Uploader des images</Text><Text style={{ color: colors.white }}>Max: 4 images</Text></TouchableOpacity>

                            {images?.length > 0 &&
                                <View style={{ gap: 10 }}>
                                    <View style={styles.imagebox}>
                                        {images?.length >= 1 && <TouchableOpacity onPress={() => showDialog(0)} style={styles.image}><Image source={{ uri: images[0]?.uri }} style={{ width: "100%", height: "100%", resizeMode: "cover" }} /></TouchableOpacity>}
                                        {images?.length >= 2 && <TouchableOpacity onPress={() => showDialog(1)} style={styles.image}><Image source={{ uri: images[1]?.uri }} style={{ width: "100%", height: "100%", resizeMode: "cover" }} /></TouchableOpacity>}
                                    </View>
                                    <View style={styles.imagebox}>
                                        {images?.length >= 3 && <TouchableOpacity onPress={() => showDialog(2)} style={styles.image}><Image source={{ uri: images[2]?.uri }} style={{ width: "100%", height: "100%", resizeMode: "cover" }} /></TouchableOpacity>}
                                        {images?.length >= 4 && <TouchableOpacity onPress={() => showDialog(3)} style={styles.image}><Image source={{ uri: images[3]?.uri }} style={{ width: "100%", height: "100%", resizeMode: "cover" }} /></TouchableOpacity>}
                                    </View>
                                </View>}
                        </View>

                        <TouchableWithoutFeedback onPress={() => setVisible(false)} >
                            <Dialog.Container onBackdropPress={() => setVisible(false)} visible={visible} contentStyle={{ justifyContent: "center", alignItems: "center" }}>
                                <Dialog.Title style={{ width: "100%" }}>Choisissez une action</Dialog.Title>
                                <Dialog.Description>
                                    <View style={{ width: "100%", gap: 10, justifyContent: "center", alignItems: "center" }}>
                                        <Dialog.Button onPress={() => switchImage(index)} label="Remplacer l'image" style={{ width: "90%", color: colors.white, backgroundColor: colors.main_dark, paddingHorizontal: 15 }} />
                                        <Dialog.Button onPress={() => removeImage(index)} label="Supprimer l'image" style={{ width: "90%", color: colors.white, backgroundColor: colors.danger, paddingHorizontal: 15 }} />
                                    </View>

                                </Dialog.Description>

                            </Dialog.Container>
                        </TouchableWithoutFeedback>


                        <View style={styles.form_item}>
                            <Text style={styles.label}>Titre <Text style={styles.required}>*</Text></Text>
                            <TextInput placeholder='' style={styles.input} value={inputs.title} onChangeText={text => handleChangeMobile('title', text, setInputs)} />
                        </View>

                        <View style={styles.form_item}>
                            <Text style={styles.label}>Conditions <Text style={styles.required}>*</Text></Text>
                            <View style={[styles.input, { padding: 10, alignItems: "center", justifyContent: "center", flexGrow: 1 }]}>
                                <Text style={{ fontSize: 10, fontStyle: "italic" }}>Vous pouvez switcher entre le troc(échange) et la vente de votre produit. La vente requiert la selection des prix selon le choix (fixe et negociable).</Text>
                                <View style={{ flexDirection: "row", justifyContent: "space-between", width: "100%", paddingTop: 5 }}>
                                    <View style={styles.checkbox}>
                                        <CheckBox title={"Troc"} size={16} checked={conditions.troc} onPress={() => setConditions({ troc: true, vendre: false })} />
                                    </View>
                                    <View style={{ width: 0.5, height: "70%", backgroundColor: colors.main_light }} />

                                    <View style={[styles.checkbox, { alignItems: "center" }]}>
                                        <CheckBox title={"A vendre"} size={16} checked={conditions.vendre} onPress={() => setConditions({ troc: false, vendre: true })} />
                                        {conditions.vendre &&
                                            <>
                                                <Text>Etat du prix du produit</Text>
                                                <View style={{ flexDirection: "row" }}>
                                                    <CheckBox title={"Fixe"} size={16} checked={prix.fixe} onPress={() => setPrix({ fixe: true, negociation: false })} />
                                                    <CheckBox title={"Negociable"} size={16} checked={prix.negociation} onPress={() => setPrix({ fixe: false, negociation: true })} />
                                                </View>
                                            </>}
                                    </View>
                                </View>

                                {conditions.vendre && prix.negociation ?
                                    <>
                                        <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
                                            <TextInput placeholder='Valeur marchande' style={[styles.input, { width: "55%" }]} value={inputs.valeurMarchande} onChangeText={text => handleChangeMobile('valeurMarchande', text, setInputs)} />
                                            <TextInput placeholder='Montant négociation' style={[styles.input, { width: "45%" }]} value={inputs.montantNegociation} onChangeText={text => handleChangeMobile('montantNegociation', text, setInputs)} />
                                        </View>
                                        <Text style={styles.info}>Le montant de négociation augmentera ou diminuera la valeur marchande pendant la négociation.</Text>
                                    </>
                                    :
                                    conditions.vendre && prix.fixe &&
                                    <TextInput placeholder='Valeur marchande' style={[styles.input, { width: "100%" }]} value={inputs.valeurMarchande} onChangeText={text => handleChangeMobile('valeurMarchande', text, setInputs)} />
                                }
                            </View>
                        </View>

                        <View style={styles.form_item}>
                            <Text style={styles.label}>Categorie <Text style={styles.required}>*</Text></Text>
                            <MultipleSelectList
                                setSelected={(val) => setCategories(val)}
                                data={catgs}
                                save="value"
                                label="Categories"
                                searchPlaceholder='Rechercher...'
                                placeholder='Choisir au max 3 categories'
                                checkBoxStyles={{ borderColor: colors.main_light }}
                                inputStyles={{ color: colors.main }}
                                labelStyles={{ color: colors.main_light }}
                                dropdownTextStyles={{ color: colors.main_light }}
                                dropdownStyles={{ borderWidth: 0.5, borderColor: colors.main_light }}
                                boxStyles={{ borderWidth: 0.5, borderColor: colors.main_light, }}
                            />
                        </View>

                        <View style={styles.form_item}>
                            <Text style={styles.label}>Etats du produit <Text style={styles.required}>*</Text></Text>
                            <SelectList
                                setSelected={(val) => setEtat(val)}
                                data={etatProduit}
                                save="value"
                                search={false}
                                placeholder='Selectionner un état'
                                inputStyles={{ color: colors.main }}
                                labelStyles={{ color: colors.main_light }}
                                dropdownTextStyles={{ color: colors.main_light }}
                                dropdownStyles={{ borderWidth: 0.5, borderColor: colors.main_light }}
                                boxStyles={{ borderWidth: 0.5, borderColor: colors.main_light, }}
                            />
                        </View>

                        <View style={styles.form_item}>
                            <Text style={styles.label}>Description <Text style={styles.required}>*</Text></Text>
                            <TextInput placeholder='' multiline={true} style={[styles.input, { height: 150 }]} value={inputs.description} onChangeText={text => handleChangeMobile('description', text, setInputs)} />
                        </View>


                    </View> :
                        <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
                            <Text style={{ fontWeight: 100, letterSpacing: 1.5, fontSize: 9, fontStyle: "italic" }}>Cliquer pour:</Text>
                            <TouchableOpacity onPress={() => setAdd(true)} style={{ backgroundColor: colors.main_light, padding: 15, borderRadius: 5 }}><Text style={{ color: colors.white }}>Ajouter un nouveau produit</Text></TouchableOpacity>
                        </View>
                    }

                    {add && <View style={{ paddingHorizontal: 10 }}><Text style={{ fontSize: 10, fontStyle: "italic" }}>Les produits que vous publier se veront analyser par notre équipe de avant d'être publier. Merci de verifier dans un instant après la creation de votre produit. Merci</Text></View>}
                    <View style={{ height: 100 }} />
                </ScrollView>

                {add &&
                    <View style={{ position: "absolute", bottom: 5, width: "100%", paddingHorizontal: 10, backgroundColor: colors.white, paddingVertical: 5 }}>
                        <View style={{ flexDirection: "row", width: "100%", justifyContent: "space-between" }}>
                            <TouchableOpacity onPress={handleCancel} style={{ width: "28%", backgroundColor: colors.main_light, padding: 15, borderRadius: 5 }}><Text style={{ color: colors.white, textAlign: "center" }}>Annuler</Text></TouchableOpacity>
                            <TouchableOpacity onPress={handleCreate} style={{ width: "70%", backgroundColor: colors.main_dark, padding: 15, borderRadius: 5 }}><Text style={{ color: colors.white, textAlign: "center" }}>Confirmer la creation</Text></TouchableOpacity>
                        </View>
                    </View>
                }
            </Animated.View >
        </>
    )
}

export default Nouveau

const styles = StyleSheet.create({
    container: { backgroundColor: colors.white },
    forms: {
        paddingHorizontal: 10,
    },
    form_item: {
        marginVertical: 10
    },
    imagebox: { flexDirection: "row", justifyContent: "space-between" },
    image: { height: 150, width: "48%", borderWidth: 0.2, borderRadius: 2 },
    uploadbtn: { paddingVertical: 40, alignItems: "center", justifyContent: "center", backgroundColor: colors.main_light },
    input: {
        borderWidth: 0.5, borderColor: colors.main_light, borderRadius: 5, paddingLeft: 15, color: colors.main
    },
    required: { color: colors.warning },
    info: { fontSize: 10, fontStyle: "italic" }

})