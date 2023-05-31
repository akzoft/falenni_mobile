const init = { product: null, products: [], errors: null, loading: false, temp: false, p_variable: null, searchDatas: [] }

const productReducer = (state = init, action) => {
    switch (action.type) {
        case "loading": return { ...state, loading: true, errors: null }
        case "errors": return { ...state, loading: false, errors: action.payload }

        case "creation_produit_reussie": return { ...state, loading: false, errors: null, products: [...state.products, action.payload.ans], p_variable: action.payload.ans, message: action.payload.message, temp: true }

        case "mise_a_jour_produit":
        case "faire_une_offre_reussie":
        case "like_reussie":
        case "dislike_reussie":
            const maj = state.products.map(product => {
                if (product._id === action.payload.ans?._id) return { ...product, ...action.payload.ans }
                return product
            })
            return { ...state, loading: false, errors: null, temp: true, products: maj, p_variable: action.payload.ans }

        case "recherche_reussie": return { ...state, searchDatas: action.payload.ans }

        case "suppression_reussie":
            const del = state.products.filter(product => product._id !== action.payload.ans?._id)
            return { ...state, loading: false, errors: null, products: del }

        case "get_produit_reussie":
            return { ...state, loading: false, errors: null, product: action.payload.ans, message: action.payload.message }

        case "gets_all_produit_reussie":
            return { ...state, loading: false, errors: null, products: action.payload.ans, message: action.payload.message }

        case "reset_product_errors": return { ...state, errors: null }
        case "reset_temp": return { ...state, temp: false }
        case "reset_p_variable": return { ...state, p_variable: null }

        default: return state
    }
}
export default productReducer