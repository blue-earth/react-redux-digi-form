// We only need to import the modules necessary for initial render
import DashboardLayout from 'layouts/DashboardLayout';
import FormsRoute from './Forms';
import SubmissionsRoute from './Submissions';
import SettingsRoute from './Settings';
import { dashboardPath, dashboardUrl, submissionsPath } from 'helpers/urlHelper';
import { routerActions } from 'react-router-redux';
import requiresAuth from 'containers/RequireAuth/RequireAuth';

/*  Note: Instead of using JSX, we recommend using react-router
    PlainRoute objects to build route definitions.   */


export default (store) => ({
  path: dashboardPath,
  component: requiresAuth(DashboardLayout),
  childRoutes: [
    FormsRoute(store),
    SubmissionsRoute(store),
    SettingsRoute(store)
  ],
  indexRoute: {
    onEnter: (nextState, replace) => replace(dashboardUrl(submissionsPath))
  }
});
