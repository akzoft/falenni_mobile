import { BaseToast } from "react-native-toast-message";
import { colors } from "../constants/typography";

export const isEmpty = (value) => value === undefined || value === null || (typeof value === "object" && Object.keys(value).length === 0) || (typeof value === "string" && value.trim().length === 0);

export const handleChangeMobile = (key, value, setInputs) => { setInputs(prevState => ({ ...prevState, [key]: value, })) }

export const isImage = (file) => {
    let res
    if (typeof file === "string" && (file?.split(".").includes("jpg") || file?.split(".").includes("jpeg") || file?.split(".").includes("png") || file?.split(".").includes("gif")))
        res = true
    else
        if (file?.type.split("/").includes("image") && (file?.name.endsWith(".jpg") || file?.name.endsWith(".jpeg") || file?.name.endsWith(".png") || file?.name.endsWith(".gif") || file?.name.endsWith(".bmp"))) res = true
        else res = false

    return res
}

export function categorieDisplay(categorie, separator) {
    // Joindre les éléments du tableau avec des "|"
    let v = separator || '|'
    var categorieAvecSeparateurs = categorie?.join(v);

    return categorieAvecSeparateurs;
}

export const toastConfig = {
    info: (props) => (
        <BaseToast
            {...props}
            style={{ borderRadius: 15, height: 80, borderLeftColor: colors.info }}
            contentContainerStyle={{ borderRadius: 15, height: 80, paddingHorizontal: 15, backgroundColor: colors.white }}
            text1Style={{
                fontSize: 17, color: colors.info, marginBottom: 15, textDecorationLine: "underline"
            }}
            text2Style={{
                fontSize: 12, color: colors.main_dark, fontWeight: 200, fontStyle: "italic"
            }}
            text2NumberOfLines={4}
        />
    ),
    success: (props) => (
        <BaseToast
            {...props}
            style={{ borderRadius: 15, height: 80, borderLeftColor: colors.success }}
            contentContainerStyle={{ borderRadius: 15, height: 80, paddingHorizontal: 15, backgroundColor: colors.white }}
            text1Style={{
                fontSize: 17, color: colors.info, marginBottom: 15, textDecorationLine: "underline"
            }}
            text2Style={{
                fontSize: 12, color: colors.main_dark, fontWeight: 200, fontStyle: "italic"
            }}
            text2NumberOfLines={4}
        />
    ),
    danger: (props) => (
        <BaseToast
            {...props}
            style={{ borderRadius: 15, height: 80, borderLeftColor: colors.danger }}
            contentContainerStyle={{ borderRadius: 15, height: 80, paddingHorizontal: 15, backgroundColor: colors.white }}
            text1Style={{
                fontSize: 17, color: colors.info, marginBottom: 15, textDecorationLine: "underline"
            }}
            text2Style={{
                fontSize: 12, color: colors.main_dark, fontWeight: 200, fontStyle: "italic"
            }}
            text2NumberOfLines={4}
        />
    ),
    warning: (props) => (
        <BaseToast
            {...props}
            style={{ borderRadius: 15, height: 80, borderLeftColor: colors.warning }}
            contentContainerStyle={{ borderRadius: 15, height: 80, paddingHorizontal: 15, backgroundColor: colors.white }}
            text1Style={{
                fontSize: 17, color: colors.info, marginBottom: 15, textDecorationLine: "underline"
            }}
            text2Style={{
                fontSize: 12, color: colors.main_dark, fontWeight: 200, fontStyle: "italic"
            }}
            text2NumberOfLines={4}
        />
    ),
};


export const areIn = (arr1, arr2) => {
    return arr1?.some((arr) => arr2?.includes(arr))
}