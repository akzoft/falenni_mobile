import { StyleSheet, TouchableWithoutFeedback, Text, View, Animated, Image, ScrollView, TouchableOpacity, StatusBar, TextInput } from 'react-native'
import React, { FC, useEffect, useRef, useState } from 'react'
import MaterialIcons from "react-native-vector-icons/MaterialIcons"
import Fontisto from "react-native-vector-icons/Fontisto"
import { DetailSwiper, Negociateur, OffreTrocCard, PropositionOffre, RelatedProductCard } from '../../../components'
import { RootState, areIn, categorieDisplay, colors, Product, toastConfig, isEmpty, handleChangeMobile, images, isImage, faire_une_offre, User } from '../../../libs'
import Toast from 'react-native-toast-message'
import { ParamListBase, useIsFocused, useRoute } from '@react-navigation/native'
import { Overlay } from 'react-native-elements'
import Dialog from "react-native-dialog";
import DocumentPicker, { DocumentPickerResponse } from 'react-native-document-picker'
import { useDispatch, useSelector } from 'react-redux'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'

type props = { route: ReturnType<typeof useRoute>, navigation: NativeStackNavigationProp<ParamListBase, string, undefined> }
type Offre = { id: string, me: string, offre: string, title: String, montant?: Number, blob: any }

