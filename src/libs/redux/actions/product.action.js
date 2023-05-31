import AsyncStorage from "@react-native-async-storage/async-storage";
import { api } from "../../api/api";
import axios from "axios";




export const isLoading = () => {
    return (dispatch) => {
        dispatch({ type: "loading" })
    }
}

export const product_error = (error) => {
    return (dispatch) => {
        dispatch({ type: "errors", payload: error?.response?.data?.message })
    }
}

export const creation_produit = (data) => async (dispatch) => {
    try {
        dispatch(isLoading());

        const upload = await axios.post(`${api}/api/product/upload_file`, data.blob, { headers: { 'Content-Type': 'multipart/form-data' } });

        if (upload) {
            const token = await AsyncStorage.getItem('cookie');

            data.images = upload?.data?.response
            const ans = await axios.post(`${api}/api/product/creer_un_produit`, data, { headers: { token } });

            dispatch({ type: "creation_produit_reussie", payload: { ans: ans?.data?.response, message: ans.data.message } });
        }


    } catch (error) {
        dispatch(product_error(error))
    }
}

export const find_product = (id) => async (dispatch) => {
    try {
        const token = await AsyncStorage.getItem('cookie');
        const ans = await axios.get(`${api}/api/product/${id}`, { headers: { token } })

        if (!isEmpty(ans.data))
            dispatch({ type: "get_produit_reussie", payload: { ans: ans.data.response, message: ans.data.message } })
    } catch (error) {
        dispatch(product_error(error))
    }
}

export const all_products = () => async (dispatch) => {
    try {
        const token = await AsyncStorage.getItem('cookie');
        const ans = await axios.get(`${api}/api/product`, { headers: { token } })
        dispatch({ type: "gets_all_produit_reussie", payload: { ans: ans.data.response, message: ans.data.message } })
    } catch (error) {
        dispatch(product_error(error))
    }
}

export const update_product = (data) => async (dispatch) => {
    try {
        const token = await AsyncStorage.getItem('cookie');
        const ans = await axios.put(`${api}/api/product/mise_a_jour_produit/${data?.id}`, data, { headers: { token } })

        if (!isEmpty(ans.data))
            dispatch({ type: "mise_a_jour_produit", payload: { ans: ans.data.response, message: ans.data.message } })
    } catch (error) {
        dispatch(product_error(error))
    }
}

export const delete_product = (id) => async (dispatch) => {
    try {
        const token = await AsyncStorage.getItem('cookie');
        const ans = await axios.delete(`${api}/api/product/delete_produit/${id}`, { headers: { token } })

        if (!isEmpty(ans.data))
            dispatch({ type: "suppression_reussie", payload: { ans: ans.data.response, message: ans.data.message } })
    } catch (error) {
        dispatch(product_error(error))
    }
}

export const faire_une_offre = (data) => async (dispatch) => {
    try {

        const upload = await axios.post(`${api}/api/product/upload_file`, data.blob, { headers: { 'Content-Type': 'multipart/form-data' } });

        if (upload) {
            const token = await AsyncStorage.getItem('cookie');

            const datas = { offre: { user: data?.me, title: data?.title, offre: data?.offre, montant: data?.montant, images: upload?.data?.response, date: Date.now() } }
            const ans = await axios.patch(`${api}/api/product/faire_une_offre/${data?.id}`, datas, { headers: { token } });

            dispatch({ type: "faire_une_offre_reussie", payload: { ans: ans?.data?.response, message: ans.data.message } });
        }
    } catch (error) {
        dispatch(product_error(error))
    }
}

export const rechercher = (data) => (dispatch) => {
    dispatch({ type: "recherche_reussie", payload: { ans: data } });
}

export const likes = (data) => async (dispatch) => {
    try {
        const token = await AsyncStorage.getItem('cookie');
        const ans = await axios.patch(`${api}/api/product/likes/${data?.id}`, data, { headers: { token } });

        dispatch({ type: "like_reussie", payload: { ans: ans?.data?.response, message: ans.data.message } });
    } catch (error) {
        dispatch(product_error(error))
    }
}

export const dislikes = (data) => async (dispatch) => {
    try {
        const token = await AsyncStorage.getItem('cookie');
        const ans = await axios.patch(`${api}/api/product/dislikes/${data?.id}`, data, { headers: { token } });

        dispatch({ type: "dislike_reussie", payload: { ans: ans?.data?.response, message: ans.data.message } });
    } catch (error) {
        dispatch(product_error(error))
    }
}