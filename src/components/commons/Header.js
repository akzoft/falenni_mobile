import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView } from 'react-native'
import React, { useRef, useEffect, useState, useLayoutEffect } from 'react'
import Ionicons from "react-native-vector-icons/Ionicons"
import { colors, isEmpty, rechercher } from '../../libs'
import { getFocusedRouteNameFromRoute, useNavigation, useRoute } from '@react-navigation/native'
import { useDispatch, useSelector } from 'react-redux'


const Header = () => {
    const navigation = useNavigation()
    const route = useRoute()
    const dispatch = useDispatch();
    const searchRef = useRef(null)
    const [screen, setScreen] = useState()
    const [text, setText] = useState("")
    const [sugg, setSugg] = useState("")
    const [suggestion, setSuggestion] = useState([])
    const [click, setClick] = useState(false)
    const { products } = useSelector(state => state?.product)


    //en changeant de screen, on blur le searchInput, mais sur le screen search on focus
    useEffect(() => {
        searchRef.current.blur()
        if (screen === "search") searchRef.current.focus();
        else setText("")
    }, [screen, searchRef])

    useLayoutEffect(() => {
        setScreen(getFocusedRouteNameFromRoute(route))
    }, [route]);
    /////////////////-----------


    //autosuggestion-------------
    useEffect(() => {
        if (text !== sugg) { setClick(false); }
    }, [sugg, text])

    useEffect(() => {
        const categories = products.flatMap(product => product?.categories || []);
        const title = products.flatMap(product => product?.title || []);
        const troc = Array.from(new Set(products.flatMap(product => product?.conditions?.troc ? ["troc"] : [])));
        const vendre = Array.from(new Set(products.flatMap(product => product?.conditions?.vendre ? ["vendre"] : [])));
        const _fixe = Array.from(new Set(products.flatMap(product => product?.prix?.fixe ? ["fixe"] : [])));
        const _negiciation = Array.from(new Set(products.flatMap(product => product?.prix?.negociation ? ["negociation"] : [])));
        const suggs = [...new Set([...categories, ...title, ...troc, ...vendre, ..._fixe, ..._negiciation])];
        setSuggestion(suggs.filter(sugg => sugg.includes(text)))
    }, [text])

    const handleSuggest = (sugg) => {
        setText(sugg);
        setSugg(sugg)
        if (!click) setClick(true)
        searchRef.current.blur()
    }
    //fin autosuggestion-------------


    //recherche filter
    useEffect(() => {
        const filteredData = products?.filter(product => {
            if (isEmpty(text) || text.trim() === "") return

            const searchString = text.trim().toLowerCase()
            const titleMatches = product?.title?.trim().toLowerCase().includes(searchString)
            const categoriesMatches = product?.categories?.some(category => category.trim().toLowerCase().includes(searchString))
            const negociableMatches = product?.prix?.negociation && ("negociable".includes(searchString))
            const fixeMatches = product?.prix?.fixe && ("fixe".includes(searchString))
            const prixMatches = product?.valeurMarchande?.toString().trim().toLowerCase().includes(searchString)
            const etatMatches = product?.etat?.trim().toLowerCase().includes(searchString) || ['Neuf', 'Très bon état', 'Bon état', 'Usé', "tres bon etat", "bon etat", "use"]?.some(e => e.trim().toLowerCase().includes(searchString))



            return titleMatches || categoriesMatches || negociableMatches || fixeMatches || prixMatches || etatMatches
        })
        dispatch(rechercher(filteredData))
    }, [text])
    //recherche filter-------------

    return (
        <>
            <View style={styles.container}>
                <View style={styles.input_container}><TextInput value={text} onChangeText={text => setText(text)} blurOnSubmit={true} onFocus={() => navigation.navigate("search")} ref={searchRef} placeholder='Rechercher vos produits ici..' style={styles.input} /></View>
                <TouchableOpacity style={styles.icon_container}><Ionicons name="ios-notifications" size={32} color={colors.white} /><View style={styles.badge} /></TouchableOpacity>
            </View>

            {(text !== "" && !click) &&
                <ScrollView keyboardShouldPersistTaps="handled" cont={{ width: "100%", zIndex: 100, maxHeight: 220, paddingBottom: 10, paddingHorizontal: 10, top: 50, position: "absolute", backgroundColor: colors.white }}>
                    {suggestion?.slice(0, 8)?.map(((sugg, i) => (
                        <TouchableOpacity onPress={() => handleSuggest(sugg)} key={i} style={{ backgroundColor: colors.main_card, padding: 10, borderBottomWidth: 0.5, borderBottomColor: colors.main_dark }}>
                            <Text style={{ paddingLeft: 5 }}>{sugg}</Text>
                        </TouchableOpacity>)))
                    }
                </ScrollView>
            }
        </>
    )
}

export default Header

const styles = StyleSheet.create({
    container: { backgroundColor: colors.main, paddingVertical: 10, flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 10 },
    input_container: { flex: 10 },
    icon_container: { flex: 2, alignItems: "center" },
    input: { color: colors.main, padding: 3, backgroundColor: colors.white, paddingLeft: 10, borderRadius: 2 },
    badge: { height: 10, width: 10, borderRadius: 10, backgroundColor: "tomato", position: "absolute", right: "30%" }
})