import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { colors } from '../../libs';

const Negociateur = ({ montant, increaser, setIncreaser, montantNegociation }) => {

    const increment = () => { setIncreaser((prevCount) => prevCount + montantNegociation); }

    const decrement = () => { if (increaser + montant > parseInt(montant - 5 * montantNegociation)) setIncreaser((prevCount) => prevCount - montantNegociation); }

    return (
        <View style={styles.container}>
            <View style={styles.quantity_increaser}>
                <TouchableOpacity style={styles.btn_container} onPress={() => decrement(montantNegociation)} >
                    <FontAwesome name="minus" size={24} color={colors.white} />
                </TouchableOpacity>
                <View style={styles.value_container}><Text style={styles.value}>{increaser + montant}</Text></View>

                <TouchableOpacity style={styles.btn_container} onPress={() => increment(montantNegociation)}>
                    <FontAwesome name="plus" size={24} color={colors.white} />
                </TouchableOpacity>

            </View>
            <Text style={styles.info}>Vous avez {increaser > 0 ? "ajouter" : "soustrait"} <Text style={{ color: colors.brown }}>{increaser} fcfa</Text> a la valeur marchande</Text>

            <View style={{ width: "100%", alignItems: "center", justifyContent: "center" }}>
                <TouchableOpacity style={styles.confirm_btn} >
                    <Text style={{ color: colors.white }}>Envoyer</Text>
                </TouchableOpacity>


                <View style={styles.info_container}><Text style={styles.info}>envoyer le montant de négociation</Text></View>
            </View>

        </View>
    )
}

export default Negociateur

const styles = StyleSheet.create({
    container: { flex: 1, alignItems: "center" },
    quantity_increaser: { flex: 1, alignItems: "center", justifyContent: "center", width: "100%", flexDirection: "row" },
    btn_container: { width: "15%", backgroundColor: colors.main_light, padding: 18, alignItems: "center" },
    value_container: { backgroundColor: colors.light, borderWidth: 1, borderColor: colors.main_light, width: '70%', padding: 15, alignItems: "center" },
    value: { fontSize: 18 },
    info_container: { flexDirection: "row", alignItems: "center", justifyContent: "center" },
    info: { fontSize: 10, fontStyle: "italic" },
    confirm_btn: { padding: 15, alignSelf: "center", backgroundColor: colors.main_dark, width: "100%", alignItems: "center", marginTop: 20 }

})