
import { combineReducers } from 'redux';
import router from './modules/router';
import { reducer as modal } from 'redux-modal';
import authReducer from './modules/auth';

export const makeRootReducer = (asyncReducers) => {
  return combineReducers({
    // Add sync reducers here
    auth: authReducer,
    router,
    modal,
    ...asyncReducers
  });
};

export const injectReducer = (store, { key, reducer }) => {
  store.asyncReducers[key] = reducer;
  store.replaceReducer(makeRootReducer(store.asyncReducers));
};

export default makeRootReducer;
