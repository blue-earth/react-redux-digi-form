import { combineReducers } from 'redux'
import { routerReducer as router } from 'react-router-redux'
import forms from './modules/forms'

export const makeRootReducer = (asyncReducers) => {
  return combineReducers({
    // Add sync reducers here
    forms: forms,
    router,
    ...asyncReducers
  })
}

export const injectReducer = (store, { key, reducer }) => {
  store.asyncReducers[key] = reducer
  store.replaceReducer(makeRootReducer(store.asyncReducers))
}

export default makeRootReducer
