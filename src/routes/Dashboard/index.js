// We only need to import the modules necessary for initial render
import DashboardLayout from 'layouts/DashboardLayout';
import FormsRoute from './Forms';
import SubmissionsRoute from './Submissions';
import SettingsRoute from './Settings';
import { dashboardPath } from 'helpers/urlHelper';

/*  Note: Instead of using JSX, we recommend using react-router
    PlainRoute objects to build route definitions.   */

export default (store) => ({
  path: dashboardPath,
  component: DashboardLayout,
  childRoutes: [
    FormsRoute(store),
    SubmissionsRoute(store),
    SettingsRoute(store)
  ]
});
