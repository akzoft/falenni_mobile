import { StyleSheet } from "react-native";
import { colors } from "./typography";

const auth = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.white, },
    logo_box: { paddingTop: 20, alignItems: "center" },
    logo: { height: 100, width: 150, borderRadius: 100, resizeMode: "contain", },
    logo_text: { fontSize: 18, textAlign: "center", letterSpacing: 2.5, color: colors.main },
    forms: { paddingTop: 15, paddingHorizontal: 10, },
    form_item: { marginBottom: 15 },
    input: { borderBottomWidth: 2, borderBottomColor: colors.main, color: colors.main },
    button: { backgroundColor: colors.main, padding: 10, borderRadius: 5, marginTop: 15 },
    button_text: { color: colors.white, textAlign: "center" },
    forgot: { flexWrap: "wrap", flexDirection: "row", alignItems: "center", justifyContent: "center", marginTop: 25, marginBottom: 30 },
    register: { color: colors.main, textDecorationLine: "underline", },
    code_item: { width: "20%", height: 70, borderRadius: 5, borderWidth: 1, borderColor: colors.main_light },
    separator: { height: 20 }
})

export const css = { auth }