import thunk from 'redux-thunk'
import { applyMiddleware, combineReducers, legacy_createStore } from 'redux'
import { userReducer } from './reducers/user.reducer'
import productReducer from './reducers/product.reducer'


const reducers = combineReducers({ user: userReducer, product: productReducer })
const Store = legacy_createStore(reducers, applyMiddleware(thunk))


export type RootState = ReturnType<typeof reducers>;


export default Store