const Details: FC<props> = ({ route, navigation }) => {
    const [visible, setVisible] = useState(false)
    const [product, setProduct] = useState<Product>()
    const [visibleDescription, setVisibleDescription] = useState(false)
    const [visibleNegociation, setVisibleNegociation] = useState(false)
    const [visibleNegociationProposition, setVisibleNegociationProposition] = useState(false)
    const [increaser, setIncreaser] = useState<Number>()
    const init = { id: "", me: "", offre: "", title: "", montant: 0, blob: null }
    const [inputs, setInputs] = useState<Offre>(init)
    const [relatedData, setRelatedData] = useState<Array<Product>>([])
    const isFocused = useIsFocused();
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const viewRef = useRef(null);
    const routes: any = route?.params
    const dispatch = useDispatch<any>();
    const scrollViewRef = useRef(null)

    //données de proposition d'offres
    const [montantProposition, setMontantProposition] = useState<Number>(500)
    const [imagesOffre, setImagesOffre] = useState<Array<DocumentPickerResponse>>([])
    const [index, setIndex] = useState<number>(0)
    const [visibleImageModal, setVisibleImageModal] = useState(false)
    const { products, temp, p_variable } = useSelector((state: RootState) => state?.product)
    const { me, users } = useSelector((state: RootState) => state?.user)
    const name = users?.find((user: User) => (user?._id === product?.proprietaire))?.name

    //produit en relation
    useEffect(() => {
        let tab = [] as Array<Product>
        (products as Array<Product>)?.forEach((prod: Product) => {
            if (areIn(prod?.categories, product?.categories) && (prod?._id !== product?._id))
                tab.push(prod)
        })
        setRelatedData(tab)
    }, [products, product])

    //pour ovrir les offres dans details, de magasincard
    useEffect(() => {
        setProduct(routes?.product)

        if (routes?.openOffres) {
            toggleOverlay()
            routes.openOffres = false
        }
    }, [routes?.openOffres])

    useEffect(() => {
        if (temp) {
            navigation.navigate("detail_du_produit", { product: p_variable });
            dispatch({ type: "reset_temp" });
            dispatch({ type: "reset_p_variable" });
            toggleOverlay();
            setImagesOffre([]);
            setInputs(init)
        }
    }, [temp])

    useEffect(() => { if (isFocused) Animated.timing(fadeAnim, { toValue: 1, duration: 500, useNativeDriver: true, }).start(); else Animated.timing(fadeAnim, { toValue: 0, duration: 500, useNativeDriver: true, }).start(); }, [fadeAnim, isFocused]);
    useEffect(() => { setIncreaser(product?.montantNegociation) }, [product])

    const toggleOverlay = () => { setVisible(!visible) }
    const toggleOverlayDescription = () => setVisibleDescription(!visibleDescription)
    const toggleOverlayNegociation = () => { if (!isEmpty(me)) setVisibleNegociation(!visibleNegociation); else navigation.navigate("connexion") }


    //images
    // gestion upload image
    async function pickMultiple() {
        try {
            const results = await DocumentPicker.pickMultiple({ type: [DocumentPicker.types.images] });
            const filesToAdd: DocumentPickerResponse[] = [];
            for (const result of results) {
                if (imagesOffre.length + filesToAdd.length >= 4) {
                    break;
                }
                if (isImage(result)) {
                    filesToAdd.push(result);
                }
            }
            setImagesOffre([...imagesOffre, ...filesToAdd]);
        } catch (err) {
            if (DocumentPicker.isCancel(err)) {
                console.log('User cancelled document picker');
            } else {
                console.error('Error picking multiple files:', err);
            }
        }
    }

    function switchImage(index: number) {
        DocumentPicker.pick({ type: [DocumentPicker.types.images] })
            .then((newImage) => {
                if (newImage) {
                    setImagesOffre(prevImages => {
                        const updatedImages = [...prevImages];
                        updatedImages[index] = newImage[0];
                        return updatedImages;
                    });
                }
                setVisibleImageModal(false);
            })
            .catch((error) => {
                console.log('Error picking image:', error);
            });
        setVisible(false);
    }

    const removeImage = (index: number) => {
        imagesOffre?.splice(index, 1)
        setVisibleImageModal(false)
    }

    const showDialog = (index: number) => {
        setVisibleImageModal(true);
        setIndex(index)
    };

    const handleBuy = () => {
        if (isEmpty(me)) navigation.navigate("connexion")
    }

    const toggleOverlayPropositionOffre = () => {
        if (!isEmpty(me)) setVisibleNegociationProposition(!visibleNegociationProposition)
        else navigation.navigate("connexion")
    }

    const handleNegociate = () => {
        //envoyer la negociation
        if (montantProposition !== 0) inputs.montant = montantProposition

        toggleOverlayPropositionOffre()

        if (imagesOffre?.length > 0) {
            let blob = new FormData()
            for (const image of imagesOffre) { blob.append('file', image) }
            inputs.blob = blob
        }
        if (product?._id) inputs.id = product?._id
        inputs.me = me?._id
        dispatch(faire_une_offre(inputs))
    }

    return (
        <>
            <View style={{ zIndex: 100, }}><Toast config={toastConfig} /></View>
            <StatusBar barStyle={"light-content"} backgroundColor={colors.main} />
            <Animated.View ref={viewRef} style={[styles.container, { opacity: fadeAnim, flex: 1 }]}>

                {/* overlay d'affichage des offres */}
                <Overlay isVisible={visible} onBackdropPress={toggleOverlay} overlayStyle={[styles.overlay, { height: "70%" }]} animationType="slide">
                    <View style={styles.sheetheader}>
                        <Text style={styles.sheettitle}>Offres</Text>
                        <TouchableOpacity activeOpacity={0.7} onPress={toggleOverlay}><Fontisto name="close-a" size={18} style={{ color: colors.danger }} /></TouchableOpacity>
                    </View>

                    <View style={styles.line} />

                    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.sheetcontainer}>
                        {product?.offres !== undefined && (product?.offres?.length > 0) ?
                            product?.offres?.map((offre, i) => (<OffreTrocCard offre={offre} product={product} key={i} />))
                            : <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}><Text>Aucune offre pour ce produit</Text></View>}
                    </ScrollView>
                </Overlay>

                <Overlay isVisible={visibleDescription} onBackdropPress={toggleOverlayDescription} overlayStyle={styles.overlay} animationType="slide">
                    <View style={styles.sheetheader}>
                        <Text style={styles.sheettitle}>Description</Text>
                        <TouchableOpacity activeOpacity={0.7} onPress={toggleOverlayDescription}><Fontisto name="close-a" size={18} style={{ color: colors.danger }} /></TouchableOpacity>
                    </View>

                    <View style={styles.line} />

                    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.sheetcontainer}>
                        <Text style={{ textAlign: "justify" }}>
                            {product?.description}
                        </Text>
                    </ScrollView>
                </Overlay>


                <Overlay isVisible={visibleNegociation} onBackdropPress={toggleOverlayNegociation} overlayStyle={[styles.overlay, { height: "30%" }]} animationType="slide">
                    <View style={[styles.sheetheader]}>
                        <Text style={styles.sheettitle}>Negociation</Text>
                        <TouchableOpacity activeOpacity={0.7} onPress={toggleOverlayNegociation}><Fontisto name="close-a" size={18} style={{ color: colors.danger }} /></TouchableOpacity>
                    </View>

                    <View style={styles.line} />

                    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.sheetcontainer}>
                        <View>
                            <Negociateur montant={product?.valeurMarchande} increaser={increaser} setIncreaser={setIncreaser} montantNegociation={product?.montantNegociation} />
                        </View>
                    </ScrollView>
                </Overlay>

                {/* overlay negocier un troc  */}
                <Overlay isVisible={visibleNegociationProposition} onBackdropPress={toggleOverlayPropositionOffre} overlayStyle={[styles.overlay, { height: "75%" }]} animationType="slide">
                    <View style={[styles.sheetheader]}>
                        <Text style={styles.sheettitle}>Proposition</Text>
                        <TouchableOpacity activeOpacity={0.7} onPress={toggleOverlayPropositionOffre}><Fontisto name="close-a" size={18} style={{ color: colors.danger }} /></TouchableOpacity>
                    </View>

                    <View style={styles.line} />

                    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.sheetcontainer} keyboardShouldPersistTaps="handled">
                        <View style={styles.form_item}>
                            <Text style={{ fontSize: 16, color: colors.dark }}>Images</Text>
                            <TouchableOpacity onPress={pickMultiple} style={[styles.input, { padding: 20, alignItems: "center", }]}><Text>Uploader des images</Text></TouchableOpacity>
                        </View>
                        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 5 }}>
                            {imagesOffre?.map((image, i) => (<TouchableOpacity onPress={() => showDialog(i)} key={i}><Image source={image} style={{ width: 100, height: 100 }} /></TouchableOpacity>))}
                        </ScrollView>

                        <View style={styles.form_item}>
                            <Text style={{ fontSize: 16, color: colors.dark }}>Titre <Text style={styles.required}>*</Text></Text>
                            <TextInput placeholder='' style={styles.input} value={inputs.title.toString()} onChangeText={text => handleChangeMobile('title', text, setInputs)} />
                        </View>

                        <View style={styles.form_item}>
                            <Text style={{ fontSize: 16, color: colors.dark }}>Detaillez votre offre <Text style={styles.required}>*</Text></Text>
                            <TextInput placeholder='' multiline={true} style={[styles.input, { height: 150 }]} value={inputs?.offre?.toString()} onChangeText={text => handleChangeMobile('offre', text, setInputs)} />
                        </View>

                        <View>
                            <Text style={{ fontSize: 16, color: colors.dark }}>Associer une somme</Text>
                            <PropositionOffre montantProposition={montantProposition} setMontantProposition={setMontantProposition} montantIncrementation={500} handleNegociate={handleNegociate} />
                        </View>
                    </ScrollView>
                </Overlay>

                <ScrollView ref={scrollViewRef} contentContainerStyle={{ flexGrow: 1 }}>
                    <View style={{ height: 230 }}><DetailSwiper product={product} /></View>
                    <View style={{ padding: 10, borderWidth: 0.5, borderColor: colors.main_light }}>
                        <View>
                            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                                <Text style={{ fontSize: 18, letterSpacing: 1, color: colors.dark }}>{product?.title?.slice(0, 18)}{product?.title && product?.title?.length > 18 && "..."}</Text>
                                <Text style={[styles.dispo, { textDecorationLine: !product?.available ? "line-through" : "none" }]}>Disponible</Text>

                            </View>
                            <Text style={styles.categorie}>{categorieDisplay(product?.categories, " | ")}</Text>

                            <View style={{ paddingVertical: 8, flexDirection: "row", justifyContent: "space-between" }}>
                                <>
                                    {product?.conditions?.vendre ? <View >
                                        <Text style={styles.typeprix}>A vendre</Text>
                                        <Text style={styles.typevendre}>Valeur marchande</Text>
                                        <Text style={styles.prix}>{product?.valeurMarchande.toString()} fcfa</Text>
                                    </View> : product?.conditions?.troc &&
                                    <View >
                                        <Text style={styles.typeprix}>A Troquer (échanger)</Text>
                                        <Text style={styles.typevendre}>{product?.etat}</Text>
                                    </View>}

                                    <View>
                                        <Text style={{ fontSize: 12, textDecorationLine: "underline", color: colors.dark }}>Propietaire </Text><Text style={{ color: colors.success }}>#{name?.slice(0, 8)} {name?.length > 8 && "..."}</Text>
                                    </View>
                                </>
                                {(product?.conditions?.vendre && product?.prix?.negociation) &&
                                    <View>
                                        <Text style={[styles.typevendre, { textAlign: "right", fontSize: 15 }]}>{product?.prix?.fixe ? "fixe" : product?.prix?.negociation && "Négociable"}</Text>
                                        <Text style={{ textAlign: "right", color: colors.dark, fontSize: 12 }}>Valeur de negociation</Text>
                                        <Text style={{ textAlign: "right", color: colors.main_dark }}>{product?.montantNegociation?.toString()} fcfa</Text>
                                    </View>}

                                {(product?.conditions?.vendre && product?.prix?.fixe) &&
                                    <View>
                                        <Text style={[styles.typevendre, { textAlign: "right", fontSize: 13 }]}>{product?.prix?.fixe && " Prix fixe"}</Text>
                                        <Text style={[styles.typevendre, { textAlign: "right", fontSize: 13 }]}>{product?.prix?.fixe && " Non négociable"}</Text>
                                    </View>}


                            </View>

                            {(product?.conditions?.vendre && product?.prix?.negociation) && <Text style={styles.info}>Pendant la negociation la valeur marchande (prix) pourrait être augmentée ou diminuée par un facteur de la valeur de negociation</Text>}
                        </View>
                    </View>

                    {(product?.conditions?.troc && me?._id !== product?.proprietaire) &&
                        <View style={{ marginTop: 5, marginBottom: 20, padding: 10, flexDirection: "row", alignItems: "center", width: "100%", justifyContent: "center", gap: 15 }}>
                            <TouchableOpacity onPress={toggleOverlayPropositionOffre} style={{ padding: 15, backgroundColor: colors.main, width: "75%", }}><Text style={{ color: colors.white, textAlign: "center" }}>Proposer une offre</Text></TouchableOpacity>
                        </View>
                    }

                    {/* boutons acheter maintenant et negocier */}
                    {((product?.conditions?.vendre && (product?.prix?.fixe || product?.prix?.negociation)) && me?._id !== product?.proprietaire) &&
                        <View style={{ marginTop: 5, marginBottom: 20, padding: 10, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 15 }}>
                            <TouchableOpacity onPress={handleBuy} style={{ padding: 15, backgroundColor: colors.main }}><Text style={{ color: colors.white }}>Acheter maintenant</Text></TouchableOpacity>
                            {!product?.prix?.fixe && <TouchableOpacity onPress={toggleOverlayNegociation} style={{ padding: 15, backgroundColor: colors.warning }}><Text style={{ color: colors.white }}>Négocier</Text></TouchableOpacity>}
                        </View>}

                    {/* voir les offres et description */}
                    <View style={{ padding: 10, flexDirection: "row", justifyContent: "space-between", borderBottomWidth: 0.5, borderTopWidth: 0.5, borderColor: colors.main_light }}>
                        {(product?.prix?.negociation || product?.conditions?.troc) && <TouchableOpacity onPress={toggleOverlay} style={{ flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center" }}><MaterialIcons name='remove-red-eye' size={20} /><Text>Voir les offres ({product?.offres?.length})</Text></TouchableOpacity>}
                        {(product?.prix?.negociation || product?.conditions?.troc) && <View style={{ width: 0.5, height: "70%", backgroundColor: colors.main_light }} />}
                        <TouchableOpacity onPress={toggleOverlayDescription} style={{ flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center" }}><MaterialIcons name='description' size={20} /><Text >Voir la description</Text></TouchableOpacity>
                    </View>

                    <View style={{ marginTop: 40, padding: 10 }}>
                        {relatedData?.length > 0 && <Text style={styles.label}>Produits similaires</Text>}
                        {relatedData?.slice(0, 5)?.map((product, i) => (<RelatedProductCard scrollViewRef={scrollViewRef} key={i} product={product} />))}
                    </View>
                </ScrollView>

                <TouchableWithoutFeedback onPress={() => setVisibleImageModal(false)} >
                    <Dialog.Container onBackdropPress={() => setVisibleImageModal(false)} visible={visibleImageModal} contentStyle={{ justifyContent: "center", alignItems: "center" }}>
                        <Dialog.Title style={{ width: "100%" }}>Choisissez une action</Dialog.Title>
                        <Dialog.Description>
                            <View style={{ width: "100%", gap: 10, justifyContent: "center", alignItems: "center" }}>
                                <Dialog.Button onPress={() => switchImage(index)} label="Remplacer l'image" style={{ width: "90%", color: colors.white, backgroundColor: colors.main_dark, paddingHorizontal: 15 }} />
                                <Dialog.Button onPress={() => removeImage(index)} label="Supprimer l'image" style={{ width: "90%", color: colors.white, backgroundColor: colors.danger, paddingHorizontal: 15 }} />
                            </View>

                        </Dialog.Description>

                    </Dialog.Container>
                </TouchableWithoutFeedback>

            </Animated.View >
        </>

    )
}

export default Details

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.white },
    categorie: { color: colors.brown, fontSize: 8 },
    prix: { fontSize: 14, color: colors.warning },
    typeprix: { fontSize: 14, color: colors.dark },
    typevendre: { fontSize: 12, color: colors.dark },
    label: { fontSize: 20, letterSpacing: 1.5, color: colors.main_dark, marginBottom: 10 },
    dispo: { fontSize: 13, color: colors.danger },
    info: { fontSize: 10, fontStyle: "italic" },
    input: { borderWidth: 0.5, borderColor: colors.main_light, borderRadius: 5, paddingLeft: 15, color: colors.main },
    overlay: { borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 20, paddingVertical: 10, width: "100%", position: "absolute", height: "50%", bottom: 0 },
    sheettitle: { color: colors.dark, fontWeight: "300", letterSpacing: 1.5, fontSize: 22 },
    sheetheader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
    sheetcontainer: { flexGrow: 1, paddingVertical: 15 },
    required: { color: colors.warning },
    form_item: { marginVertical: 10 },
    line: { width: "60%", height: 4, backgroundColor: colors.main, borderRadius: 50, marginVertical: 15, marginBottom: 5 },
})