// We only need to import the modules necessary for initial render
import DashboardLayout from 'layouts/DashboardLayout';
import FormsRoute from './Forms';
import SubmissionsRoute from './Submissions';
import SettingsRoute from './Settings';
import { dashboardPath, dashboardUrl, submissionsPath } from 'helpers/urlHelper';
import { UserAuthWrapper } from 'redux-auth-wrapper';
import { routerActions } from 'react-router-redux'

/*  Note: Instead of using JSX, we recommend using react-router
    PlainRoute objects to build route definitions.   */


const UserIsAuthenticated = UserAuthWrapper({
  authSelector: state => state.auth, // how to get the user state
  redirectAction: routerActions.replace, // the redux action to dispatch for redirect
  wrapperDisplayName: 'UserIsAuthenticated', // a nice name for this auth check
  predicate: user => user.authStatus !== 'NOT_LOGGED_IN'
});


export default (store) => ({
  path: dashboardPath,
  component: UserIsAuthenticated(DashboardLayout),
  childRoutes: [
    FormsRoute(store),
    SubmissionsRoute(store),
    SettingsRoute(store)
  ],
  indexRoute: {
    onEnter: (nextState, replace) => replace(dashboardUrl(submissionsPath))
  }
});
