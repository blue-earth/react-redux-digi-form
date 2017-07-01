
import { combineReducers } from 'redux';
import router from './modules/router';
import { reducer as modal } from 'redux-modal';
import authReducer from './modules/auth';
import {reducer as formReducer} from 'redux-form';

export const makeRootReducer = (asyncReducers) => {
  return combineReducers({
    // Add sync reducers here
    auth: authReducer,
    router,
    modal,
    form: formReducer,
    ...asyncReducers
  });
};

export const injectReducer = (store, { key, reducer }) => {
  store.asyncReducers[key] = reducer;
  store.replaceReducer(makeRootReducer(store.asyncReducers));
};

export default makeRootReducer;
