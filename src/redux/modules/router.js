import { routerActions, routerReducer } from 'react-router-redux';
import _ from 'lodash';

// ------------------------------------
// Helpers
// ------------------------------------
const formatUrl = (url) => _.replace(url, /\/\//g, '/');

// ------------------------------------
// Actions
// ------------------------------------
export const goTo = (path) => routerActions.push(formatUrl(path));
export const replace = path => routerActions.replace(formatUrl(path));

// ------------------------------------
// Reducer
// ------------------------------------
export default routerReducer;
