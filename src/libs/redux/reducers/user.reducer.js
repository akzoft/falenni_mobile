const init = { loading: false, connected: false, code: null, me: null, user: null, users: [], errors: null, variable: false }

export const userReducer = (state = init, action) => {
    switch (action.type) {
        case "loading": return { ...state, loading: true, errors: null }
        case "errors": return { ...state, loading: false, errors: action.payload }

        case "authentification_reussie":
        case "connexion_reussie":
            return { ...state, me: action.payload.ans, connected: true, errors: null, loading: false }

        case "inscription_reussie":
        case "mise_a_jour_reussie": return { ...state, me: action.payload.ans, variable: true, errors: null, loading: false }

        case "authentification_echouee": return { ...state, me: null, connected: false }

        case "forgot_checking_phone_reussie":
        case "verifier_telephone_reussie": return { ...state, code: action.payload.ans, variable: true }

        case "reset_password_reussie":
        case "verify_recovery_code_reussie": return { ...state, variable: action.payload.ans }

        case "tous_les_users_reussie": return { ...state, errors: null, loading: false, users: action.payload.ans }

        case "reset_variable": return { ...state, variable: false }
        case "reset_errors": return { ...state, errors: null }
        case "reset_code": return { ...state, code: null }

        default: return state;
    }
}