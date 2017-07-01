// We only need to import the modules necessary for initial render

import CoreLayout from '../layouts/CoreLayout';
import FormInteractiveRoute from './FormInteractive';
import DashboardRoute from './Dashboard';
import LoginRoute from './Login';
import SignUpRoute from './SignUp';
import {
  rootPath,
  loginUrl
} from 'helpers/urlHelper';

/*  Note: Instead of using JSX, we recommend using react-router
    PlainRoute objects to build route definitions.   */

export default (store) => ({
  path: rootPath,
  component: CoreLayout,
  indexRoute: {
    onEnter: (nextState, replace) => replace(loginUrl())
  },
  childRoutes: [
    FormInteractiveRoute(store),
    DashboardRoute(store),
    LoginRoute(store),
    SignUpRoute(store)
  ]
});
