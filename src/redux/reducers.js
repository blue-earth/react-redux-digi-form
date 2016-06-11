import { combineReducers } from 'redux'
import { routerReducer as router } from 'react-router-redux'
import formInteractive from './modules/formInteractive'
import authReducer from './modules/auth'

export const makeRootReducer = (asyncReducers) => {
  return combineReducers({
    // Add sync reducers here
    formInteractive: formInteractive,
    auth: authReducer,
    router,
    ...asyncReducers
  })
}

export const injectReducer = (store, { key, reducer }) => {
  store.asyncReducers[key] = reducer
  store.replaceReducer(makeRootReducer(store.asyncReducers))
}

export default makeRootReducer
