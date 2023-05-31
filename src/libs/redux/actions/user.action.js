import axios from "axios"
import { isEmpty } from "../../js/functions"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { api } from "../../api/api"

export const isLoading = () => {
    return (dispatch) => {
        dispatch({ type: "loading" })
    }
}

export const user_error = (error) => {
    return (dispatch) => {
        dispatch({ type: "errors", payload: error?.response?.data?.message })
    }
}

export const check_authentification = () => async (dispatch) => {
    try {
        const token = await AsyncStorage.getItem('cookie');
        if (!token) { token = ""; dispatch({ type: "authentification_echouee" }) }

        const res = await axios.post(`${api}/api/user/authentification`, null, { headers: { token } });
        if (!res.data) dispatch({ type: "authentification_echouee" })
    } catch (error) {
        dispatch({ type: "authentification_echouee" })
    }
}

export const authentification = () => async (dispatch) => {
    try {
        dispatch(isLoading());
        let token = await AsyncStorage.getItem('cookie');
        if (!token) { token = ""; dispatch({ type: "authentification_echouee" }) }
        else {

            const res = await axios.post(`${api}/api/user/authentification`, null, { headers: { token } });

            if (res.data) {

                const ans = await axios.get(`${api}/api/user/profil/me`, { headers: { token } });
                if (!isEmpty(ans.data)) dispatch({ type: "authentification_reussie", payload: { ans: ans.data.response } });
            }
            else dispatch({ type: "authentification_echouee" })
        }
    } catch (error) {
        dispatch(user_error(error))
    }
}

export const connexion = (data) => async (dispatch) => {
    try {
        dispatch(isLoading());
        const ans = await axios.post(`${api}/api/user/connexion`, data);

        if (!isEmpty(ans.data)) {
            await AsyncStorage.setItem('cookie', ans.data.token);
            dispatch({ type: "connexion_reussie", payload: { ans: ans?.data?.response, message: ans.data.message } });
        }
    } catch (error) {
        dispatch(user_error(error))
    }
}

export const deconnexion = () => async (dispatch) => {
    try {
        dispatch(isLoading());
        await AsyncStorage.removeItem("cookie")
        dispatch({ type: "authentification_echouee", payload: { message: "Vous êtes deconnecté!" } })
    } catch (error) {
        dispatch(user_error(error))
    }
}

export const verifier_telephone = (data) => async (dispatch) => {
    try {
        dispatch(isLoading());
        const ans = await axios.post(`${api}/api/user/checking_phone`, data);

        if (!isEmpty(ans.data)) {
            console.log("code validation: ", ans.data.response)
            dispatch({ type: "verifier_telephone_reussie", payload: { ans: ans?.data?.response, message: ans.data.message } });
        }
    } catch (error) {
        dispatch(user_error(error))
    }
}

export const verifier_forgot_telephone = (data) => async (dispatch) => {
    try {
        dispatch(isLoading());
        const ans = await axios.post(`${api}/api/user/forgot_checking_phone`, data);

        if (!isEmpty(ans.data)) {
            console.log("code réinitialisation: ", ans.data.response)
            dispatch({ type: "forgot_checking_phone_reussie", payload: { ans: ans?.data?.response, message: ans.data.message } });
        }
    } catch (error) {
        dispatch(user_error(error))
    }
}

export const verify_recovery_code = (data) => async (dispatch) => {
    try {
        dispatch(isLoading());
        const ans = await axios.post(`${api}/api/user/verify_recovery_code`, data);

        if (!isEmpty(ans.data)) {
            dispatch({ type: "verify_recovery_code_reussie", payload: { ans: ans?.data?.response, message: ans.data.message } });
        }
    } catch (error) {
        dispatch(user_error(error))
    }
}

export const reset_password = (data) => async (dispatch) => {
    try {
        dispatch(isLoading());
        const ans = await axios.post(`${api}/api/user/reset_password`, data);

        if (!isEmpty(ans.data)) {
            dispatch({ type: "reset_password_reussie", payload: { ans: ans?.data?.response, message: ans.data.message } });
        }
    } catch (error) {
        dispatch(user_error(error))
    }
}

export const inscription = (data) => async (dispatch) => {
    try {
        dispatch(isLoading());

        const ans = await axios.post(`${api}/api/user/inscription`, data);
        if (!isEmpty(ans.data)) {
            await AsyncStorage.setItem('cookie', ans.data.token);
            dispatch({ type: "inscription_reussie", payload: { ans: ans?.data?.response, message: ans.data.message } });
        }
    } catch (error) {
        dispatch(user_error(error))
    }
}

export const mise_a_jour = (data, blob) => async (dispatch) => {
    try {
        dispatch(isLoading())
        const token = await AsyncStorage.getItem('cookie');
        let ans = null

        if (blob) {
            const config_upload = { headers: { 'Content-Type': 'multipart/form-data' } }
            const response_upload = await axios.post(`${api}/api/user/upload_file`, blob, config_upload)

            if (!isEmpty(response_upload.data)) {
                data.image = response_upload.data.response
                ans = await axios.put(`${api}/api/user/mise_a_jour/${data?.id}`, data, { headers: { token: token } })
            }
        } else
            ans = await axios.put(`${api}/api/user/mise_a_jour/${data?.id}`, data, { headers: { token: token } })

        dispatch({ type: "mise_a_jour_reussie", payload: { ans: ans.data.response, message: ans.data.message } })
    } catch (error) {
        dispatch(user_error(error))
    }
}

export const tous_les_users = () => async (dispatch) => {
    try {
        dispatch(isLoading());
        const ans = await axios.get(`${api}/api/user`);
        dispatch({ type: "tous_les_users_reussie", payload: { ans: ans?.data?.response, message: ans.data.message } });
    } catch (error) {
        dispatch(user_error(error))
    }
}