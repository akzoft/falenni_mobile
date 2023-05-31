import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { colors } from '../../libs';

const PropositionOffre = ({ montantProposition, setMontantProposition, montantIncrementation, handleNegociate }) => {

    const increment = () => { setMontantProposition((prevCount) => prevCount + montantIncrementation); }

    const decrement = () => { setMontantProposition((prevCount) => prevCount - montantIncrementation); }

    return (
        <View style={styles.container}>
            <View style={styles.quantity_increaser}>
                <TouchableOpacity style={styles.btn_container} onPress={() => decrement(montantIncrementation)} >
                    <FontAwesome name="minus" size={24} color={colors.white} />
                </TouchableOpacity>
                <View style={styles.value_container}><Text style={styles.value}>{montantProposition}</Text></View>

                <TouchableOpacity style={styles.btn_container} onPress={() => increment(montantIncrementation)}>
                    <FontAwesome name="plus" size={24} color={colors.white} />
                </TouchableOpacity>

            </View>
            <Text style={styles.info}>
                {montantProposition > 0 && <Text>J'associe une somme de  <Text style={{ color: colors.brown }}>{montantProposition} fcfa</Text> à mon offre</Text>}
                {montantProposition < 0 && <Text>Je demande <Text style={{ color: colors.brown }}>{montantProposition * -1} fcfa</Text> en plus au propriétaire contre mon offre</Text>}
            </Text>

            <View style={{ width: "100%", alignItems: "center", justifyContent: "center" }}>
                <TouchableOpacity style={styles.confirm_btn} onPress={handleNegociate}>
                    <Text style={{ color: colors.white }}>Envoyer l'offre</Text>
                </TouchableOpacity>


                <View style={styles.info_container}><Text style={styles.info}>cliquer pour envoyer l'offre</Text></View>
            </View>

        </View>
    )
}

export default PropositionOffre

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