// We only need to import the modules necessary for initial render
import CoreLayout from '../layouts/CoreLayout';
import Home from './Home';
import FormInteractiveRoute from './FormInteractive';
import DashboardRoute from './Dashboard';

/*  Note: Instead of using JSX, we recommend using react-router
    PlainRoute objects to build route definitions.   */

export default (store) => ({
  path: '/',
  component: CoreLayout,
  indexRoute: Home,
  childRoutes: [
    FormInteractiveRoute(store),
    DashboardRoute(store)
  ]
});
