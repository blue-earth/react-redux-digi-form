import { routerActions, routerReducer } from 'react-router-redux';
import { formatUrl } from 'helpers/urlHelper';

// ------------------------------------
// Actions
// ------------------------------------
export const goTo = (path) => routerActions.push(formatUrl(path));
export const replace = path => routerActions.replace(formatUrl(path));

// ------------------------------------
// Reducer
// ------------------------------------
export default routerReducer;
