// We only need to import the modules necessary for initial render
import DashboardLayout from 'layouts/DashboardLayout';
import BuilderRoute from '../Builder';
import SubmissionsRoute from '../Submissions';

/*  Note: Instead of using JSX, we recommend using react-router
    PlainRoute objects to build route definitions.   */

export default (store) => ({
  path: '/dashboard',
  component: DashboardLayout,
  childRoutes: [
    BuilderRoute(store),
    SubmissionsRoute(store)
  ]
});
