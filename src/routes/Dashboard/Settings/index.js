// import { injectReducer } from 'redux/reducers';
import SettingsLayoutContainer from './containers/SettingsContainer';
import ProfileSettings from './components/ProfileSettings/ProfileSettings';
import NotificationSettings from './components/NotificationSettings/NotificationSettings';
import { settingsPath, settingsUrl } from 'helpers/urlHelper';

export default (store) => ({
  path: settingsPath,
  getChildRoutes(location, cb) {
    require.ensure([], (require) => {
      // const reducer = require('redux/modules/formBuilder').default;
      // injectReducer(store, { key: 'formBuilder', reducer });
      // do asynchronous stuff to find the child routes
      // cb(null, [ announcementsRoute, gradesRoute, assignmentsRoute ])

      cb(null, [
        {
          path: 'profile',
          component: ProfileSettings
        },
        {
          path: 'notifications',
          component: NotificationSettings
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
