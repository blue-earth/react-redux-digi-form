import { injectReducer } from 'redux/reducers';
import SettingsLayoutContainer from './containers/SettingsContainer';
import ProfileSettings from './containers/ProfileSettingsContainer';
import BillingSettings from './components/BillingSettings/BillingSettings';
import { settingsPath, settingsUrl } from 'helpers/urlHelper';
// import { combineReducers } from 'redux';
export default (store) => ({
  path: settingsPath,
  getChildRoutes(location, cb) {
    require.ensure([], (require) => {
      const reducer = require('redux/modules/profile').default;
      injectReducer(store, { key: 'profile', reducer });
      // do asynchronous stuff to find the child routes
      // cb(null, [ announcementsRoute, gradesRoute, assignmentsRoute ])
      cb(null, [
        {
          path: 'profile',
          component: ProfileSettings
        },
        {
          path: 'billing',
          component: BillingSettings
        }
      ]);
    });
  },
  component: SettingsLayoutContainer,
  indexRoute: {
    // todo: any better way to avoid repeating the full paths?
    onEnter: (nextState, replace) => replace(settingsUrl('profile'))
  }
});
